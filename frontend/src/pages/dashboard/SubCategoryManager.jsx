import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function SubCategoryManager() {
  
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]); 

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await api.get("/subcategories");
      if (Array.isArray(response.data)) {
        setSubCategories(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setSubCategories(response.data.data);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.log("Error fetching subcategories", error);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please select a Category!");
      return;
    }

    setLoading(true);
    try {
      const payload = { name, categoryId };

      if (editId) {
        await api.put(`/subcategories/${editId}`, payload);
      } else {
        await api.post("/subcategories", payload);
      }

      resetForm();
      fetchSubCategories(); 
    } catch (error) {
      console.log("Error saving subcategory", error);
      alert("Failed to save. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subCat) => {
    setEditId(subCat.id);
    setName(subCat.name);
    setCategoryId(subCat.categoryId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this SubCategory?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/subcategories/${id}`);
      fetchSubCategories();
    } catch (error) {
      console.log("Error deleting subcategory", error);
    }
  };

  const getCategoryName = (catId) => {
    const category = categories.find((c) => c.id === catId);
    return category ? category.name : "Unknown / Deleted";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage SubCategories</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8"
      >
        <h2 className="text-xl mb-4 font-semibold">
          {editId ? "Update SubCategory" : "Add New SubCategory"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-600">
              SubCategory Name
            </label>
            <input
              type="text"
              placeholder="e.g. T-Shirts"
              className="border p-2 rounded focus:outline-none focus:border-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-600">
              Parent Category
            </label>
            <select
              className="border p-2 rounded focus:outline-none focus:border-green-500 bg-white"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 disabled:opacity-50 transition-colors font-medium"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editId
                ? "Update SubCategory"
                : "Add SubCategory"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <h2 className="text-xl mb-4 font-semibold">SubCategory List</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">ID</th>
              <th className="p-3">SubCategory Name</th>
              <th className="p-3">Parent Category</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((subCat) => (
              <tr
                key={subCat.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{subCat.id}</td>
                <td className="p-3 font-semibold">{subCat.name}</td>
               
                <td className="p-3 text-gray-600">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                    {subCat.category?.name ||
                      getCategoryName(subCat.categoryId)}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleEdit(subCat)}
                    className="text-blue-500 hover:text-blue-700 mr-4 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subCat.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {subCategories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-5 text-center text-gray-500">
                  No subcategories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
