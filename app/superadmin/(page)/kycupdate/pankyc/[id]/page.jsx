'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function BankKycPage() {
    const { id: rawId } = useParams();
    const id = decodeURIComponent(rawId);

    const router = useRouter();
    const [panno, setPanno] = useState('');
    const [name, setName] = useState('');
    const [userid, setUserid] = useState('');
    const [panimage, setPanimage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/api/user/find-admin-byemail/${id}`);
                const data = res.data;

                setPanno(data.panno || '');
                setName(data.name || '');
                setPanimage(data.panimage || '');
                setUserid(data._id);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        if (id) fetchUser();
    }, [id]);

    // Handle image upload
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

    // Handle form submit
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = panimage;

            if (selectedFile) {
                const uploadedUrl = await handleImageUpload(selectedFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            await axios.patch("/api/user/update-user", {
                id: userid,
                panno,
                name,
                panimage: imageUrl,
            });

            alert("PanCard updated successfully!");
            router.back();
        } catch (error) {
            console.error("Failed to update PanCard:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto space-y-6 bg-white rounded shadow">
            <h1 className="text-2xl font-semibold text-gray-800">Edit Pan Details</h1>

            <form className="space-y-4" onSubmit={handleSave}>
                <div className="flex flex-col">
                    <label className="text-gray-600 mb-1">Pan Card Number</label>
                    <input
                        type="text"
                        value={panno}
                        onChange={(e) => setPanno(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 mb-1">User Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1"
                    />
                </div>



                <div className="flex flex-col">
                    <label className="text-gray-600 mb-1">PanCard Image</label>
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="border border-gray-300 rounded px-3 py-1"
                    />
                    {panimage && (
                        <img
                            src={panimage}
                            alt="Passbook Preview"
                            className="mt-2 w-40 h-auto border rounded"
                        />
                    )}
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                        {loading ? 'Saving...' : 'Update'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
