
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FlightTracker from "./pages/FlightTracker";
import Team from "./pages/Team";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Redirect from root to auth or home based on auth state */}
            <Route path="/" element={<Navigate replace to="/auth" />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Index />
              </PrivateRoute>
            } />
            <Route path="/flight-tracker" element={
              <PrivateRoute>
                <FlightTracker />
              </PrivateRoute>
            } />
            <Route path="/team" element={
              <PrivateRoute>
                <Team />
              </PrivateRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
