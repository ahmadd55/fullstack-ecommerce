import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function CategoryManager() {
  const [activeTab, setActiveTab] = useState("categories"); 

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [showInNavbar, setShowInNavbar] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const catRes = await api.get("/categories");
      const subRes = await api.get("/subcategories");

      setCategories(catRes.data?.data || catRes.data || []);
      setSubCategories(subRes.data?.data || subRes.data || []);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategoryId("");
    setShowInNavbar(false); 
    setEditId(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "categories") {
        if (editId) {
          await api.put(`/categories/${editId}`, {
            name,
            description,
            show_in_navbar: showInNavbar,
          });
        } else {
          await api.post("/categories", {
            name,
            description,
            show_in_navbar: showInNavbar,
          });
        }
      } else {
        if (editId) {
          await api.put(`/subcategories/${editId}`, { name, categoryId });
        } else {
          await api.post("/subcategories", { name, categoryId });
        }
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.log("Error saving", error);
      alert("Something went wrong!");
    }
  };

  
  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);

    if (activeTab === "categories") {
      setDescription(item.description || "");
      setShowInNavbar(item.show_in_navbar || false);
    } else {
      setCategoryId(item.categoryId || "");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${activeTab === "categories" ? "Category" : "SubCategory"}?`,
    );
    if (!confirmDelete) return;

    try {
      if (activeTab === "categories") {
        await api.delete(`/categories/${id}`);
      } else {
        await api.delete(`/subcategories/${id}`);
      }
      fetchData();
    } catch (error) {
      console.log("Error deleting", error);
      alert("Failed to delete.");
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "Unknown / Deleted";
  };

  return (
    <div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">
            Manage Classifications
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Add and manage categories and subcategories.
          </p>
        </div>

      
        <div className="flex gap-2 bg-surface-container-low p-1 rounded border border-outline-variant">
          <button
            onClick={() => handleTabChange("categories")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === "categories"
                ? "bg-surface-container-lowest shadow text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => handleTabChange("subcategories")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === "subcategories"
                ? "bg-surface-container-lowest shadow text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            SubCategories
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 mb-8 shadow-sm transition-all">
        <h3 className="font-semibold text-lg mb-4 text-on-surface">
          {editId ? "Update" : "Add New"}{" "}
          {activeTab === "categories" ? "Category" : "SubCategory"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {activeTab === "categories" ? (
            <>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 min-w-[150px] mb-2 px-2">
                <input
                  type="checkbox"
                  id="showInNavbar"
                  checked={showInNavbar}
                  onChange={(e) => setShowInNavbar(e.target.checked)}
                  className="w-5 h-5 text-primary border-outline-variant rounded cursor-pointer"
                />
                <label
                  htmlFor="showInNavbar"
                  className="text-sm font-medium text-on-surface-variant cursor-pointer select-none"
                >
                  Show in Navbar
                </label>
              </div>
            </>
          ) : (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Parent Category
              </label>
              <select
                className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:border-primary text-on-surface"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
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
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary-container text-on-primary px-6 py-2 rounded text-sm font-medium hover:bg-primary transition-colors h-[38px] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {editId ? "save" : "add"}
              </span>
              {editId ? "Update" : "Add"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded text-sm font-medium hover:bg-surface-variant transition-colors h-[38px]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant">
                <th className="p-4 w-16">ID</th>
                <th className="p-4">
                  {activeTab === "categories"
                    ? "Category Name"
                    : "SubCategory Name"}
                </th>
                <th className="p-4">
                  {activeTab === "categories"
                    ? "Description"
                    : "Parent Category"}
                </th>

                {activeTab === "categories" && (
                  <th className="p-4 text-center">In Navbar?</th>
                )}

                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-outline-variant">
              {(activeTab === "categories" ? categories : subCategories).map(
                (item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="p-4 font-mono text-on-surface-variant">
                      {item.id}
                    </td>
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 text-on-surface-variant">
                      {activeTab === "categories"
                        ? item.description || "—"
                        : getCategoryName(item.categoryId)}
                    </td>

                    {activeTab === "categories" && (
                      <td className="p-4 text-center">
                        {item.show_in_navbar ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            Yes
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
                            No
                          </span>
                        )}
                      </td>
                    )}

                    <td className="p-4 text-right flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-primary hover:text-primary-container transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ),
              )}
              {(activeTab === "categories" ? categories : subCategories)
                .length === 0 && (
                <tr>
                  <td
                    colSpan={activeTab === "categories" ? "5" : "4"}
                    className="p-6 text-center text-on-surface-variant"
                  >
                    No {activeTab} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
