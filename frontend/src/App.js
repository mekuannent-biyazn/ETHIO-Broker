// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login"; // Corrected casing
import Register from "./pages/register"; // Corrected casing
import Dashboard from "./pages/dashboard"; // Corrected casing
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authcontext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected route */}
          <Route
            path="/"
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