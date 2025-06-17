import { useEffect, useRef, useState } from "react";
import {
	FiMail,
	FiPhone,
	FiMapPin,
	FiSend,
	FiCheckCircle,
} from "react-icons/fi";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
	const { user } = useSelector((state: RootState) => state.userReducer);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const navigate = useNavigate();

	const toastShown = useRef(false);

	useEffect(() => {
		if (!user && !toastShown.current) {
			toastShown.current = true;
			toast.error("Please login first to contact us");
			navigate("/login");
		}
	}, [user, navigate]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitted(true);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Get in <span className="text-blue-600">Touch</span>
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						We'd love to hear from you! Reach out for queries,
						feedback, or collaborations.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					<div className="space-y-6">
						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-start gap-4">
								<div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
									<FiMail className="text-blue-600 dark:text-blue-300 text-xl" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 dark:text-white">
										Email Us
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										SmartShop@gmail.com
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-start gap-4">
								<div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
									<FiPhone className="text-purple-600 dark:text-purple-300 text-xl" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 dark:text-white">
										Call Us
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										+91 85478-45675
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
							<div className="flex items-start gap-4">
								<div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
									<FiMapPin className="text-green-600 dark:text-green-300 text-xl" />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 dark:text-white">
										Visit Us
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										123 Tech Park, Mumbai, India
									</p>
								</div>
							</div>
						</div>

						<div className="flex gap-4 justify-center md:justify-start">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
								aria-label="Facebook"
							>
								<FaFacebookF className="w-5 h-5 text-blue-500" />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
								aria-label="Twitter"
							>
								<FaTwitter className="w-5 h-5 text-blue-700" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
								aria-label="Instagram"
							>
								<FaInstagram className="w-5 h-5 text-pink-600" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
								aria-label="LinkedIn"
							>
								<FaLinkedinIn className="w-5 h-5 text-blue-700" />
							</a>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl">
						{isSubmitted ? (
							<div className="text-center py-8">
								<FiCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
									Thank You!
								</h3>
								<p className="text-gray-600 dark:text-gray-300">
									We've received your message and will respond
									within 24 hours.
								</p>
							</div>
						) : (
							<>
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
									Send a Message
								</h2>
								<form
									onSubmit={handleSubmit}
									className="space-y-6"
								>
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										>
											Name
										</label>
										<input
											type="text"
											id="name"
											value={formData.name}
											onChange={(e) => {
												const value = e.target.value;
												// Allow only letters and spaces
												if (
													/^[a-zA-Z\s]*$/.test(value)
												) {
													setFormData({
														...formData,
														name: value.trimStart(),
													});
												}
											}}
											className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
											required
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										>
											Email
										</label>
										<input
											type="email"
											id="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({
													...formData,
													email: e.target.value.trimStart(),
												})
											}
											className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
											required
										/>
									</div>

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										>
											Message
										</label>
										<textarea
											id="message"
											rows={4}
											value={formData.message}
											onChange={(e) => {
												const value = e.target.value;
												if (!/^\d+$/.test(value)) {
													setFormData({
														...formData,
														message:
															value.trimStart(),
													});
												}
											}}
											className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
											required
										/>
									</div>

									<button
										type="submit"
										className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
									>
										<FiSend className="mr-2" />
										Send Message
									</button>
								</form>
							</>
						)}
					</div>
				</div>

				<div className="mt-16 max-w-3xl mx-auto">
					<h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
						Frequently Asked Questions
					</h2>
					<div className="space-y-4">
						{[
							{
								question:
									"How long does it take to get a response?",
								answer: "We typically respond within 24 hours on business days.",
							},
							{
								question: "Do you offer 24/7 support?",
								answer: "Our support team is available Monday-Friday, 9AM-5PM IST.",
							},
						].map((faq, index) => (
							<div
								key={index}
								className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow"
							>
								<h3 className="font-medium text-gray-900 dark:text-white">
									{faq.question}
								</h3>
								<p className="mt-2 text-gray-600 dark:text-gray-300">
									{faq.answer}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
