import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Dummy data simulating deals from your backend
const dummyDeals = [
	{ id: 1, name: "Summer Sale", discount: "30%", expires: "2025-06-30" },
	{
		id: 2,
		name: "Festival",
		discount: "50%",
		expires: "2025-11-27",
	},
	{ id: 3, name: "New Year Offer", discount: "20%", expires: "2026-01-10" },
	{ id: 4, name: "Flash Sale", discount: "15%", expires: "2025-05-25" },
];

const DealsPage = () => {
	const [deals, setDeals] = useState<typeof dummyDeals>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setDeals(dummyDeals);
			setIsLoading(false);
		}, 500);
	}, []);

	const filteredDeals = deals.filter((deal) =>
		deal.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-10 px-4">
			<h5 className="text-3xl font-bold text-[#7B3FD1] mb-8 drop-shadow-lg">
				Deals
			</h5>

			<input
				type="text"
				placeholder="Search deals..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="w-full max-w-md p-3 mb-8 rounded-xl border-2 border-[#7B3FD1] placeholder:text-[#B8A9E3] focus:outline-none focus:ring-4 focus:ring-[#7B3FD1]/50 text-[#2D2F36] font-semibold shadow-lg transition"
			/>

			{isLoading ? (
				<p className="text-[#7B3FD1] font-semibold text-lg animate-pulse">
					Loading deals...
				</p>
			) : filteredDeals.length > 0 ? (
				<div className="overflow-x-auto w-full max-w-4xl rounded-xl shadow-xl bg-white">
					<table className="w-full table-auto border-separate border-spacing-y-4 px-6">
						<thead>
							<tr>
								<th className="text-center pl-8 text-[#2D2F36]/80 font-semibold text-lg">
									#
								</th>
								<th className="text-center text-[#2D2F36]/80 font-semibold text-lg">
									Deal Name
								</th>
								<th className="text-center text-[#7B3FD1] font-bold text-lg">
									Discount
								</th>
								<th className="text-center pr-8 text-[#B88C28] font-semibold text-lg">
									Expires On
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredDeals.map((deal, index) => (
								<tr
									key={deal.id}
									className="bg-[#F4F1FF] rounded-lg hover:bg-[#E6D9F7] cursor-pointer transition-colors duration-300"
								>
									<td className="pl-8 py-4 text-[#2D2F36] font-semibold text-center">
										{index + 1}
									</td>
									<td className="text-center text-[#2D2F36]">
										{deal.name}
									</td>
									<td className="text-center text-[#7B3FD1] font-extrabold">
										{deal.discount}
									</td>
									<td className="pr-8 text-center text-[#B88C28] font-semibold italic">
										{deal.expires}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="text-[#7B3FD1] mt-20 text-xl font-medium italic">
					No matching deals found.
				</p>
			)}
		</div>
	);
};

export default DealsPage;
