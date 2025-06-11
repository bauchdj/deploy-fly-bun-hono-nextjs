"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const url = "http://localhost:1284/hello-hono";

	useEffect(() => {
		const fetchMessage = async () => {
			try {
				const response = await axios.get(url);
				setMessage(response.data);
			} catch (err) {
				console.error(err);
				setError("Failed to fetch message");
			} finally {
				setLoading(false);
			}
		};

		fetchMessage();
	}, []);

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
