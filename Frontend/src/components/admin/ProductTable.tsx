import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableSkeleton from "../../components/admin/skeleton/TableSkeleton";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { CustomError } from "../../types/api-types";
import { UserReducerInitialState } from "../../types/reducer-types";

interface DataType {
	image: ReactElement;
	name: string;
	price: number;
	category: string;
}

const columns: Column<DataType>[] = [
	{
		Header: "Image",
		accessor: "image",
	},
	{
		Header: "Name",
		accessor: "name",
	},
	{
		Header: "Price",
		accessor: "price",
	},
	{
		Header: "category",
		accessor: "category",
	},
];

const ProductTable = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReducerInitialState }) => state.userReducer
	);

	const { isLoading, isError, error, data } = useAllProductsQuery(user?._id!);

	const [rows, setRows] = useState<DataType[]>([]);

	if (isError) {
		toast.error((error as CustomError).data.message);
	}

	useEffect(() => {
		if (data) {
			setRows(
				data.products.map((i) => ({
					image: <img src={i.images[0]} />,
					name: i.name,
					price: i.price,
					category: i.category,
				}))
			);
		}
	}, [data]);

	const Table = TableHOC<DataType>(
		columns,
		rows,
		"dashboardProductBox",
		"Products",
		rows.length > 5
	)();

	return (
		<div className="d-flex justify-center">
			<main className="productPage">
				{isLoading ? <TableSkeleton /> : Table}
			</main>
		</div>
	);
};

export default ProductTable;
