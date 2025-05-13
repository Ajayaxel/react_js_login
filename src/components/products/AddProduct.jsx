import React, { useState } from "react";
import api from "../../utils/api";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    sku: "",
    dateAdded: "",
    brand: "",
    weight: "",
    productName: "",
    category: "",
    deliveryTime: "",
    shortDescription: "",
    shortDescription2: "",
    images: [],
    sizeVariants: [""],
    colorVariants: [""],
    material: [""],
    stockQuantity: 0,
    price: 0,
    discount: 0,
    productDescription: "",
    careInstructions: "",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["sizeVariants", "colorVariants", "material"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ No token found. Please log in first.");
      return;
    }

    try {
      const form = new FormData();
      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          if (key === "images") {
            formData.images.forEach((file) => form.append("images", file));
          } else {
            form.append(key, JSON.stringify(formData[key]));
          }
        } else {
          form.append(key, formData[key]);
        }
      }

      const response = await api.post("/products/add", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setMessage("✅ Product added successfully!");
        setFormData({
          sku: "",
          dateAdded: "",
          brand: "",
          weight: "",
          productName: "",
          category: "",
          deliveryTime: "",
          shortDescription: "",
          shortDescription2: "",
          images: [],
          sizeVariants: [""],
          colorVariants: [""],
          material: [""],
          stockQuantity: 0,
          price: 0,
          discount: 0,
          productDescription: "",
          careInstructions: "",
        });
        setPreviewImages([]);
      } else {
        throw new Error(response.data.message || "API error");
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  const fields = [
    "sku",
    "dateAdded",
    "brand",
    "weight (g)",
    "productName",
    "category",
    "deliveryTime",
    "shortDescription",
    "shortDescription2",
    "sizeVariants",
    "colorVariants",
    "material",
    "stockQuantity",
    "price",
    "discount %",
    "productDescription",
    "careInstructions",
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 mt-10 bg-gray-600 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-300">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        🛍️ Add New Product
      </h2>

      <div className="h-[calc(100vh-180px)] px-2 overflow-y-auto ">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {fields.map((field) => (
            <div key={field} className="flex flex-col">
              <label className="mb-2 text-sm text-gray-300">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={
                  ["stockQuantity", "price", "discount"].includes(field)
                    ? "number"
                    : field === "dateAdded"
                    ? "date"
                    : "text"
                }
                name={field}
                value={
                  Array.isArray(formData[field])
                    ? formData[field][0]
                    : formData[field]
                }
                onChange={handleChange}
                className="w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-2"
                required
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm text-gray-300">
              Upload Images
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-2"
              required
            />
          </div>

          {previewImages.length > 0 && (
            <div className="sm:col-span-2">
              <label className="block mb-2 text-gray-100 font-semibold">
                Image Preview
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
                    className="w-full h-40 object-cover rounded-lg border border-gray-300"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition"
            >
              Add Product
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-6 text-center text-lg font-medium">
            <p
              className={
                message.startsWith("✅")
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductForm;




