import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; 
import "../styles/Navbar.css"; 
const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>FindMySpace</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/properties">Properties</Link></li>

        {user ? (
          <>
            <li><Link to="/add-property">Add Property</Link></li>
            <li>
              <Link to="/profile" className="user-profile">
                <FaUserCircle className="user-icon" /> {user.username}
              </Link>
            </li>
            <li>
              <Link to="/chat">My Chats</Link> 
            </li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;





