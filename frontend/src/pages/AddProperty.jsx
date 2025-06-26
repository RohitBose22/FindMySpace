import React, { useState } from "react";
import { addProperty } from "../api/api";
import "../styles/AddProperty.css";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    listingType: "sell",
  });

  const [images, setImages] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));


    setImages((prev) => [...prev, ...newFiles]);
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 3) {
      alert("Please upload at least 3 images.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      images.forEach((imageFile) => {
        data.append("images", imageFile);
      });

      await addProperty(data, token);

      alert("Property added successfully!");
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        listingType: "sell",
      });
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      alert("Error adding property");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <select
        name="listingType"
        value={formData.listingType}
        onChange={handleChange}
        required
      >
        <option value="sell">Sell</option>
        <option value="rent">Rent</option>
      </select>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        required={images.length === 0}
      />
      <small style={{ color: "gray" }}>
        * Please upload at least 3 images. You can select files in multiple batches.
      </small>

      <div className="preview-images">
        {previewImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Preview ${idx + 1}`}
            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
          />
        ))}
      </div>

      <button type="submit">Add Property</button>
    </form>
  );
};

export default AddProperty;
