import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); 

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "Products", path: "/dashboard/products", icon: "inventory_2" },
    { name: "Categories", path: "/dashboard/categories", icon: "category" },
    { name: "Orders", path: "/dashboard/orders", icon: "category" },
    { name: "users", path: "/dashboard/users", icon: "category" },
  ];

  
  const handleLogout = async () => {
    try {
      
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Error during backend logout:", error);
    } finally {
  
      localStorage.removeItem("token");

      navigate("/admin/login");
    }
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-[280px] bg-secondary text-white border-r border-outline-variant hidden md:flex flex-col py-8 z-20">
      
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-white">HM</h1>
        <p className="text-sm text-green-200 mt-1">Premium Apparel</p>
      </div>

      
      <ul className="flex flex-col flex-1 gap-1">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? "bg-white/10 border-l-4 border-primary-container font-bold"
                    : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="flex flex-col gap-1 mt-auto">
        <li>
          <button
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
