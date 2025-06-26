import React, { useState, useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import "../styles/PropertyList.css";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("sortOrder") || "lowToHigh"
  );

  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (filterType !== "all") {
          params.append("listingType", filterType);
        }
        if (filterLocation.trim() !== "") {
          params.append("location", filterLocation.trim());
        }

        const response = await fetch(`${backendUrl}/api/properties?${params.toString()}`);

        if (!response.ok) throw new Error("Failed to fetch properties");

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filterType, filterLocation, backendUrl]);

  useEffect(() => {
    localStorage.setItem("sortOrder", sortOrder);
  }, [sortOrder]);

  const sortedProperties = [...properties].sort((a, b) => {
    return sortOrder === "lowToHigh" ? a.price - b.price : b.price - a.price;
  });

  if (loading) return <p className="loading">Loading properties...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="property-list-container">
      <h2>Available Properties</h2>

      <div className="filter-sort-bar">
        <div className="filter-group">
          <label>Listing Type: </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Location: </label>
          <input
            type="text"
            placeholder="Enter city or area"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sort by Price: </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
      </div>

      {sortedProperties.length > 0 ? (
        <div className="property-list">
          {sortedProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <p className="no-properties">No matching properties found.</p>
      )}
    </div>
  );
};

export default PropertyList;
