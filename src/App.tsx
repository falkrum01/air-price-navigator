
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
import TravelBooking from "./pages/TravelBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import Hotels from "./pages/Hotels";
import Hostels from "./pages/Hostels";
import PriceTrends from "./pages/PriceTrends";
import Airports from "./pages/Airports";
import Cabs from "./pages/Cabs";
import { AuthProvider } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
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
        <BookingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
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
              <Route path="/travel-booking" element={
                <PrivateRoute>
                  <TravelBooking />
                </PrivateRoute>
              } />
              <Route path="/booking-confirmation" element={
                <PrivateRoute>
                  <BookingConfirmation />
                </PrivateRoute>
              } />
              <Route path="/hotels" element={
                <PrivateRoute>
                  <Hotels />
                </PrivateRoute>
              } />
              <Route path="/hostels" element={
                <PrivateRoute>
                  <Hostels />
                </PrivateRoute>
              } />
              <Route path="/cabs" element={
                <PrivateRoute>
                  <Cabs />
                </PrivateRoute>
              } />
              <Route path="/price-trends" element={
                <PrivateRoute>
                  <PriceTrends />
                </PrivateRoute>
              } />
              <Route path="/airports" element={
                <PrivateRoute>
                  <Airports />
                </PrivateRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
