import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegComments } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { createChat } from "../api/api";
import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleChatWithOwner = async () => {
    if (!token || !user) {
      alert("Please login to start a chat.");
      return;
    }

    if (!property.owner || !property.owner._id) {
      alert("Invalid property details. Cannot start chat.");
      console.error("Invalid owner object:", property.owner);
      return;
    }

    console.log("Starting chat with owner ID:", property.owner._id);

    try {
      const res = await createChat(property.owner._id, token);

      if (!res?.data?._id) {
        console.error("Chat creation failed or no chat ID returned:", res?.data);
        alert("Could not start chat. Try again.");
        return;
      }

      console.log("Chat created successfully:", res.data);
      navigate(`/chat/${res.data._id}`);
    } catch (error) {
      console.error("Error during chat creation:", error);
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

        <button
          onClick={() => navigate(`/properties/${property._id}`)}
          className="view-button"
        >
          View Property
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
