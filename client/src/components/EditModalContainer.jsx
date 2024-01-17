// Import necessary hooks and components
import { useQueryClient, useMutation } from '@tanstack/react-query';
import EditModal from './EditModal';

// EditModalContainer component for managing state and logic related to editing a book
const EditModalContainer = ({ isOpen, onClose, rowData, columns }) => {
  // Create a query client to interact with React Query
  const queryClient = useQueryClient();

  // Function to convert ISO date string to YYYY-MM-DD format
  const convertISOtoYYYYMMDD = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Define a mutation for editing a book
  const editBookMutation = useMutation({
    mutationFn: async (formData) => {
      // Send a PUT request to update the book data
      const response = await fetch(`http://localhost:8000/api/v1/books/${rowData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse the response JSON
      const data = await response.json();

      // If the response is not okay, throw an error with the error message
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Return the updated book data
      return data;
    },
    // Callback function to run on successful mutation
    onSuccess: () => {
      console.log('Book updated successfully');
      // Invalidate the 'books' query in the cache to trigger a refetch
      queryClient.invalidateQueries(['books']);
      // Close the edit modal
      onClose();
    },
    // Callback function to run on error during mutation
    onError: (error) => {
      console.error(error);
    },
  });

  // Render the EditModal component with the relevant props and state
  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      rowData={rowData}
      columns={columns}
      editBookMutation={editBookMutation}
      convertISOtoYYYYMMDD={convertISOtoYYYYMMDD}
    />
  );
};

// Export the EditModalContainer component
export default EditModalContainer;
