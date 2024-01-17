// Import necessary dependencies and data
import { useState } from 'react';
import genresData from '../assets/genre.json';

// CreateModal component for adding a new book
const CreateModal = ({ isOpen, onClose, columns, addBookMutation }) => {
    // State variables for error handling, selected genre, and form data
    const [error, setError] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('');
    const updatedColumns = columns.slice(1, -1);

    // State to track form data
    const initialFormData = {
        ...Object.fromEntries(updatedColumns.map((column) => [column.accessorKey, ''])),
        Genre: '',
    };
    const [formData, setFormData] = useState(initialFormData);

    // Handler for genre selection change
    const handleGenreChange = (e) => {
        const selectedGenre = e.target.value;
        setFormData({ ...formData, Genre: selectedGenre });
        setSelectedGenre(selectedGenre);
    };

    // Constants for handling description character count and limit
    const MAX_DESCRIPTION_LENGTH = 250;
    const [descriptionExceedsLimit, setDescriptionExceedsLimit] = useState(false);
    const [descriptionCharacterCount, setDescriptionCharacterCount] = useState(0);

    // Handler for description input change
    const handleDescriptionChange = (e) => {
        const descriptionValue = e.target.value;
        const exceedsLimit = descriptionValue.length > MAX_DESCRIPTION_LENGTH;

        setDescriptionExceedsLimit(exceedsLimit);
        setDescriptionCharacterCount(descriptionValue.length);

        setFormData({ ...formData, Description: descriptionValue });
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extract form data from the form
        const newFormData = {};
        updatedColumns.forEach((column) => {
            newFormData[column.accessorKey] = e.target.elements[column.accessorKey].value;
        });

        try {
            // Use the addBookMutation function to add a new book
            await addBookMutation.mutateAsync(newFormData);
            console.log('Book added successfully');

            // Reset form data after successful submission
            setFormData(initialFormData);

            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error adding book:', error.message);
            setError(error.message || 'An error occurred');
        }
    };

    // Render the CreateModal component
    return (
        <div className={`fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        {/* Modal title and close button */}
                        <h3 className="text-lg font-semibold text-gray-900">Add New Book</h3>
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
                    {/* Form for adding a new book */}
                    <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                        {updatedColumns.map((column) => (
                            <div key={column.accessorKey} className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    {/* Label for form input */}
                                    <label htmlFor={column.accessorKey} className="block mb-2 text-sm font-medium text-gray-900">
                                        {column.header}
                                    </label>
                                    {/* Form input based on column type */}
                                    {column.header === 'Description' ? (
                                        <>
                                            {/* Textarea for description with character count */}
                                            <textarea
                                                name={column.accessorKey}
                                                id={column.accessorKey}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                placeholder={`Enter ${column.header}`}
                                                required=""
                                                value={formData.Description}
                                                onChange={handleDescriptionChange}
                                            />

                                            {descriptionExceedsLimit && (
                                                <div className="text-red-500 text-sm mt-2">Character limit exceeded (max 250 characters).</div>
                                            )}
                                            <div className="text-gray-500 text-sm mt-2">
                                                Character Count: {descriptionCharacterCount}/250
                                            </div>
                                        </>
                                    ) : column.header === 'Genre' ? (
                                        // Dropdown for selecting genre
                                        <select
                                            name={column.accessorKey}
                                            id={column.accessorKey}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            value={selectedGenre}
                                            onChange={handleGenreChange}
                                        >
                                            <option value="" disabled>Select a genre</option>
                                            {genresData.map((genre) => (
                                                <option key={genre.id} value={genre.name}>
                                                    {genre.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        // Input for other columns
                                        <input
                                            type={column.type || 'text'}
                                            name={column.accessorKey}
                                            id={column.accessorKey}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                            placeholder={`Enter ${column.header}`}
                                            required=""
                                            value={formData[column.accessorKey]}
                                            onChange={(e) => setFormData({ ...formData, [column.accessorKey]: e.target.value })}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Button for submitting the form */}
                        <button
                            type="submit"
                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Add new book
                        </button>
                    </form>
                    {/* Display error message if there is an error */}
                    {error && <div className="text-red-500">{error}</div>}
                </div>
            </div>
        </div>
    );
};

// Export the CreateModal component
export default CreateModal;
