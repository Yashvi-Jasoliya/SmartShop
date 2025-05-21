import Footer from "../components/Footer";
import { teamMembers } from "../data/teamMembers";

const AboutUs = () => {
	return (
		<>
			<div className="bg-white text-gray-800">
				<section className="bg-gradient-to-r from-blue-100 to-blue-200 py-16">
					<div className="container mx-auto px-6 text-center">
						<h2 className="text-4xl font-bold text-blue-700 mb-4">
							Our Mission
						</h2>
						<p className="text-lg max-w-2xl mx-auto">
							We're committed to providing high-quality products
							with exceptional customer service, making shopping
							simple, enjoyable, and accessible for everyone.
						</p>

						<div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="bg-white shadow-md p-6 rounded-lg">
								<span className="text-3xl font-bold text-blue-600">
									10K+
								</span>
								<p className="text-gray-600">Happy Customers</p>
							</div>
							<div className="bg-white shadow-md p-6 rounded-lg">
								<span className="text-3xl font-bold text-blue-600">
									500+
								</span>
								<p className="text-gray-600">Products</p>
							</div>
							<div className="bg-white shadow-md p-6 rounded-lg">
								<span className="text-3xl font-bold text-blue-600">
									24/7
								</span>
								<p className="text-gray-600">Support</p>
							</div>
						</div>
					</div>
				</section>

				<section className="py-16 bg-gray-50">
					<div className="container mx-auto px-6">
						<h2 className="text-3xl font-bold text-center text-blue-700 mb-10">
							Meet Our Team
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
							{teamMembers.map((member) => (
								<div
									key={member.id}
									className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
								>
									<img
										src={member.photo}
										alt={member.name}
										className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
										onError={(e) =>
											(e.currentTarget.src =
												"/default-avatar.jpg")
										}
									/>
									<h3 className="text-xl font-semibold text-center">
										{member.name}
									</h3>
									<p className="text-center text-blue-500">
										{member.position}
									</p>
									<p className="text-sm text-gray-600 mt-2 text-center">
										{member.bio}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="py-16 bg-white">
					<div className="container mx-auto px-6">
						<h3 className="text-3xl font-bold text-center text-blue-700 mb-10">
							Our Core Values
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="bg-blue-50 p-6 rounded-lg shadow text-center">
								<div className="text-4xl mb-2">💎</div>
								<h3 className="text-xl font-semibold">
									Quality
								</h3>
								<p className="text-gray-600 text-sm mt-2">
									We source only the finest materials for our
									products
								</p>
							</div>
							<div className="bg-blue-50 p-6 rounded-lg shadow text-center">
								<div className="text-4xl mb-2">❤️</div>
								<h3 className="text-xl font-semibold">
									Customer First
								</h3>
								<p className="text-gray-600 text-sm mt-2">
									Your satisfaction is our top priority
								</p>
							</div>
							<div className="bg-blue-50 p-6 rounded-lg shadow text-center">
								<div className="text-4xl mb-2">♻️</div>
								<h3 className="text-xl font-semibold">
									Sustainability
								</h3>
								<p className="text-gray-600 text-sm mt-2">
									Eco-friendly practices in everything we do
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>

			<Footer />
		</>
	);
};

export default AboutUs;
