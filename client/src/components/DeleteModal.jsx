// Import React library for creating React components
import React from 'react';

// DeleteModal component for displaying a confirmation modal for book deletion
const DeleteModal = ({ isOpen, onClose, id, handleConfirmDelete }) => {
    // If the modal is not open or no book ID is provided, return null (don't render the modal)
    if (!isOpen || !id) return null;

    // Render the deletion confirmation modal
    return (
        <div className={`fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    {/* Header of the modal */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
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
                    {/* Modal body with a message */}
                    <div className="p-4 md:p-5">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this book?
                        </p>
                    </div>
                    {/* Modal footer with delete and cancel buttons */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                        {/* Delete button */}
                        <button
                            onClick={handleConfirmDelete}
                            type="button"
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Delete
                        </button>
                        {/* Cancel button */}
                        <button
                            onClick={onClose}
                            type="button"
                            className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the DeleteModal component
export default DeleteModal;
