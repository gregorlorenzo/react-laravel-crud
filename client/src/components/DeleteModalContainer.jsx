// Import necessary dependencies
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import DeleteModal from './DeleteModal';

// DeleteModalContainer component for managing the state and logic related to book deletion
const DeleteModalContainer = ({ isOpen, onClose, id }) => {
    // Access the query client from react-query
    const queryClient = useQueryClient();

    // Define a mutation for deleting a book
    const deleteBookMutation = useMutation({
        // Async function to handle the actual mutation
        mutationFn: async (id) => {
            // Send a DELETE request to the server with the book ID
            const response = await fetch(`http://localhost:8000/api/v1/books/${id}`, {
                method: 'DELETE',
            });

            // If the response is not OK, throw an error
            if (!response.ok) {
                throw new Error('Failed to delete book');
            }
        },
        // Callback function called on successful mutation
        onSuccess: () => {
            console.log('Book deleted successfully');

            // Invalidate the 'books' query to refetch the data
            queryClient.invalidateQueries(['books']);

            // Close the delete modal
            onClose();
        },
        // Callback function called on mutation error
        onError: (error) => {
            console.error('Error deleting book', error);
        },
    });

    // Callback function to handle the confirmation of book deletion
    const handleConfirmDelete = async () => {
        try {
            // Trigger the deleteBookMutation with the book ID
            await deleteBookMutation.mutateAsync(id);
            console.log('Book deleted successfully');

            // Close the delete modal
            onClose();
        } catch (error) {
            console.error('Error deleting book:', error.message);
        }
    };

    // Render the DeleteModal component with necessary props
    return <DeleteModal isOpen={isOpen} onClose={onClose} id={id} handleConfirmDelete={handleConfirmDelete} />;
};

// Export the DeleteModalContainer component
export default DeleteModalContainer;
