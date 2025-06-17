import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { teamMembers } from "../data/teamMembers";
import { Link } from "react-router-dom";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const statsItem = {
	hidden: { opacity: 0, scale: 0.8 },
	show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const AboutUs = () => {
	return (
		<div className="min-h-screen flex flex-col about-sec">
			<main className="flex-grow bg-white text-gray-800 overflow-hidden">
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
					className="bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-500 py-24"
				>
					<div className="container mx-auto px-6 text-center">
						<motion.div
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="max-w-4xl mx-auto"
						>
							<h1 className="text-4xl md:text-4xl font-bold text-white mb-6 leading-tight">
								Our Mission
							</h1>
							<p className="text-lg md:text-2xl text-purple-100 leading-relaxed">
								We're committed to providing high-quality
								products with exceptional customer service,
								making shopping simple, enjoyable, and
								accessible for everyone.
							</p>
						</motion.div>

						<motion.div
							variants={container}
							initial="hidden"
							whileInView="show"
							viewport={{ once: true }}
							className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
						>
							{[
								{ value: "50K+", label: "Happy Customers" },
								{ value: "1000+", label: "Products" },
								{ value: "24/7", label: "Support" },
							].map((stat, index) => (
								<motion.div
									key={index}
									variants={statsItem}
									whileHover={{ y: -5 }}
									className="bg-gray-200 p-8 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-sm"
								>
									<span className="text-4xl font-bold text-purple-600 block mb-3">
										{stat.value}
									</span>
									<p className="text-gray-700 text-lg font-medium">
										{stat.label}
									</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</motion.section>

				<section className="py-20 bg-gray-50">
					<div className="container mx-auto px-6">
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="text-center mb-16"
						>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
								Meet Our Team
							</h2>
							<div className="w-24 h-1 bg-purple-500 mx-auto rounded-full"></div>
						</motion.div>

						<motion.div
							variants={container}
							initial="hidden"
							whileInView="show"
							viewport={{ once: true }}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
						>
							{teamMembers.map((member) => (
								<motion.div
									key={member.id}
									variants={item}
									whileHover={{ y: -5 }}
									className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center border border-gray-100"
								>
									<div className="relative w-28 h-28 mb-6">
										<motion.img
											src={member.photo}
											alt={member.name}
											className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
											onError={(e) =>
												(e.currentTarget.src =
													"/default-avatar.jpg")
											}
											whileHover={{ scale: 1.03 }}
										/>
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-1">
										{member.name}
									</h3>
									<p className="text-purple-600 font-medium mb-4">
										{member.position}
									</p>
									<p className="text-gray-600 mb-4">
										{member.bio}
									</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>

				<motion.section
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white"
				>
					<div className="container mx-auto px-6 text-center">
						<div className="max-w-3xl mx-auto">
							<h3 className="text-2xl md:text-3xl font-bold mb-6">
								Ready to experience the difference?
							</h3>
							<p className="text-purple-100 mb-8 text-lg">
								Join thousands of satisfied customers who trust
								our products and services.
							</p>
							<Link to="/store">
								<motion.button
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.98 }}
									className="px-5 py-2 bg-white text-purple-700 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
								>
									Get Started
								</motion.button>
							</Link>
						</div>
					</div>
				</motion.section>
			</main>

			<Footer />
		</div>
	);
};

export default AboutUs;


