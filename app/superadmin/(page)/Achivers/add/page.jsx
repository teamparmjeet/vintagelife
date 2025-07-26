"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
export default function Page() {
    const [formData, setFormData] = useState({
        name: "",
        dsid: "",
        address: "",
        achivementtype1: "",
        ranktype: "",
        triptype: "",
        image: null,
    });

    const [file, setFile] = useState(null);
    const [user, setUser] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [level, setLevel] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/user/fethall/user");
                setUser(response.data.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/level/fetch/level");
                setLevel(response.data.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrors("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.dsid.trim()) newErrors.dsid = "DSID is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.achivementtype1.trim()) newErrors.achivementtype1 = "Achievement Type 1 is required";
        if (!file) newErrors.image = "Image is required";
        if (formData.achivementtype1 === "Rank Achiever" && !formData.ranktype.trim()) {
            newErrors.ranktype = "Rank Type is required";
        }
        if (formData.achivementtype1 === "Trip Achiever" && !formData.triptype.trim()) {
            newErrors.triptype = "Trip Type is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = async () => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/upload", formData);
            return response.data.file.secure_url;
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Image upload failed!");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const imageUrl = await handleImageUpload();
            if (!imageUrl) throw new Error("Failed to upload image");

            await axios.post("/api/achivers/create", {
                ...formData,
                image: imageUrl,
            });

            alert("Achiever registered successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Failed to register achiever!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center   p-4">
            <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Register Achiever</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-4 md:p-6 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg w-full"
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Name */}
                    <div className="col-span-12 ">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-200">Name</label>
                        <select
                            name="name"
                            value={formData.name}
                            onChange={(e) => {
                                const selectedUser = user.find((u) => u.name === e.target.value);
                                setFormData({
                                    ...formData,
                                    name: selectedUser?.name || "",
                                    dsid: selectedUser?.dscode || "",
                                });
                            }}
                            className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
                            disabled={loading}
                        >
                            <option value="">Select Name</option>
                            {user.map((u) => (
                                <option key={u._id} value={u.name}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    {/* DSID */}
                    <div className="col-span-12 ">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-200">DSID</label>
                        <select
                            name="dsid"
                            value={formData.dsid}
                            onChange={(e) => {
                                const selectedUser = user.find((u) => u.dscode === e.target.value);
                                setFormData({
                                    ...formData,
                                    dsid: selectedUser?.dscode || "",
                                    name: selectedUser?.name || "",
                                });
                            }}
                            className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
                            disabled={loading}
                        >
                            <option value="">Select DSID</option>
                            {user.map((u) => (
                                <option key={u._id} value={u.dscode}>
                                    {u.dscode} - {u.name}
                                </option>
                            ))}
                        </select>
                        {errors.dsid && <p className="text-red-500 text-xs">{errors.dsid}</p>}
                    </div>

                    {/* Address */}
                    <div className="col-span-12">
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border p-2 rounded text-sm"
                            disabled={loading}
                        />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                    </div>

                    {/* Achievements */}
                    <div className="col-span-12 ">
                        <select
                            name="achivementtype1"
                            value={formData.achivementtype1}
                            onChange={handleChange}
                            className="w-full border p-2 rounded text-sm bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200"
                            disabled={loading}
                        >
                            <option value="">Select Achievement Type 1</option>
                            <option value="Rank Achiever">Rank Achiever</option>
                            <option value="Trip Achiever">Trip Achiever</option>
                            <option value="Car Achiever">Car Achiever</option>
                        </select>
                        {errors.achivementtype1 && <p className="text-red-500 text-xs">{errors.achivementtype1}</p>}
                    </div>

                    {formData.achivementtype1 === "Rank Achiever" && (
                        <div className="col-span-12 ">
                            <select
                                name="ranktype"
                                value={formData.ranktype}
                                onChange={handleChange}
                                className="w-full border p-2 rounded text-sm"
                                disabled={loading}
                            >
                                <option value="">Select Rank Type</option>
                                {level.map((data) => (

                                    <option key={data._id} value={data.level_name}>{data.level_name}</option>

                                ))}
                            </select>
                            {errors.ranktype && <p className="text-red-500 text-xs">{errors.ranktype}</p>}
                        </div>
                    )}

                    {formData.achivementtype1 === "Trip Achiever" && (
                        <div className="col-span-12 ">
                            <select
                                name="triptype"
                                value={formData.triptype}
                                onChange={handleChange}
                                className="w-full border p-2 rounded text-sm"
                                disabled={loading}
                            >
                                <option value="">Select Trip Type</option>
                                {level
                                    .filter((data) => data.bonus && data.bonus.trim() !== "") 
                                    .map((data) => (
                                        <option key={data._id} value={data.bonus}>
                                            {data.bonus}
                                        </option>
                                    ))}

                            </select>
                            {errors.triptype && <p className="text-red-500 text-xs">{errors.triptype}</p>}
                        </div>
                    )}
                    {/* Image Upload */}
                    <div className="col-span-12">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-200">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border p-2 rounded text-sm"
                            disabled={loading}
                        />
                        {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                        {imagePreview && <Image src={imagePreview} alt="Preview" height={100} width={100} className=" rounded-lg shadow-md mt-2" />}
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-12 text-center">
                        <button
                            type="submit"
                            className="w-full bgn text-white py-2 rounded-lg hbgb disabled:bg-gray-400"
                            disabled={loading || uploading}
                        >
                            {loading || uploading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
