"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TrainDetails = ({ trainID }) => {
	const router = useRouter();

	const [data, setData] = useState(null);

	const getDetails = async () => {
		const res = await fetch("/api/trains/find", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ trainID }),
		});
		if (res.ok) {
			const json = await res.json();
			setData(json);
		} else {
			const json = await res.json();
			alert(json.message);
			router.push("/trains");
		}
	};

	useEffect(() => {
		getDetails();
	}, [trainID]);

	const copyTrainID = () => {
		if (data) {
			navigator.clipboard
				.writeText(data.train.trainID)
				.then(() => {
					alert("Train ID copied to clipboard!");
				})
				.catch((err) => {
					console.error("Failed to copy: ", err);
				});
		}
	};

	const handleCall = (number) => {
		window.open(`tel:${number}`);
	};

	const handleWhatsApp = (number) => {
		window.open(`https://wa.me/+91${number}`);
	};

	const deleteTrain = async (trainID) => {
		if (!confirm("Are you sure you want to delete this train?")) return;

		const res = await fetch("/api/trains/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ trainID }),
		});
		if (res.ok) {
			const json = await res.json();
			alert(json.message);
			router.push("/trains");
		} else {
			const json = await res.json();
			alert(json.message);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			{data ? (
				<div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
					<h2 className="text-2xl font-bold mb-4 text-center">
						Train Trip Details
					</h2>
					<h3 className="text-lg font-semibold">
						Train Trip ID:{" "}
						<span className="text-blue-600">
							{data.train.trainID}
						</span>
						<button
							onClick={copyTrainID}
							className="ml-2 text-sm text-white bg-blue-500 p-2 rounded hover:bg-blue-600 transition"
						>
							Copy Train Trip ID
						</button>
					</h3>
					<p>
						<strong>Name:</strong> {data.train.name}
					</p>
					<p>
						<strong>Roll Number:</strong> {data.train.roll}
					</p>
					<p>
						<strong>Mobile Number:</strong> {data.train.number}
					</p>
					<p>
						<strong>Email: </strong> {data.train.email}
					</p>
					<p>
						<strong>Train Number:</strong> {data.train.trainNumber}
					</p>
					<p>
						<strong>Date:</strong>{" "}
						{new Date(data.train.date).toLocaleDateString()}
					</p>

					<h3 className="text-lg font-semibold mt-4">
						Common Trains Trips (Same Train Number and Date):
					</h3>
					<ul className="mt-2">
						{data.similiar.length === 0 && (
							<p>
								No common train trips found! Please check again
								later.
							</p>
						)}
						{data.similiar.map((train, idx) => (
							<li key={idx} className="border p-2">
								<p>
									<strong>Name:</strong> {train.name}
								</p>
								<p>
									<strong>Roll Number:</strong> {train.roll}
								</p>
								<p>
									<strong>Mobile Number:</strong>{" "}
									{train.number}
									<button
										onClick={() =>
											handleCall(data.train.number)
										}
										className="ml-2 bg-blue-500 text-white p-1 px-2 rounded"
									>
										Call
									</button>
									<button
										onClick={() =>
											handleWhatsApp(data.train.number)
										}
										className="ml-2 bg-green-500 text-white p-1 px-2 rounded"
									>
										WhatsApp
									</button>
								</p>
								<p>
									<strong>Email: </strong>{" "}
									<a
										href={`mailto:${train.email}`}
										target="_blank"
									>
										{train.email}
									</a>
								</p>
								<p>
									<strong>Train Number:</strong>{" "}
									{train.trainNumber}
								</p>
								<p>
									<strong>Date:</strong>{" "}
									{new Date(train.date).toLocaleDateString()}
								</p>
							</li>
						))}
					</ul>
					<button
						onClick={() => router.push("/trains/my-trains")}
						className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
					>
						My Train Trips
					</button>
					<button
						onClick={() => deleteTrain(data.train.trainID)}
						className="mt-2 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
					>
						Delete this Train Trip
					</button>
					<button
						onClick={() => router.push("/trains")}
						className="mt-3 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
					>
						Back to Trains Page
					</button>
				</div>
			) : (
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
				</div>
			)}
		</div>
	);
};

export default TrainDetails;