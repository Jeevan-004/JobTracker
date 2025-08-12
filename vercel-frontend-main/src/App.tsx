import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import JobTracker from "./pages/JobTracker";
import JobStatusPage from "./pages/JobStatusPage";
import ResumeFeedback from "./pages/ResumeFeedback";
import JDAnalysis from "./pages/JDAnalysis";
import Analytics from "./pages/Analytics";
import ResponsiveAppLayout from "@/components/ResponsiveAppLayout";
import NotFound from "./pages/NotFound";
import { JobProvider } from "./contexts/JobContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";

// Add framer-motion
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <JobProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<ResponsiveAppLayout />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/job-tracker" element={<JobTracker />} />
                      <Route path="/job-tracker/:status" element={<JobStatusPage />} />
                      <Route path="/resume-feedback" element={<ResumeFeedback />} />
                      <Route path="/jd-analysis" element={<JDAnalysis />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </Route>
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </TooltipProvider>
          </JobProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
