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

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			toast.error("Please enter a valid email");
			return;
		}

		// You can add API call for subscription here if needed

		toast.success("Thank you for subscribing!");
		setEmail(""); // Clear input
	};

	return (
		<footer className="bg-gray-900 text-gray-400 py-12">
			<div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
				{/* Brand & Description */}
				<div className="max-w-sm">
					<h2 className="text-3xl font-extrabold mb-3 tracking-wide text-gray-100">
						Smart<span className="text-gray-400">Shop</span>
					</h2>
					<p className="leading-relaxed text-gray-400 text-sm mr-8"    >
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
							<li>
								<a
									href="/features"
									className="hover:text-gray-200"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="/pricing"
									className="hover:text-gray-200"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="/reviews"
									className="hover:text-gray-200"
								>
									Reviews
								</a>
							</li>
							<li>
								<a
									href="/updates"
									className="hover:text-gray-200"
								>
									Updates
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-gray-400 font-semibold mb-4">
							Company
						</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="/about"
									className="hover:text-gray-200"
								>
									About Us
								</a>
							</li>
							<li>
								<a href="/blog" className="hover:text-gray-200">
									Blog
								</a>
							</li>
							<li>
								<a
									href="/careers"
									className="hover:text-gray-200"
								>
									Careers
								</a>
							</li>
							<li>
								<a
									href="/contact"
									className="hover:text-gray-200"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-gray-400 font-semibold mb-4">
							Support
						</h3>
						<ul className="space-y-3">
							<li>
								<a href="/help" className="hover:text-gray-200">
									Help Center
								</a>
							</li>
							<li>
								<a
									href="/terms"
									className="hover:text-gray-200"
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href="/privacy"
									className="hover:text-gray-200"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a href="/faq" className="hover:text-gray-200">
									FAQ
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-gray-400 font-semibold mb-4">
							Subscribe
						</h3>
						<p className="mb-4">
							Get the latest updates and offers right in your
							inbox.
						</p>
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
