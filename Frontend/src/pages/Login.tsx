import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { useLoginMutation, useLoginUserMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducer/userReducer";

const Login = () => {
	const [gender, setGender] = useState<string>("");
	const [date, setDate] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login] = useLoginMutation();
	const [loginWithCredentials] = useLoginUserMutation();

	const loginHandler = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const { user } = await signInWithPopup(auth, provider);

			const res = await login({
				name: user.displayName!,
				email: user.email!,
				photo: user.photoURL!,
				gender,
				role: "user",
				dob: date,
				_id: user.uid,
				password: "firebase_google",
			});

			if ("data" in res) {
				toast.success(res.data?.message || "Login Successful");
				navigate("/store");
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = error.data as MessageResponse;
				toast.error(message.message);
			}
		} catch (error) {
			console.error("Error during sign-in:", error);
			toast.error("Sign in failed");
		}
	};

	const handleManualLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await loginWithCredentials({
				email,
				password,
			}).unwrap();
			localStorage.setItem("user", JSON.stringify(res.user));
			dispatch(userExist(res.user));
			toast.success(res.message || "Login Successful");
			navigate("/store");
		} catch (err) {
			const error = err as FetchBaseQueryError;
			const message =
				(error.data as MessageResponse)?.message || "Login failed";
			toast.error(message);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
			<div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
			<div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
			<div className="max-w-md w-full space-y-8 relative">
				<div className="bg-white/90 backdrop-blur-sm py-8 px-8 shadow-xl rounded-3xl border border-white/20">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
							<svg
								className="h-6 w-6 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Welcome back
						</h2>
						<p className="text-gray-600">
							Please sign in to your account
						</p>
					</div>

					<div className="space-y-6">
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Email address
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								placeholder="Enter your email"
								required
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value.trimStart())
									}
									className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
									placeholder="Enter your password"
									required
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
								>
									{showPassword ? (
										<svg
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 00-.007 4.243m4.242-4.243L15.536 8.464M14.122 14.122a3 3 0 00-.007-4.243"
											/>
										</svg>
									) : (
										<svg
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
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
						</div>

						{/* Gender */}
						<div>
							<label
								htmlFor="gender"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Gender
							</label>
							<select
								id="gender"
								value={gender}
								onChange={(e) => setGender(e.target.value)}
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
							>
								<option value="">Select gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
						</div>

						{/* Date */}
						<div>
							<label
								htmlFor="date"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Date of birth
							</label>
							<input
								id="date"
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								max={new Date().toISOString().split("T")[0]}
								required
							/>
						</div>

						{/* Login Button */}
						<button
							onClick={handleManualLogin}
							disabled={isLoading}
							className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</button>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						{/* Google Button */}
						<button
							onClick={loginHandler}
							className="w-full flex justify-center items-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							<svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</button>

						{/* Footer */}
						<p className="text-center text-sm text-gray-600 mt-6">
							Don't have an account?{" "}
							<Link to="/signup">
								<button className="font-medium text-blue-600 hover:text-blue-500">
									Sign up
								</button>
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
