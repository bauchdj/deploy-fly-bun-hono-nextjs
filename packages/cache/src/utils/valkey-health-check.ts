import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { lookup } from "dns/promises";

const HOST = config.env.VALKEY_HOST;
const PORT = Number(config.env.VALKEY_PORT);

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function checkValkeyConnection() {
	let result = false;

	try {
		const conn = await Bun.connect({
			hostname: HOST,
			port: PORT,
			socket: {
				data(socket, data) {
					const text = decoder.decode(data);
					if (text.trim() === "+PONG") {
						console.log("✅ Valkey responded with PONG");
						socket.end();
						result = true;
					} else if (text.trim() === "-NOAUTH Authentication required.") {
						console.log("✅ Valkey responded with OK");
						socket.end();
						result = true;
					} else {
						console.error("❌ Unexpected response:", text);
						socket.end();
						result = false;
						// process.exit(1);
					}
				},
				connectError(_socket, err) {
					console.error("❌ Connection error:", err.message);
					result = false;
					// process.exit(1);
				},
				error(_socket, err) {
					console.error("❌ Socket error:", err.message);
					result = false;
					// process.exit(1);
				},
				close(_socket) {
					// No-op
				},
			},
		});

		// Send PING in Redis protocol
		conn.write(encoder.encode("*1\r\n$4\r\nPING\r\n"));
	} catch (err) {
		console.error("❌ Bun failed to connect:", (err as Error).message);
		result = false;
		// process.exit(1);
	}

	return result;
}

async function testDns(hostname: string): Promise<boolean> {
	try {
		const pgAddress = await lookup(config.env.DATABASE_HOST, { family: 6 });
		console.log(`✅ postgres resolves to:`, pgAddress.address);
	} catch (err) {
		console.error(`❌ Failed to resolve ${config.env.DATABASE_HOST}:`, (err as Error).message);
	}

	try {
		const address = await lookup(hostname, { family: 6 });
		console.log(`✅ ${hostname} resolves to:`, address.address);
		return true;
	} catch (err) {
		console.error(`❌ Failed to resolve ${hostname}:`, (err as Error).message);
		return false;
	}
}

export async function canConnectToValkey() {
	console.log({
		host: HOST,
		port: PORT,
	});

	try {
		const dnsResult = await testDns(HOST);
		console.log("DNS result:", dnsResult);

		if (!dnsResult) {
			return false;
		}

		const connectionResult = await checkValkeyConnection();
		console.log("Valkey connection result:", connectionResult);

		return connectionResult;
	} catch (err) {
		console.error("❌ Failed to connect:", (err as Error).message);
		return false;
	}
}
