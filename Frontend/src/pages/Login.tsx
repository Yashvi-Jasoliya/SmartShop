import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
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
				navigate("/");
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
			navigate("/");
		} catch (err) {
			const error = err as FetchBaseQueryError;
			const message =
				(error.data as MessageResponse)?.message || "Login failed";
			toast.error(message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-100 p-4">
			<main className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
				<div className="text-center">
					<h1 className="font-extrabold text-xl text-gray-800">
						Welcome Back 👋
					</h1>
					<p className="text-gray-500 mt-1">Login to your account</p>
				</div>

				<form onSubmit={handleManualLogin} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>

					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>

					<select
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Select Gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
					</select>

					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
						max={new Date().toISOString().split("T")[0]}
					/>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
					>
						Login
					</button>
				</form>

				<div className="flex items-center justify-between gap-2">
					<hr className="flex-grow border-gray-300" />
					<span className="text-gray-400 text-sm">or</span>
					<hr className="flex-grow border-gray-300" />
				</div>

				<button
					onClick={loginHandler}
					className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:bg-gray-100 transition"
				>
					<FcGoogle size={24} />
					<span className="text-sm font-medium">
						Sign in with Google
					</span>
				</button>

				<p className="text-center text-gray-600 text-sm">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="text-blue-600 hover:underline font-semibold"
					>
						Signup
					</Link>
				</p>
			</main>
		</div>
	);
};

export default Login;
