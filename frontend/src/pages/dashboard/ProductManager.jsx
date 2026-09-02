import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const [prodRes, catRes, subCatRes] = await Promise.all([
        api.get(`/products?page=${page}&limit=30`),
        api.get("/categories"),
        api.get("/subcategories"),
      ]);

      const prodData = prodRes.data?.data || prodRes.data;

      setProducts(prodData.products || prodData || []);
      setCurrentPage(prodData.currentPage || 1);
      setTotalPages(prodData.totalPages || 1);

      setCategories(catRes.data?.data || catRes.data || []);
      setSubCategories(subCatRes.data?.data || subCatRes.data || []);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchData(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditId(product.id);
      setFormData({
        title: product.title || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        subCategoryId: product.subCategoryId || "",
      });
    } else {
      setEditId(null);
      setFormData({
        title: "",
        price: "",
        stock: "",
        description: "",
        categoryId: "",
        subCategoryId: "",
      });
    }
    setImages([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImages([]);
    setImagePreviews([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        categoryId: parseInt(formData.categoryId, 10),
        subCategoryId: formData.subCategoryId
          ? parseInt(formData.subCategoryId, 10)
          : null,
      };

      let currentProductId = editId;

      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        const response = await api.post("/products", payload);
        currentProductId = response.data?.data?.id || response.data?.id;
      }

      if (images.length > 0 && currentProductId) {
        const imageUploadPromises = images.map((img) => {
          const imgFormData = new FormData();
          imgFormData.append("image", img);
          imgFormData.append("productId", currentProductId);

          return api.post("/product-images", imgFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        });

        await Promise.all(imageUploadPromises);
      }

      closeModal();
      fetchData(currentPage); 
    } catch (error) {
      console.log("Error saving product:", error);
      alert(error.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await api.delete(`/products/${id}`);
      fetchData(currentPage); 
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  const openCsvModal = () => setIsCsvModalOpen(true);
  const closeCsvModal = () => {
    setIsCsvModalOpen(false);
    setCsvFile(null);
  };

  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      alert("Please select a CSV file first.");
      return;
    }

    setCsvUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      await api.post("/products/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      closeCsvModal();
      fetchData(1);
      alert("Products uploaded successfully!");
    } catch (error) {
      console.log("Error uploading CSV:", error);
      alert(error.response?.data?.message || "Failed to upload CSV.");
    } finally {
      setCsvUploading(false);
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "N/A";
  };

  const filteredSubCategories = subCategories.filter(
    (sc) => sc.categoryId === Number(formData.categoryId),
  );

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Products</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Manage your apparel inventory and pricing.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openCsvModal}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded text-sm font-medium hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              upload_file
            </span>
            Upload CSV
          </button>

          <button
            onClick={() => openModal()}
            className="bg-primary-container text-on-primary px-4 py-2 rounded text-sm font-medium hover:bg-primary transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New Product
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant">
                <th className="p-4 w-2/5">Product Name</th>
                <th className="p-4 w-1/6">Category</th>
                <th className="p-4 w-1/6">Price</th>
                <th className="p-4 w-1/6">Stock Level</th>
                <th className="p-4 w-1/12 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    Loading products...
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stock = product.stock || 0;
                  const stockPercentage = Math.min((stock / 100) * 100, 100);
                  const isActive = stock > 0;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-surface-variant flex-shrink-0 overflow-hidden border border-outline-variant group-hover:shadow-md transition-shadow">
                            <img
                              className="w-full h-full object-cover"
                              src={
                                product.images?.[0]?.image
                                  ? product.images[0].image.startsWith("http")
                                    ? product.images[0].image
                                    : `http://localhost:3000${product.images[0].image}`
                                  : "https://via.placeholder.com/150?text=No+Image"
                              }
                              alt={product.title}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-on-surface">
                              {product.title}
                            </p>
                            <p className="font-mono text-on-surface-variant text-xs mt-0.5">
                              SKU: PRD-{product.id.toString().padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {product.category?.name ||
                          getCategoryName(product.categoryId)}
                      </td>
                      <td className="p-4 font-mono">Rs. {product.price}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isActive ? "bg-primary-container" : "bg-outline-variant"}`}
                              style={{ width: `${stockPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-mono text-on-surface-variant">
                            {stock}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="text-primary hover:text-primary-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
              {products.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-on-surface-variant"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                  currentPage === pageNumber
                    ? "bg-primary text-on-primary border border-primary shadow-sm"
                    : "bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-xl font-bold text-on-surface">
                {editId ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={closeModal}
                disabled={saving}
                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form
                id="productForm"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                    placeholder="e.g. Essential Cotton Crew"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Stock Level
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    SubCategory
                  </label>
                  <select
                    name="subCategoryId"
                    value={formData.subCategoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="">None</option>
                    {filteredSubCategories.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                    placeholder="Enter product details..."
                  ></textarea>
                </div>

                <div className="md:col-span-2 p-4 border border-dashed border-outline-variant rounded bg-surface-container-low text-center">
                  <label className="block text-sm font-semibold text-primary cursor-pointer hover:underline mb-2">
                    Click to select product images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-on-surface-variant">
                    You can select multiple images at once.
                  </p>

                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4 justify-center">
                      {imagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 rounded overflow-hidden border border-outline-variant shadow-sm"
                        >
                          <img
                            src={src}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 rounded text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="productForm"
                disabled={saving}
                className="bg-primary-container text-on-primary px-6 py-2 rounded text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {saving ? "hourglass_empty" : "save"}
                </span>
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCsvModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-xl font-bold text-on-surface">Upload CSV</h3>
              <button
                onClick={closeCsvModal}
                disabled={csvUploading}
                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              <form id="csvForm" onSubmit={handleCsvSubmit}>
                <div className="p-8 border-2 border-dashed border-outline-variant rounded bg-surface-container-low text-center transition-colors hover:bg-gray-50">
                  <label className="block cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
                      csv
                    </span>
                    <span className="block text-sm font-semibold text-primary hover:underline mb-1">
                      Click to select a CSV file
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-on-surface-variant mt-2 font-medium">
                    {csvFile ? (
                      <span className="text-primary">{csvFile.name}</span>
                    ) : (
                      "Only .csv files are supported."
                    )}
                  </p>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCsvModal}
                disabled={csvUploading}
                className="px-4 py-2 rounded text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="csvForm"
                disabled={csvUploading || !csvFile}
                className="bg-primary-container text-on-primary px-6 py-2 rounded text-sm font-medium hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {csvUploading ? "hourglass_empty" : "upload"}
                </span>
                {csvUploading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
