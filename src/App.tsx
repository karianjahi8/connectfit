import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/components/providers/Web3Provider";
import LandingPage from "./pages/LandingPage";
import TrainersPage from "./pages/TrainersPage";
import TrainerDetailPage from "./pages/TrainerDetailPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import ClubsPage from "./pages/ClubsPage";
import MarketplacePage from "./pages/MarketplacePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import InstallPage from "./pages/InstallPage";
import AuthPage from "./pages/AuthPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ActivityPage from "./pages/ActivityPage";
import WaitlistPage from "./pages/WaitlistPage";
import NotFound from "./pages/NotFound";
import { ChatWidget } from "./components/chatbot/ChatWidget";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/trainers/:id" element={<TrainerDetailPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:id" element={<MarketplacePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/vendor" element={<VendorDashboardPage />} />
          <Route path="/install" element={<InstallPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
