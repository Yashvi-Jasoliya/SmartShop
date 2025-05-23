// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useRegisterMutation } from "../redux/api/userAPI";
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
// import { MessageResponse } from "../types/api-types";
// import { ObjectId } from "bson";

// const Signup = () => {
// 	const [name, setName] = useState("");
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [gender, setGender] = useState("");
// 	const [dob, setDob] = useState("");
// 	const navigate = useNavigate();

// 	const [register] = useRegisterMutation();

// 	const handleSignup = async (e: React.FormEvent) => {
// 		e.preventDefault();

// 		if (!name || !email || !password || !gender || !dob) {
// 			toast.error("Please fill in all fields");
// 			return;
// 		}

// 		try {
// 			const res = await register({
// 				// _id: new ObjectId().toHexString(),
// 				name,
// 				email,
// 				password,
// 				gender,
// 				dob,
// 			});

// 			if ("data" in res) {
// 				toast.success("Signup successful");
// 				navigate("/login");
// 			} else {
// 				const error = res.error as FetchBaseQueryError;
// 				const message =
// 					(error.data as MessageResponse)?.message || "Signup failed";
// 				toast.error(message);
// 			}
// 		} catch (error) {
// 			console.error("Signup error:", error);
// 			toast.error("Signup failed. Please try again.");
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-gray-50">
// 			<main className="w-full max-w-md p-6 bg-white rounded shadow space-y-4">
// 				<h1 className="text-2xl font-bold text-center">Sign Up</h1>

// 				<form onSubmit={handleSignup} className="space-y-4">
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700">
// 							Name
// 						</label>
// 						<input
// 							type="text"
// 							placeholder="Enter your name"
// 							value={name}
// 							onChange={(e) => setName(e.target.value)}
// 							className="w-full border px-3 py-2 rounded mt-1"
// 							required
// 						/>
// 					</div>

// 					<div>
// 						<label className="block text-sm font-medium text-gray-700">
// 							Email
// 						</label>
// 						<input
// 							type="email"
// 							placeholder="Enter your email"
// 							value={email}
// 							onChange={(e) => setEmail(e.target.value)}
// 							className="w-full border px-3 py-2 rounded mt-1"
// 							required
// 						/>
// 					</div>

// 					<div>
// 						<label className="block text-sm font-medium text-gray-700">
// 							Password
// 						</label>
// 						<input
// 							type="password"
// 							placeholder="Create a password"
// 							value={password}
// 							onChange={(e) => setPassword(e.target.value)}
// 							className="w-full border px-3 py-2 rounded mt-1"
// 							required
// 							minLength={6}
// 						/>
// 					</div>

// 					<div>
// 						<label className="block text-sm font-medium text-gray-700">
// 							Gender
// 						</label>
// 						<select
// 							value={gender}
// 							onChange={(e) => setGender(e.target.value)}
// 							className="w-full border px-3 py-2 rounded mt-1"
// 							required
// 						>
// 							<option value="">Select Gender</option>
// 							<option value="Male">Male</option>
// 							<option value="Female">Female</option>

// 						</select>
// 					</div>

// 					<div>
// 						<label className="block text-sm font-medium text-gray-700">
// 							Date of Birth
// 						</label>
// 						<input
// 							type="date"
// 							value={dob}
// 							onChange={(e) => setDob(e.target.value)}
// 							className="w-full border px-3 py-2 rounded mt-1"
// 							required
// 							max={new Date().toISOString().split("T")[0]}
// 						/>
// 					</div>

// 					<button
// 						type="submit"
// 						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
// 					>
// 						Sign Up
// 					</button>
// 				</form>

// 				<div className="text-center text-sm">
// 					<p className="text-gray-600">
// 						Already have an account?{" "}
// 						<Link
// 							to="/login"
// 							className="text-blue-500 hover:underline font-medium"
// 						>
// 							Login
// 						</Link>
// 					</p>
// 				</div>
// 			</main>
// 		</div>
// 	);
// };

// export default Signup;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";


const Signup = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDob] = useState("");
	const navigate = useNavigate();

	const [register] = useRegisterMutation();

const handleSignup = async (e: React.FormEvent) => {
	e.preventDefault();

	if (!name || !email || !password || !gender || !dob) {
		toast.error("Please fill in all fields");
		return;
	}

	try {
		const res = await register({
			name,
			email,
			password,
			gender,
			dob,
			photo: "https://i.ibb.co/5nD1JxG/avatar.png", // ✅ this is required
		});

		if ("data" in res) {
			toast.success("Signup successful");
			navigate("/login");
		} else {
			const error = res.error as FetchBaseQueryError;
			const message =
				(error.data as MessageResponse)?.message || "Signup failed";
			toast.error(message);
		}
	} catch (error) {
		console.error("Signup error:", error);
		toast.error("Signup failed. Please try again.");
	}
};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<main className="w-full max-w-md p-6 bg-white rounded shadow space-y-4">
				<h1 className="text-2xl font-bold text-center">Sign Up</h1>

				<form onSubmit={handleSignup} className="space-y-4">
					<input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full border px-3 py-2 rounded"
						required
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border px-3 py-2 rounded"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border px-3 py-2 rounded"
						required
						minLength={6}
					/>
					<select
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						className="w-full border px-3 py-2 rounded"
						required
					>
						<option value="">Select Gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
					</select>
					<input
						type="date"
						value={dob}
						onChange={(e) => setDob(e.target.value)}
						className="w-full border px-3 py-2 rounded"
						required
						max={new Date().toISOString().split("T")[0]}
					/>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
					>
						Sign Up
					</button>
				</form>

				<p className="text-center text-sm">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-500 hover:underline">
						Login
					</Link>
				</p>
			</main>
		</div>
	);
};

export default Signup;

