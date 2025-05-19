import { useCategoriesQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const brandBlue = "rgb(0, 115, 255)";

const CategoryTable = () => {
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
		<div
			className="min-h-screen flex flex-col items-center p-6"
			style={{
				background:
					"linear-gradient(135deg, #fff, #dbeafe, #fff)", // soft blues background
			}}
		>
			<h3
				className="text-3xl font-extrabold mb-8 drop-shadow-lg"
				style={{ color: brandBlue }}
			>
				Category List
			</h3>

			<input
				type="text"
				placeholder="Search category..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-full max-w-md p-3 mb-6 rounded-lg border shadow-sm transition"
				style={{
					borderColor: brandBlue,
					color: brandBlue,
					boxShadow: `0 0 8px ${brandBlue}66`,
				}}
			/>

			{isLoading ? (
				<p
					className="text-center font-semibold animate-pulse"
					style={{ color: brandBlue }}
				>
					Loading categories...
				</p>
			) : filteredCategories.length > 0 ? (
				<div className="overflow-x-auto w-full max-w-lg shadow-lg rounded-lg bg-white">
					<table className="w-full border-collapse">
						<thead
							className="font-semibold"
							style={{
								backgroundColor: "#cfe2ff",
								color: brandBlue,
							}}
						>
							<tr>
								<th className="px-6 py-4 border-b border-blue-300 text-left">
									#
								</th>
								<th className="px-6 py-4 border-b border-blue-300 text-left">
									Category Name
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredCategories.map(
								(cat: string, index: number) => (
									<tr
										key={cat}
										className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
									>
										<td className="px-6 py-4 border-b border-blue-100 text-gray-700 font-medium">
											{index + 1}
										</td>
										<td className="px-6 py-4 border-b border-blue-100 text-gray-900">
											{cat}
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			) : (
				<p
					className="text-center mt-10 italic text-lg font-medium"
					style={{ color: brandBlue }}
				>
					{CategoriesResponse?.categories?.length === 0
						? "No categories available."
						: "No matching categories found."}
				</p>
			)}
		</div>
	);
};

export default CategoryTable;
