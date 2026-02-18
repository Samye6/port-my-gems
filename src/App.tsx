import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnreadProvider } from "@/contexts/UnreadContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import MessageNotification from "@/components/MessageNotification";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import MessagesLayout from "./pages/MessagesLayout";
import Scenarios from "./pages/Scenarios";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import Subscriptions from "./pages/Subscriptions";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UnreadProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <MessageNotification />
            <Routes>
          <Route path="/" element={<Scenarios />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/conversations" element={<MessagesLayout />} />
          <Route path="/conversations/:id" element={<MessagesLayout />} />
          <Route path="/chat/:id" element={<MessagesLayout />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </UnreadProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
