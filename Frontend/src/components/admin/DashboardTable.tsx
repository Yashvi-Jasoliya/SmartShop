import { Column } from "react-table";
import TableHOC from "./TableHOC";

interface DataType {
	_id: string;
	quantity: number;
	discount: number;
	amount: number;
	status: string;
}

const columns: Column<DataType>[] = [
	{
		Header: "Id",
		accessor: "_id",
		Cell: ({ value }) => value.slice(-10),
	},
	{
		Header: "Quantity",
		accessor: "quantity",
	},
	{
		Header: "Discount",
		accessor: "discount",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
	{
		Header: "Status",
		accessor: "status",
	},
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
	return TableHOC<DataType>(
		columns,
		data,
		"transactionBox",
		"Top Transaction"
	)();
};

export default DashboardTable;
