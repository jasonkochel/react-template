import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Detail from "./pages/Detail";
import Menu from "./pages/Menu";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/:id" element={<Detail />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
