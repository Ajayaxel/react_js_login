
// src/pages/Homepage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Search } from "lucide-react";
import api from "../../utils/api";  // Importing the api instance from utils/api

const Homepage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and fetch products on page load
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchProducts();
  }, [navigate]);

  // Fetch all products from the API using the imported api instance
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,  // Add Authorization header if needed
        },
      });

      console.log("Fetched products:", res.data); // Debug the API response
      const productData = res.data.data || [];
      setProducts(productData);
      setFilteredProducts(productData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Handle search term input and filter products
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = products.filter((product) =>
      product.productName?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6"
 
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product List</h2>
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      {/* Display loading state */}
      {loading ? (
        <div className="text-center text-gray-600">Loading products...</div>
      ) : (
        <>
          <div className="overflow-y-auto max-h-screen custom-scroll">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {[
                    "Image", "Name", "SKU", "Category", "Brand", "Price", "Discount", "Stock",
                    "Weight", "Size Variants", "Color Variants", "Material",
                    "Delivery Time", "Product Description", "Date Added", "Short Desc", "Care Instructions"
                  ].map((title) => (
                    <th
                      key={title}
                      className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 font-semibold whitespace-nowrap"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      {product.images?.[0] ? (
                        <img
                          src={`https://backend.pinkstories.ae${product.images[0].replace('/src', '')}`}
                          alt={product.productName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{product.productName}</td>
                    <td className="px-4 py-3">{product.sku}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3">{product.discount || "-"}</td>
                    <td className="px-4 py-3">{product.stockQuantity}</td>
                    <td className="px-4 py-3">{product.weight}</td>
                    <td className="px-4 py-3">{product.sizeVariants?.join(", ")}</td>
                    <td className="px-4 py-3">{product.colorVariants?.join(", ")}</td>
                    <td className="px-4 py-3">{product.material}</td>
                    <td className="px-4 py-3">{product.deliveryTime}</td>
                    <td className="px-4 py-3">{product.productDescription}</td>
                    <td className="px-4 py-3">{product.dateAdded?.slice(0, 10)}</td>
                    <td className="px-4 py-3">{product.shortDescription}</td>
                    <td className="px-4 py-3">{product.careInstructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Homepage;



