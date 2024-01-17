// Import necessary dependencies
import { useQueryClient, useMutation } from '@tanstack/react-query';
import CreateModal from './CreateModal';

// CreateModalContainer component for managing the state and logic related to book creation
const CreateModalContainer = ({ isOpen, onClose, columns }) => {
  // Access the query client from react-query
  const queryClient = useQueryClient();

  // Define a mutation for adding a new book
  const addBookMutation = useMutation({
    // Async function to handle the actual mutation
    mutationFn: async (formData) => {
      // Send a POST request to the server with the form data
      const response = await fetch('http://localhost:8000/api/v1/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse the response JSON
      const data = await response.json();

      // If the response is not OK, throw an error with the message
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Return the data on success
      return data;
    },
    // Callback function called on successful mutation
    onSuccess: () => {
      console.log('Book added successfully');

      // Invalidate the 'books' query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ['books'],
      });
    },
    // Callback function called on mutation error
    onError: (error) => {
      console.error(error);
    },
  });

  // Render the CreateModal component with necessary props
  return (
    <CreateModal isOpen={isOpen} onClose={onClose} addBookMutation={addBookMutation} columns={columns} />
  );
};

// Export the CreateModalContainer component
export default CreateModalContainer;
