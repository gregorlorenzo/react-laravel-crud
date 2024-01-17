// Import necessary hooks and components
import { useState, useEffect } from 'react';
import genresData from '../assets/genre.json'; // Import your JSON file

// EditModal component for editing book details
const EditModal = ({ isOpen, onClose, rowData, columns, editBookMutation, convertISOtoYYYYMMDD }) => {
    // State variables to manage form data and error handling
    const [error, setError] = useState(null);
    const [descriptionExceedsLimit, setDescriptionExceedsLimit] = useState(false);
    const [descriptionCharacterCount, setDescriptionCharacterCount] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState('');

    // Update selected genre when rowData changes
    useEffect(() => {
        setSelectedGenre(rowData?.genre || '');
    }, [rowData]);

    // If the modal is not open or rowData is not available, return null
    if (!isOpen || !rowData) return null;

    // Extracting relevant columns for rendering form fields
    const updatedColumns = columns.slice(1, -1);

    // Event handler for description input change
    const handleDescriptionChange = (e) => {
        const descriptionValue = e.target.value;
        const exceedsLimit = descriptionValue.length > 250;

        setDescriptionExceedsLimit(exceedsLimit);
        setDescriptionCharacterCount(descriptionValue.length);
    };

    // Event handler for genre selection change
    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    // Event handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extract form data from the form
        const formData = {};
        updatedColumns.forEach((column) => {
            formData[column.accessorKey] =
                column.accessorKey === 'genre' ? selectedGenre : e.target.elements[column.accessorKey].value;
        });

        // Convert ISO date format if the 'birthday' field is present
        if (formData.birthday) {
            const birthday = new Date(formData.birthday);
            formData.birthday = convertISOtoYYYYMMDD(birthday);
        }

        try {
            // Perform the mutation to update book details
            await editBookMutation.mutateAsync(formData);
            console.log('Book updated successfully!');
            // Close the modal on successful update
            onClose();
        } catch (error) {
            // Handle and log errors during mutation
            console.error('Error updating book:', error.message);
            setError(error.message || 'An error occurred');
        }
    };

    // Render the edit book modal
    return (
        <div className={`fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">Edit Book</h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                        {updatedColumns.map((column) => (
                            <div key={column.accessorKey} className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor={column.accessorKey} className="block mb-2 text-sm font-medium text-gray-900">
                                        {column.header}
                                    </label>
                                    {column.header === 'Description' ? (
                                        <div>
                                            <textarea
                                                name={column.accessorKey}
                                                id={column.accessorKey}
                                                defaultValue={rowData[column.accessorKey]}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                placeholder={`Enter ${column.header}`}
                                                onChange={handleDescriptionChange}
                                                required=""
                                            />
                                            {descriptionExceedsLimit && (
                                                <div className="text-red-500 text-sm mt-2">Character limit exceeded (max 250 characters).</div>
                                            )}
                                            <div className="text-gray-500 text-sm mt-2">
                                                Character Count: {descriptionCharacterCount}/250
                                            </div>
                                        </div>
                                    ) : column.header === 'Genre' ? (
                                        <select
                                            name={column.accessorKey}
                                            id={column.accessorKey}
                                            value={selectedGenre}
                                            onChange={handleGenreChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            required
                                        >
                                            <option value="" disabled>Select a genre</option>
                                            {genresData.map((genre) => (
                                                <option key={genre.id} value={genre.name}>
                                                    {genre.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={column.type || 'text'}
                                            name={column.accessorKey}
                                            id={column.accessorKey}
                                            defaultValue={rowData[column.accessorKey]}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder={`Enter ${column.header}`}
                                            required=""
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Update Book
                        </button>
                    </form>
                    {error && <div className="text-red-500">{error}</div>}
                </div>
            </div>
        </div>
    );
};

// Export the EditModal component
export default EditModal;
