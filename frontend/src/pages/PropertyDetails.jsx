import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <p className="loading-msg">Loading property...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!property) return <p className="not-found-msg">Property not found.</p>;

  return (
    <div className="property-details">
      <h2 className="property-title">{property.title}</h2>

      <div className="property-images">
        {property.images && property.images.length > 0 ? (
          property.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Property Image ${index + 1}`}
              className="property-image"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      <p className="property-description">{property.description}</p>
      <p className="property-price"><strong>Price:</strong> ₹{property.price}</p>
      <p className="property-location"><strong>Location:</strong> {property.location}</p>
      {property.owner && (
        <p className="property-owner">
          <strong>Owner:</strong> {property.owner.name} ({property.owner.email})
        </p>
      )}
    </div>
  );
};

export default PropertyDetails;
