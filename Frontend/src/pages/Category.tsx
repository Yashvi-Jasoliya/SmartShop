import { useCategoriesQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom"; 

const categoryEmojis: Record<string, string> = {
	fashion: "👗",
	electronics: "📱",
	garden: "🪴",
	furniture: "🛋️",
	toys: "🎲",
	books: "📚",
	sports: "🏀",
	beauty: "💄",
	food: "🍜",
	grocery: "🛍️",
};


const getColorClass = (index: number) => {
	const colors = [
		"bg-gradient-to-br from-purple-400 to-blue-400",
		"bg-gradient-to-br from-green-400 to-emerald-400",
		"bg-gradient-to-br from-yellow-400 to-orange-400",
		"bg-gradient-to-br from-pink-400 to-rose-400",
		"bg-gradient-to-br from-indigo-400 to-violet-400",
	];
	return colors[index % colors.length];
};

const CategoryCards = () => {
	const navigate = useNavigate(); 

	const {
		data: CategoriesResponse,
		isLoading,
		isError,
		error,
	} = useCategoriesQuery("");

	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (isError && error && "data" in error) {
			toast.error(
				(error as any)?.data?.message || "Failed to fetch categories"
			);
		} else if (isError) {
			toast.error("An unknown error occurred while fetching categories.");
		}
	}, [isError, error]);

	const filteredCategories =
		CategoriesResponse?.categories?.filter((cat: string) =>
			cat.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];

	return (
		<>
			<div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-white to-blue-50">
				<h3 className="text-3xl font-extrabold mb-8 text-blue-600 drop-shadow-md">
					Categories
				</h3>

				<input
					type="text"
					placeholder="Search category..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full max-w-md p-3 mb-8 rounded-xl border shadow focus:ring-2 focus:ring-blue-400"
				/>

				{isLoading ? (
					<p className="text-center text-blue-500 font-medium animate-pulse">
						Loading categories...
					</p>
				) : filteredCategories.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
						{filteredCategories.map(
							(cat: string, index: number) => {
								const emoji =
									categoryEmojis[cat.toLowerCase()] || "";

								return (
									<div
										key={cat}
										className={`rounded-xl ${getColorClass(
											index
										)} shadow-lg p-6 flex flex-col items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer`}
										onClick={() =>
											navigate(`/search?category=${cat}`)
										} 
									>
										<div className="text-4xl">{emoji}</div>
										<h4 className="text-lg font-semibold mt-4 text-white text-center">
											{cat.toUpperCase()}
										</h4>
									</div>
								);
							}
						)}
					</div>
				) : (
					<p className="text-center mt-10 italic text-lg text-blue-600">
						{CategoriesResponse?.categories?.length === 0
							? "No categories available."
							: "No matching categories found."}
					</p>
				)}
			</div>

			<Footer />
		</>
	);
};

export default CategoryCards;
