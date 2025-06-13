"use client";

import { type HandlerType } from "@demo/server/handlers";
// import axios from "axios";
import { hc } from "hono/client";
import { useEffect, useState } from "react";

const host = process.env.NEXT_PUBLIC_SERVER_URL;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
if (!host || !endpoint) {
	throw new Error("Missing environment variables");
}
// const url = `${host}/${endpoint}`;

const client = hc<HandlerType>(host);

export default function Home() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchMessage = async () => {
			try {
				const response = await client.hello.$get();
				// const response = await axios.get(url);
				if (response.ok) {
					// if (response.status === 200) {
					const message = await response.text();
					// const message = response.data;
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
