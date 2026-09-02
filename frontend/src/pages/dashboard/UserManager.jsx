import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
  });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [actionLoading, setActionLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/customers");
      const fetchedData = response.data?.data || response.data;

      if (Array.isArray(fetchedData)) {
        setUsers(fetchedData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (firstName = "", lastName = "") => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const openDeleteModal = (userId) => {
    setDeleteModal({ isOpen: true, userId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null });
  };

  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      await api.delete(`/users/${deleteModal.userId}`);
      setUsers(users.filter((user) => user.id !== deleteModal.userId));
      closeDeleteModal();
    } catch (error) {
      console.log("Error deleting user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (user) => {
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setEditModal({ isOpen: true, user });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, user: null });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const response = await api.put(`/users/${editModal.user.id}`, editForm);
      const updatedData = response.data?.data || response.data;

      setUsers(
        users.map((user) =>
          user.id === editModal.user.id
            ? {
                ...user,
                ...updatedData,
                totalOrders: user.totalOrders,
                lifetimeValue: user.lifetimeValue,
              }
            : user,
        ),
      );

      closeEditModal();
    } catch (error) {
      console.log("Error updating user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 h-full w-full relative">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Users Management
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage customers, view activity, and handle user statuses.
            </p>
          </div>
          <button className="bg-[#10b981] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-[#006c49] transition-all shadow-sm">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              add
            </span>
            Add New User
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 mb-6 flex gap-4 items-center flex-wrap shadow-sm">
          <div className="flex-1 min-w-[250px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 h-[40px] border border-gray-300 rounded bg-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none transition-all text-sm"
              placeholder="Search by name or email..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">
                    Join Date
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">
                    Total Orders
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-right">
                    Lifetime Value
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-center">
                    Status
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-600 font-bold">
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {formatDate(user.created_at || user.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-mono text-center">
                        {user.totalOrders || 0}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-mono text-right">
                        Rs.{" "}
                        {parseFloat(user.lifetimeValue || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#d1fae5] text-[#065f46]">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1 text-gray-500 hover:text-[#10b981] transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(user.id)}
                            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} customers
            </div>
          </div>
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                Delete Customer
              </h3>
              <button
                onClick={closeDeleteModal}
                disabled={actionLoading}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
                <span className="material-symbols-outlined text-red-600">
                  warning
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-2">
                Are you sure you want to delete this customer?
              </p>
              <p className="text-xs text-gray-500">
                This action cannot be undone and will permanently remove their
                data.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="bg-red-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {actionLoading ? "hourglass_empty" : "delete"}
                </span>
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Edit Customer</h3>
              <button
                onClick={closeEditModal}
                disabled={actionLoading}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form
                id="editUserForm"
                onSubmit={handleEditSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.lastName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-gray-900"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="editUserForm"
                disabled={actionLoading}
                className="bg-[#10b981] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#006c49] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {actionLoading ? "hourglass_empty" : "save"}
                </span>
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
