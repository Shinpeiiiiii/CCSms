import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000*60,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const Provider = ({ children }) => {
    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default Provider;