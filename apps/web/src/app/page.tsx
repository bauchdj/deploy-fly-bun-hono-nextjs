"use client";

import { type HelloHandler } from "@deploy-fly-bun-hono-nextjs/server/handlers";
import { hc } from "hono/client";
import { useEffect, useState } from "react";

const URL = process.env.NEXT_PUBLIC_SERVER_URL;
const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
if (!URL || !ENDPOINT) {
	throw new Error("Missing environment variables");
}

let url = "";
if (URL.includes("https://") || URL.includes("http://")) {
	url = URL;
} else {
	url = `http://${URL}`;
}

const client = hc<HelloHandler>(url);

export default function Home() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchMessage = async () => {
			try {
				const response = await client.hello.$get();
				if (response.ok) {
					const message = await response.text();
					setMessage(message);
				} else {
					console.error(response);
					handlerOnError();
				}
			} catch (err) {
				console.error(err);
				handlerOnError();
			} finally {
				setLoading(false);
			}
		};

		fetchMessage();
	}, []);

	function handlerOnError() {
		setError("Failed to fetch message");
	}

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<div className="text-center">
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<p className="text-2xl font-semibold">{message}</p>
				)}
			</div>
		</div>
	);
}
