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
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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
				photo: "https://i.ibb.co/5nD1JxG/avatar.png",
			});

			if ("data" in res) {
				toast.success("registered successfully");
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
			</div>

			<div className="relative w-full max-w-md">
				<div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
					<div className="text-center space-y-2">
						<div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
							<svg
								className="w-8 h-8 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Create Account
						</h1>
						<p className="text-gray-600">
							Join us and start your journey
						</p>
					</div>

					{/* Form */}
					<div className="space-y-5">
						{/* Name Field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Full Name
							</label>
							<input
								type="text"
								placeholder="Enter your full name"
								value={name}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
								required
								onChange={(e) => {
									const value = e.target.value;
									if (/^[a-zA-Z\s]*$/.test(value)) {
										setName(value.trimStart());
									}
								}}
							/>
						</div>

						{/* Email Field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								Email Address
							</label>
							<input
								type="email"
								placeholder="Enter your email"
								value={email}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
								required
								onChange={(e) =>
									setEmail(e.target.value.trimStart())
								}
							/>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Create a strong password"
									value={password}
									className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
									required
									minLength={6}
									onChange={(e) =>
										setPassword(e.target.value.trimStart())
									}
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
								>
									{showPassword ? (
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878L12 12m6.364-3.536l-1.414 1.414M12 12l1.414 1.414M12 12l-1.414-1.414"
											/>
										</svg>
									) : (
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									)}
								</button>
							</div>
							{password && password.length < 6 && (
								<p className="text-sm text-red-500 flex items-center gap-1">
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									Password must be at least 6 characters
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							{/* Gender Field */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Gender
								</label>
								<select
									value={gender}
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
									required
									onChange={(e) => setGender(e.target.value)}
								>
									<option value="">Select</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>

							{/* Date of Birth Field */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Birth Date
								</label>
								<input
									type="date"
									value={dob}
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm outline-none"
									required
									max={new Date().toISOString().split("T")[0]}
									onChange={(e) => setDob(e.target.value)}
								/>
							</div>
						</div>

						<button
							onClick={handleSignup}
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									Creating Account...
								</>
							) : (
								<>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
									Create Account
								</>
							)}
						</button>
					</div>

					<div className="text-center pt-4 border-t border-gray-100">
						<p className="text-gray-600 text-sm">
							Already have an account?{" "}
							<Link to="/login">
								<button className="font-medium text-blue-600 hover:text-purple-600 transition-colors duration-200 underline">
									Signin
								</button>
							</Link>
						</p>
					</div>
				</div>

				<div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl -z-10 blur-sm"></div>
			</div>
		</div>
	);
};

export default Signup;
