import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegComments } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChatWithOwner = async () => {
    if (!token || !user) {
      alert("Please login to start a chat.");
      return;
    }

    if (!property.owner || !property.owner._id) {
      console.error("Error: Property owner is missing.");
      alert("Invalid property details. Cannot start chat.");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ownerId: property.owner._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to start chat");
      }

      navigate(`/chat/${data._id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Could not start chat. Try again.");
    }
  };

  return (
    <div className="property-card">
      {property.images && property.images.length > 0 ? (
        <img
          src={property.images[0]}
          alt={`${property.title} image 1`}
          className="property-image"
        />
      ) : (
        <p>No images available</p>
      )}

      <h3>{property.title}</h3>
      <p className="property-description">{property.description}</p>
      <p className="property-price">Price: ${property.price}</p>
      <p className="property-location">Location: {property.location}</p>

      <div className="property-card-buttons">
        <button onClick={handleChatWithOwner} className="chat-button">
          <FaRegComments /> Chat with Owner
        </button>

        <button onClick={() => navigate(`/property/${property._id}`)} className="view-button">
          View Property
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
