// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import the new components
import Login from "./pages/login"; 
import Register from "./pages/register"; 
import Dashboard from "./pages/dashboard"; 
import HomePage from "./pages/home"; // 💡 IMPORT THE HOMEPAGE COMPONENT
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authcontext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* 1. PUBLIC ROUTE: The Jiji-style Homepage (Root path) */}
          <Route path="/" element={<HomePage />} /> 

          {/* 2. PUBLIC ROUTES: Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 3. PROTECTED ROUTE: User Dashboard or Profile */}
          <Route
            path="/dashboard" // Changed path to /dashboard for clarity
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 