import React, { useState } from "react";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
} from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer: React.FC = (): JSX.Element => {
	const [email, setEmail] = useState("");

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			toast.error("Please enter a valid email");
			return;
		}

		try {
			const response = await fetch(
				"http://localhost:3005/api/subscribe",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email }),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.message || "Subscription failed");
			} else {
				toast.success(data.message || "Thank you for subscribing!");
				setEmail("");
			}
		} catch {
			toast.error("Something went wrong. Try again.");
		}
	};

	return (
		<footer className="bg-gray-900 text-gray-400 py-12">
			<div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
				<div className="max-w-sm">
					<h2 className="text-3xl font-extrabold mb-3 tracking-wide text-gray-100">
						Smart<span className="text-gray-400">Shop</span>
					</h2>
					<p className="leading-relaxed text-gray-400 text-sm mr-8">
						Read honest, genuine reviews from real customers to help
						you make better purchasing decisions.
					</p>
					<br />
					<p className="leading-relaxed text-gray-400 text-sm mr-8">
						Our system filters out suspicious or fake reviews to
						ensure you get the most trustworthy feedback on
						products.
					</p>
					<div className="flex space-x-4 mt-6">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-200 transition-colors duration-300"
							aria-label="Facebook"
						>
							<FaFacebookF size={20} />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-200 transition-colors duration-300"
							aria-label="Twitter"
						>
							<FaTwitter size={20} />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-200 transition-colors duration-300"
							aria-label="Instagram"
						>
							<FaInstagram size={20} />
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-200 transition-colors duration-300"
							aria-label="LinkedIn"
						>
							<FaLinkedinIn size={20} />
						</a>
					</div>
				</div>

				{/* Navigation Links */}
				<div className="grid grid-cols-2 gap-10 sm:grid-cols-4 text-sm">
					<div>
						<h3 className="text-gray-400 font-semibold mb-4">
							Product
						</h3>
						<ul className="space-y-3">
							<li className="hover:text-gray-50">Features</li>
							<li className="hover:text-gray-50">Pricing</li>
							<li className="hover:text-gray-50">Reviews</li>
							<li className="hover:text-gray-50">Updates</li>
						</ul>
					</div>
					<div>
						<h3 className="text-gray-400 font-semibold mb-4">
							Company
						</h3>
						<ul className="space-y-3">
							<li className="hover:text-gray-50">About Us</li>
							<li className="hover:text-gray-50">Blog</li>
							<li className="hover:text-gray-50">Careers</li>
							<li className="hover:text-gray-50">Contact</li>
						</ul>
					</div>
					<div>
						<h3 className="text-gray-400 font-semibold mb-4">
							Support
						</h3>
						<ul className="space-y-3 ">
							<li className="hover:text-gray-50">Help Center</li>
							<li className="hover:text-gray-50">
								Terms of Service
							</li>
							<li className="hover:text-gray-50">
								Privacy Policy
							</li>
							<li className="hover:text-gray-50">FAQ</li>
						</ul>
					</div>
					<div>
						<h3 className="text-gray-300 font-semibold mb-4">
							Subscribe
						</h3>
						<h2 className="mb-4 text-gray-300">
							Get the latest updates and offers right in your
							inbox.
						</h2>
						<form
							className="flex space-x-2"
							onSubmit={handleSubscribe}
						>
							<input
								type="email"
								placeholder="Your email"
								className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none"
								aria-label="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<button
								type="submit"
								className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-md font-semibold transition-colors"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</div>

			<div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm select-none">
				&copy; {new Date().getFullYear()} SmartShop. All rights
				reserved.
			</div>

			{/* Toast container */}
			<ToastContainer position="bottom-right" autoClose={2000} />
		</footer>
	);
};

export default Footer;
