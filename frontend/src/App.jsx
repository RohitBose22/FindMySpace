import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProperty from "./pages/AddProperty";
import Navbar from "./components/Navbar";
import PropertyList from "./components/PropertyList";
import UserProfile from "./pages/UserProfile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChatPage from "./pages/ChatPage"; 
import PropertyDetails from "./pages/PropertyDetails";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/add-property"
            element={<ProtectedRoute element={<AddProperty />} />}
          />
          <Route path="/property/:id" element={<PropertyDetails />} />

          
          <Route
            path="/chat"
            element={<ProtectedRoute element={<ChatPage />} />}
          />

          
          <Route path="/chat/:chatId" element={<Navigate to="/chat" />} />

          <Route
            path="/profile"
            element={<ProtectedRoute element={<UserProfile />} />}
          />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
