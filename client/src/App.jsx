import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TableView from './views/TableView'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <section className="bg-gray-50 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <TableView />
        </div>
      </section>
    </QueryClientProvider>
  )
}

export default App
