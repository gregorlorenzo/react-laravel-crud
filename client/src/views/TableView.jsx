// Import necessary dependencies and components
import { useQuery } from '@tanstack/react-query'
import { flexRender, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import CreateModalContainer from "../components/CreateModalContainer";
import EditModalContainer from "../components/EditModalContainer";
import DeleteModalContainer from "../components/DeleteModalContainer";

// Main component representing the table view
const TableView = () => {
    // State variables for managing modal visibility and current row data
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [rowID, setRowID] = useState(null);
    const [currentRowData, setCurrentRowData] = useState(null);

    // Fetch data using react-query
    const { data: serverData, error } = useQuery({
        queryKey: ["books"],
        queryFn: async () => {
            const response = await fetch("http://127.0.0.1:8000/api/v1/books");

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        }
    });
    
    if (error) {
        // Handle the error (e.g., display an error message)
        console.error("Error fetching data:", error);
    }

    // Set data to fetched server data or an empty array if null
    const data = serverData ?? [];

    // Function to convert a date string to a formatted date
    function convertDateStringToFormattedDate(dateString) {
        const parsedDate = parseISO(dateString);
        const formattedDate = format(parsedDate, 'LLLL do, yyyy');
        return formattedDate;
    }

    // Function to handle closing of modals
    const handleClose = (modalType) => {
        console.log("Closing modal:", modalType);
        switch (modalType) {
            case 'create':
                setIsCreateOpen(false);
                break;
            case 'edit':
                setIsEditOpen(false);
                break;
            case 'delete':
                setIsDeleteOpen(false);
                break;
            default:
                break;
        }
    };

    // Function to handle opening of modals
    const handleOpen = (modalType, rowData) => {
        setIsCreateOpen(modalType === 'create');
        setIsEditOpen(modalType === 'edit');
        setIsDeleteOpen(modalType === 'delete');

        // Check if rowData is present before setting rowID and currentRowData
        if (rowData) {
            setRowID(modalType === 'delete' ? rowData : null);
            setCurrentRowData(modalType === 'edit' ? rowData : null);
        }
    };

    // Configuration for table columns
    const columns = [
        {
            header: "ID",
            accessorKey: "id",
            type: "number",
        },
        {
            header: "Title",
            accessorKey: "title",
        },
        {
            header: "Author",
            accessorKey: "author",
        },
        {
            header: "Genre",
            accessorKey: "genre",
        },
        {
            header: "Description",
            accessorKey: "description",
        },
        {
            header: "Published Date",
            accessorKey: "publishedDate",
            cell: (info) => convertDateStringToFormattedDate(info.getValue()),
            type: "date"
        },
        // Example column with custom cell rendering for actions
        {
            header: () => <span>Action</span>,
            accessorKey: "_id",
            cell: (info) => (
                <div className="flex gap-2">
                    <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-2 py-1.5"
                        onClick={() => handleOpen('edit', info.row.original)} >
                        Edit
                    </button>
                    <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5"
                        onClick={() => handleOpen('delete', info.row.original.id)}>
                        Delete
                    </button>
                </div>
            ),
            enableSorting: false
        }
    ]

    // State variables for sorting and filtering
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState('');

    // Initialize react-table using custom hook
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering
    });

    // Render the table view component
    return (
        <div className='bg-white relative shadow-md sm:rounded-lg overflow-hidden'>
            {/* Header section with search form and add new book button */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                {/* Search form */}
                <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                        {/* Search input */}
                        <label htmlFor="simple-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                                placeholder="Search"
                                required=""
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                {/* Buttons for add new book and other actions */}
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <button
                        type="button"
                        className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                        onClick={() => handleOpen('create')}
                    >
                        <svg
                            className="h-3.5 w-3.5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            />
                        </svg>
                        Add New Book
                    </button>
                </div>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                {/* Render the table with headers and rows */}
                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                    {/* Table header */}
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup._id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header._id} scope='col' className='px-6 py-3'>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {
                                            { asc: '⬆️', desc: '⬇️' }[header.column.getIsSorted() ?? null]
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    {/* Table body */}
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row._id} className='bg-white border-b'>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell._id} className='px-6 py-4'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Navigation section */}
            <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4">
                <div className="flex justify-start gap-2 mt-4">
                    {/* Buttons for page navigation */}
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 me-2"
                        onClick={() => table.setPageIndex(0)}>First Page</button>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 me-2 disabled:opacity-50"
                        disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Previous Page</button>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 me-2 disabled:opacity-50"
                        disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next Page</button>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2.5 me-2"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Last Page</button>
                </div>
            </nav>

            {/* Modals for creating, editing, and deleting */}
            <CreateModalContainer isOpen={isCreateOpen} onClose={() => handleClose('create')} columns={columns} />
            <EditModalContainer isOpen={isEditOpen} onClose={() => handleClose('edit')} rowData={currentRowData} columns={columns} />
            <DeleteModalContainer isOpen={isDeleteOpen} onClose={() => handleClose('delete')} id={rowID} />
        </div>
    );
}

// Export the TableView component
export default TableView;