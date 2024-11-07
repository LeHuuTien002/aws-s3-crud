import React, { useEffect, useState } from "react";
import axios from "axios";

function ImageGallery() {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [updateId, setUpdateId] = useState(null); // ID của hình ảnh cần cập nhật

    // Lấy danh sách hình ảnh
    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/files");
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    // Thêm hình ảnh
    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await axios.post("http://localhost:8080/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchImages(); // Refresh list after upload
            setSelectedFile(null); // Reset selected file
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Xóa hình ảnh
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/files/${id}`);
            fetchImages(); // Refresh list after delete
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    // Bắt đầu cập nhật hình ảnh
    const startUpdate = (id) => {
        setUpdateId(id);
    };

    // Cập nhật hình ảnh
    const handleUpdate = async () => {
        if (!selectedFile || !updateId) return;
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await axios.put(`http://localhost:8080/api/files/${updateId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            fetchImages(); // Refresh list after update
            setSelectedFile(null); // Reset selected file
            setUpdateId(null); // Reset updateId
        } catch (error) {
            console.error("Error updating file:", error);
        }
    };

    return (
        <div>
            <h2>Gallery Hình Ảnh</h2>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button onClick={updateId ? handleUpdate : handleUpload}>
                {updateId ? "Update Image" : "Upload Image"}
            </button>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
                {images.map((image) => (
                    <div key={image.id} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                        <img src={image.url} alt={image.name} style={{ width: "150px", height: "150px" }} />
                        <p>{image.name}</p>
                        <button onClick={() => handleDelete(image.id)}>Delete</button>
                        <button onClick={() => startUpdate(image.id)}>Update</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageGallery;
