"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function AddOrUpdateProductPage() {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        image: "",
        productname: "",
        group: "",
        dp: "",
        sp: "",
        mrp: "",
        hsn: "",
        taxvalue: "",
        cgst: "",
        sgst: "",
        igst: ""
    });

    const [productGroups, setProductGroups] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fetchError, setFetchError] = useState("");

    // Fetch Product Groups & Product Details (if updating)
    useEffect(() => {
        const fetchProductGroups = async () => {
            setFetching(true);
            setFetchError("");
            try {
                const response = await axios.get("/api/Product/Group/fetch/s");
                setProductGroups(response.data.data || []);
            } catch (error) {
                setFetchError(error.response?.data?.message || "Failed to fetch product groups.");
            } finally {
                setFetching(false);
            }
        };

        fetchProductGroups();

        if (id) {
            const fetchProductDetails = async () => {
                try {
                    const response = await axios.get(`/api/Product/Product/${id}`);
                    const fetchedData = response.data.data || {};
                    setFormData({
                        image: fetchedData.image || "",
                        productname: fetchedData.productname || "",
                        group: fetchedData.group || "",
                        dp: fetchedData.dp || "",
                        sp: fetchedData.sp || "",
                        mrp: fetchedData.mrp || "",
                        hsn: fetchedData.hsn || "",
                        taxvalue: fetchedData.taxvalue || "",
                        cgst: fetchedData.cgst || "",
                        sgst: fetchedData.sgst || "",
                        igst: fetchedData.igst || "",


                    });
                } catch (error) {
                    setError("Failed to fetch product details.");
                }
            };
            fetchProductDetails();
        }
    }, [id]);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Image Upload
    const handleImageUpload = async (file) => {
        setUploading(true);
        const imageData = new FormData();
        imageData.append("file", file);
        try {
            const response = await axios.post("/api/upload", imageData);
            setFormData({ ...formData, image: response.data.file.secure_url });
        } catch (error) {
            setError("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    // Handle Submit (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productname || !formData.group || !formData.dp || !formData.sp || !formData.mrp || !formData.hsn || !formData.taxvalue || !formData.igst || loading) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let response;
            if (id) {
                response = await axios.patch(`/api/Product/Product/update/${id}`, formData);
                setSuccess(response.data.message || "Product updated successfully.");
            } else {
                response = await axios.post("/api/Product/Product/create", formData);
                setSuccess(response.data.message || "Product added successfully.");
                setFormData({
                    image: "", productname: "", sp: "", mrp: "", group: "", dp: "", hsn: "",
                    taxvalue: "",
                    cgst: "",
                    sgst: "",
                    igst: ""
                });
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to process request.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete Product
    const handleDelete = async () => {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);
        try {
            await axios.delete(`/api/Product/Product/delete/${id}`);
            setSuccess("Product deleted successfully.");
            setTimeout(() => router.push("/superadmin/Product/allproduct"), 1500); // Redirect after deletion
        } catch (error) {
            setError("Failed to delete product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                {id ? "Update Product" : "Add Product"}
            </h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            {fetchError && <p className="text-red-500">{fetchError}</p>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input type="text" name="productname" placeholder="Product Name" value={formData.productname} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Group</label>
                    <select name="group" value={formData.group} onChange={handleChange} className="w-full p-2 border rounded" required disabled={fetching || productGroups.length === 0}>
                        <option value="">Select Group</option>
                        {productGroups.map((group) => (
                            <option key={group._id} value={group.groupname}>{group.groupname}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Selling Price</label>
                    <input type="number" name="sp" placeholder="Selling Price" value={formData.sp} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Discount Price</label>
                    <input type="number" name="dp" placeholder="Discount Price" value={formData.dp} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Market Price</label>
                    <input type="number" name="mrp" placeholder="Market Price" value={formData.mrp} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">HSN Code</label>
                    <input type="number" name="hsn" placeholder="HSN Code" min={0} value={formData.hsn} onChange={handleChange} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Tax Value</label>
                    <input type="number" name="taxvalue" placeholder="Tax Value" min={0} value={formData.taxvalue} onChange={handleChange} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">CGST</label>
                    <input type="number" name="cgst" placeholder="CGST" min={0} value={formData.cgst} onChange={handleChange} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200" />
                </div>

                <div>
                    <label className="block mb-1 font-medium">SGST</label>
                    <input type="number" name="sgst" placeholder="SGST" min={0} value={formData.sgst} onChange={handleChange} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200" />
                </div>

                <div>
                    <label className="block mb-1 font-medium">IGST</label>
                    <input type="text" name="igst" placeholder="IGST" value={formData.igst} onChange={handleChange} className="w-full p-3 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200" required />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Product Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="w-full p-2 border rounded" />
                    {uploading && <p className="text-blue-500 mt-1">Uploading image...</p>}
                    {formData.image && <img src={formData.image} alt="Uploaded Preview" className="w-32 h-32 object-cover rounded mt-2" />}
                </div>
            </form>


            <div className="flex gap-4">
                <button type="submit" onClick={handleSubmit} disabled={loading} className={`w-40 p-2 text-white rounded transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
                    {loading ? "Submitting..." : id ? "Update" : "Submit"}
                </button>

                {id && (
                    <button type="button" onClick={handleDelete} disabled={loading} className="w-40 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
