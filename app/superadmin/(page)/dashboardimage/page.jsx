"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { X, UploadCloud, Trash2, AlertTriangle } from "lucide-react";

export default function TripBonanzaUpload() {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null); // Store ID of image being deleted
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get("/api/dashboardimage/fetch/s");
      if (response.data.success) {
        setImages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      // Add user-facing error notification here
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    handleDragEvents(e);
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    handleDragEvents(e);
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    handleDragEvents(e);
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setImagePreview(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData);
      return response.data.file.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      // Add user-facing error notification
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!file) {
      alert("Please select an image.");
      return;
    }

    setIsSaving(true);
    try {
      const imageUrl = await handleUpload();
      if (imageUrl) {
        await axios.post("/api/dashboardimage/create", { image: imageUrl });
        clearSelection();
        await fetchImages();
      }
    } catch (error) {
      console.error("Failed to save image details:", error);
      // Add user-facing error notification
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmation = (imageUrl) => {
    setImageToDelete(imageUrl);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    setIsDeleting(imageToDelete);
    setShowDeleteModal(false);

    try {
      await axios.delete("/api/dashboardimage/delete", { data: { image: imageToDelete } });
      setImages(images.filter((img) => img.image !== imageToDelete));
    } catch (error) {
      console.error("Error deleting image:", error);
      // Add user-facing error notification
    } finally {
      setIsDeleting(null);
      setImageToDelete(null);
    }
  };

  // Spinner component for loading states
  const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  );

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Uploader Section */}
          <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg transition-all">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Bonanza Uploader</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Drag & drop an image or click to select a file.</p>

            {imagePreview ? (
              <div className="relative group">
                <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg shadow-md object-cover max-h-80" />
                <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <button onClick={clearSelection} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragEnter}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={`flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center p-4">
                  <UploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  <input id="file-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} className="hidden" />
                </label>
              </div>
            )}

            <button
              onClick={handleSave}
              className="mt-6 w-full bgn text-white p-3 rounded-lg font-semibold hbgb disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={!file || isUploading || isSaving}
            >
              {isUploading || isSaving ? <Spinner /> : "Upload & Save Image"}
            </button>
          </div>

          {/* Gallery Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Uploaded Bonanzas</h2>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                  <div key={img._id || img.image} className="relative group aspect-w-1 aspect-h-1">
                    <img src={img.image} alt="Uploaded content" className="w-full h-full object-cover rounded-lg shadow-md transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0  bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <button
                        onClick={() => handleDeleteConfirmation(img.image)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition disabled:bg-gray-500"
                        disabled={!!isDeleting}
                      >
                        {isDeleting === img.image ? <Spinner /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-gray-500 dark:text-gray-400">No images have been uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm m-4">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-800 dark:text-white">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}