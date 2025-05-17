import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import {
	Column,
	TableOptions,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";

function TableHOC<T extends object>(
	columns: Column<T>[],
	data: T[],
	containerClassname: string,
	heading: string,
	showPagination: boolean = false
) {
	return function HOC() {
		const options: TableOptions<T> = {
			columns,
			data,
			initialState: {
				pageSize: 5,
			},
		};

		const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			page,
			prepareRow,
			nextPage,
			previousPage,
			canNextPage,
			canPreviousPage,
			pageCount,
			state: { pageIndex },
		} = useTable(options, useSortBy, usePagination);

		return (
			<div className={containerClassname}>
				<h2 className="heading">{heading}</h2>

				<table className="table" {...getTableProps()}>
					<thead>
						{headerGroups.map((headerGroup) => {
							const { key, ...restHeaderGroupProps } =
								headerGroup.getHeaderGroupProps();
							return (
								<tr key={key} {...restHeaderGroupProps}>
									{headerGroup.headers.map((column) => {
										const {
											key: columnKey,
											...restHeaderProps
										} = column.getHeaderProps(
											column.getSortByToggleProps()
										);
										return (
											<th
												key={columnKey}
												{...restHeaderProps}
											>
												{column.render("Header")}{" "}
												{column.isSorted && (
													<span>
														{column.isSortedDesc ? (
															<HiSortDescending />
														) : (
															<HiSortAscending />
														)}
													</span>
												)}
											</th>
										);
									})}
								</tr>
							);
						})}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row) => {
							prepareRow(row);
							const { key, ...restRowProps } = row.getRowProps();
							return (
								<tr key={key} {...restRowProps}>
									{row.cells.map((cell) => {
										const {
											key: cellKey,
											...restCellProps
										} = cell.getCellProps();
										return (
											<td
												key={cellKey}
												{...restCellProps}
											>
												{cell.render("Cell")}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>

				{showPagination && (
					<div className="tablePagination">
						<button
							disabled={!canPreviousPage}
							onClick={previousPage}
						>
							Prev
						</button>
						<span>{`Page ${pageIndex + 1} of ${pageCount}`}</span>
						<button disabled={!canNextPage} onClick={nextPage}>
							Next
						</button>
					</div>
				)}
			</div>
		);
	};
}

export default TableHOC;
