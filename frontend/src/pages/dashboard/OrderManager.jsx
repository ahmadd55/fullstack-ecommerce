import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const validStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/all");
        const fetchedData = response.data?.data || response.data;

        if (Array.isArray(fetchedData)) {
          setOrders(fetchedData);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.log("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      setActiveDropdown(null); 
    } catch (error) {
      console.log("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const extractName = (addressString) => {
    if (!addressString) return "Unknown Customer";
    return addressString.split(",")[0];
  };

  const getStatusBadge = (status, orderId) => {
    if (updatingId === orderId) {
      return <span className="text-xs text-gray-400">Updating...</span>;
    }

    const s = status?.toLowerCase() || "pending";
    if (s === "delivered") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-[11px] bg-primary-container/10 text-primary border border-primary/20 capitalize">
          {s}
        </span>
      );
    }
    if (s === "shipped") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-[11px] bg-secondary-container/30 text-secondary border border-secondary/20 capitalize">
          {s}
        </span>
      );
    }
    if (s === "confirmed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-[11px] bg-blue-50 text-blue-600 border border-blue-200 capitalize">
          {s}
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-[11px] bg-red-50 text-red-600 border border-red-200 capitalize">
          {s}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-[11px] bg-surface-variant text-on-surface-variant border border-outline-variant capitalize">
        {s}
      </span>
    );
  };

  
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status?.toLowerCase() === statusFilter)
    : orders;

  return (
    <div className="flex-1 overflow-y-auto p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-lg gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface text-3xl font-bold">
            Orders
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage and track customer orders.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded font-label-md text-label-md hover:bg-gray-100 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary-container text-white px-4 py-2 rounded font-label-md text-label-md hover:bg-primary transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Order
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-stack-md flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 border border-outline-variant rounded px-3 py-1.5 bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all flex-1 min-w-[200px]">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            filter_alt
          </span>
          <select
            className="bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface w-full p-0 cursor-pointer outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {validStatuses.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 border border-outline-variant rounded px-3 py-1.5 bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all flex-1 min-w-[200px]">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            calendar_today
          </span>
          <input
            className="bg-transparent border-none outline-none focus:ring-0 text-body-md font-body-md text-on-surface w-full p-0 text-sm"
            type="date"
          />
        </div>
        <div className="w-px h-8 bg-gray-300 hidden md:block mx-2"></div>
        <button
          onClick={() => setStatusFilter("")}
          className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors px-2"
        >
          Clear Filters
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm mt-3 pb-[100px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                  Order ID
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">
                  Customer Name
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">
                  Total Amount
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-center">
                  Status
                </th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono-data text-mono-data text-on-surface whitespace-nowrap">
                      #ORD-{order.id}
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-on-surface font-medium">
                      {extractName(order.shippingAddress)}
                    </td>
                    <td className="px-6 py-4 font-body-md text-body-md text-gray-500 whitespace-nowrap">
                      {formatDate(order.createdAt || order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-mono-data text-mono-data text-on-surface text-right">
                      Rs. {parseFloat(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(order.status, order.id)}
                    </td>

                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === order.id ? null : order.id,
                          )
                        }
                        className="text-gray-400 hover:text-primary transition-all p-1 rounded-full hover:bg-gray-100"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>

                      {activeDropdown === order.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-[40px] top-1/2 -translate-y-1/2 mt-1 w-40 bg-white border border-outline-variant rounded-lg shadow-lg z-50 py-2 animate-fade-in-up"
                        >
                          <div className="px-3 py-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                            Update Status
                          </div>
                          {validStatuses.map((statusOption) => (
                            <button
                              key={statusOption}
                              onClick={() =>
                                handleStatusChange(order.id, statusOption)
                              }
                              disabled={order.status === statusOption}
                              className={`w-full text-left px-4 py-2 text-sm capitalize transition-colors
                                ${
                                  order.status === statusOption
                                    ? "bg-surface-variant text-primary font-medium cursor-default"
                                    : "text-on-surface hover:bg-gray-50"
                                }`}
                            >
                              {statusOption}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
