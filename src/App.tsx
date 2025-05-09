import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { MovieProvider } from "../src/contexts/MovieContext";
import { AuthProvider } from "../src/contexts/AuthContext";

import Header from "../src/components/Header";
// import HomePage from "@/pages/HomePage";
// import MovieDetailsPage from "@/pages/MovieDetailsPage";
// import LoginPage from "@/pages/LoginPage";
// import FavoritesPage from "@/pages/FavoritesPage";
// import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <MovieProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">
                      <Routes>
                        {/* <Route path="/" element={<HomePage />} />
                        <Route path="/movie/:id" element={<MovieDetailsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="*" element={<NotFound />} /> */}
                      </Routes>
                    </main>
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </MovieProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
