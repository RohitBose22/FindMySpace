import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/UserProfile.css";

const backendUrl = "http://localhost:5000";

const UserProfile = () => {
  const { user, token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "", phone: "", profileImage: "" });
  const [profilePreview, setProfilePreview] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch(`${backendUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(({ user, properties }) => {
        setUserData(user);
        setProperties(properties);

        
        if (user.profileImage) {
          setProfilePreview(user.profileImage);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profileImage: file });
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("phone", userData.phone);

    
    if (userData.profileImage instanceof File) {
      formData.append("profileImage", userData.profileImage);
    }

    fetch(`${backendUrl}/api/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setEditMode(false);
        if (data.profileImage) {
          setProfilePreview(data.profileImage);
        }
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete property");
      }

      setProperties(properties.filter((p) => p._id !== propertyId));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <img
          src={profilePreview || "/user-avatar.png"}
          alt="User Avatar"
          className="user-avatar"
        />
        <div className="profile-info">
          <label>Username:</label>
          {editMode ? (
            <input type="text" name="username" value={userData.username} onChange={handleChange} />
          ) : (
            <p>{userData.username}</p>
          )}

          <label>Email:</label>
          <p>{userData.email}</p>

          <label>Phone:</label>
          {editMode ? (
            <input type="text" name="phone" value={userData.phone} onChange={handleChange} />
          ) : (
            <p>{userData.phone}</p>
          )}

          {editMode && (
            <>
              <label>Profile Picture:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </>
          )}

          {editMode ? (
            <button className="save-btn" onClick={handleSave}>Save</button>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>
      </div>

      <h3>My Properties</h3>
      <div className="property-list">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="property-card">
              <img src={property.images[0]} alt={property.title} />
              <h4>{property.title}</h4>
              <p>{property.description}</p>
              <p>Price: Rs{property.price}</p>
              <Link to={`/property/${property._id}`} className="view-property-btn">View Property</Link>
              <button className="delete-btn" onClick={() => handleDelete(property._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No properties added yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;




