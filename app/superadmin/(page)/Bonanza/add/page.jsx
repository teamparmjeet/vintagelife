"use client"
import React, { useState } from 'react';
import axios from 'axios';

export default function TripBonanzaUpload() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/api/upload", formData);
      return response.data.file.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!file || !title || !description) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        await axios.post("/api/bonanza/create", {
          image: imageUrl,
          title,
          description,
        });
        alert("Image uploaded and details updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update image details:", error);
      alert("Image upload or update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-svh bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Add Bonanza </h1>
      <div className="bg-white dark:bg-gray-800 p-8 border border-gray-300 dark:border-gray-700 rounded shadow">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 w-full border border-gray-300 dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full border border-gray-300 dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 w-full border border-gray-300 dark:border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
        {image && (
          <div className="mt-4">
            <img src={image} alt="Trip Bonanza" className="w-full rounded shadow-md" />
          </div>
        )}
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition duration-200"
          disabled={!file || !title || !description || uploading || loading}
        >
          {loading || uploading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}