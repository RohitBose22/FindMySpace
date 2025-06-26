import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/UserProfile.css";

const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const UserProfile = () => {
  const { token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "", phone: "", profileImage: "" });
  const [profilePreview, setProfilePreview] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const { user, properties } = await res.json();

        setUserData(user || {});
        setProperties(properties || []);

        if (user?.profileImage) {
          const profileImgUrl = user.profileImage.startsWith("http")
            ? user.profileImage
            : `${backendUrl}/uploads/${user.profileImage}`;
          setProfilePreview(profileImgUrl);
        } else {
          setProfilePreview(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prev) => ({ ...prev, profileImage: file }));
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("phone", userData.phone);

      if (userData.profileImage instanceof File) {
        formData.append("profileImage", userData.profileImage);
      }

      const res = await fetch(`${backendUrl}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setUserData(updatedUser);

      if (updatedUser.profileImage) {
        const profileImgUrl = updatedUser.profileImage.startsWith("http")
          ? updatedUser.profileImage
          : `${backendUrl}/uploads/${updatedUser.profileImage}`;
        setProfilePreview(profileImgUrl);
      }

      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete property");

      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property. Please try again.");
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
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
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
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
          )}
        </div>
      </div>

      <h3>My Properties</h3>
      <div className="property-list">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="property-card">
              <img src={property.images?.[0]} alt={property.title} />
              <h4>{property.title}</h4>
              <p>{property.description}</p>
              <p>Price: Rs{property.price}</p>
              <Link to={`/property/${property._id}`} className="view-property-btn">
                View Property
              </Link>
              <button className="delete-btn" onClick={() => handleDelete(property._id)}>
                Delete
              </button>
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



