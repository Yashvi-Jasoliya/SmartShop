import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Deals = [
	{
		id: 1,
		name: "Summer Sale",
		discount: "60%",
		startOn: "2025-08-30",
		category: "seasonal",
		gradient: "from-blue-400 to-green-400",
	},
	{
		id: 2,
		name: "Festival Offer",
		discount: "50%",
		startOn: "2025-11-27",
		category: "event",
		gradient: "from-indigo-500 to-purple-500",
	},
	{
		id: 3,
		name: "New Offers",
		discount: "70%",
		startOn: "2026-01-10",
		category: "holiday",
		gradient: "from-green-400 to-blue-500",
	},
	{
		id: 4,
		name: "Flash Sale",
		discount: "40%",
		startOn: "2025-09-30",
		category: "limited",
		gradient: "from-purple-500 to-indigo-500",
	},
];

const DealsPage = () => {
	const [deals, setDeals] = useState<typeof Deals>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState("all");
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			setDeals(Deals);
			setIsLoading(false);
		}, 300);
	}, []);

	const filteredDeals = deals.filter((deal) => {
		const matchesSearch = deal.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			activeCategory === "all" || deal.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	const handleDealClick = (discount: string) => {
		const discountValue = parseInt(discount.replace("%", ""));
		navigate(`/search?discount=${discountValue}`);
	};

	const categories = ["all", "seasonal", "event", "holiday", "limited"];

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 deals">
			<div className="container mx-auto px-4 py-12">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
						Exclusive Deals
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Discover limited-time offers and save big on your
						favorite products
					</p>
				</motion.div>

				<div className="max-w-4xl mx-auto mb-12">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-grow">
							<input
								type="text"
								placeholder="Search deals..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full p-2 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm bg-white"
							/>
							<svg
								className="absolute right-4 top-3 h-5 w-5 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 btn-deals">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={`px-5 rounded-full whitespace-nowrap transition-all ${
										activeCategory === category
											? "bg-purple-600 text-white shadow-md"
											: "bg-white text-gray-700 hover:bg-gray-100"
									}`}
								>
									{category.charAt(0).toUpperCase() +
										category.slice(1)}
								</button>
							))}
						</div>
					</div>
				</div>

				{isLoading ? (
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
					</div>
				) : filteredDeals.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 card-deals">
						{filteredDeals.map((deal) => (
							<motion.div
								key={deal.id}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
								whileHover={{ y: -5 }}
								className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
								onClick={() => handleDealClick(deal.discount)}
							>
								<div
									className={`relative h-40 bg-gradient-to-r ${deal.gradient} flex items-center justify-center`}
								>
									<div className="absolute inset-0 bg-black/10"></div>
									<span className="text-6xl text-white/90">
										{deal.category === "seasonal" && "☀️"}
										{deal.category === "event" && "🎪"}
										{deal.category === "holiday" && "✨"}
										{deal.category === "limited" && "⚡"}
									</span>
									<div className="absolute bottom-4 right-4 bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
										{deal.discount} OFF
									</div>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-800 mb-2">
										{deal.name}
									</h3>
									<div className="flex items-center text-gray-500 mb-4">
										<svg
											className="w-5 h-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<span>Limited Time Deal</span>
									</div>
									<button
										className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
										onClick={(e) => {
											e.stopPropagation();
											handleDealClick(deal.discount);
										}}
									>
										View Products
									</button>
								</div>
							</motion.div>
						))}
					</div>
				) : (
					<div className="text-center py-20">
						<div className="text-gray-400 mb-4">
							<svg
								className="w-16 h-16 mx-auto"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-medium text-gray-700 mb-2">
							No deals found
						</h3>
						<p className="text-gray-500">
							Try adjusting your search or filter criteria
						</p>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default DealsPage;
