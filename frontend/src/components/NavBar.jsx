import { useState, useEffect } from "react";
import logo from "../assets/hm-logo.svg";
import { Link } from "react-router-dom";
import api from "../api/axios"; 

export default function NavBar() {
  const [navCategories, setNavCategories] = useState([]);

  useEffect(() => {
    const fetchNavCategories = async () => {
      try {
        const response = await api.get("/categories?navbarOnly=true");
        setNavCategories(response.data?.data || []);
      } catch (error) {
        console.log("Error fetching navbar categories:", error);
      }
    };

    fetchNavCategories();
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <img className="logo-img" src={logo} alt="Logo" />
        </Link>

        <div className="menus">
          <ul>
            {navCategories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/category/${category.id}`}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="icons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="currentColor"
            className="cursor-pointer"
          >
            <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 5 13 13 5 z"></path>
          </svg>

          <Link to={localStorage.getItem("token") ? "/profile" : "/login"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0" /> <circle cx="12" cy="8" r="4" />
            </svg>
          </Link>

          <Link to="/cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 7h12l-1 13H7L6 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
          </Link>
        </div>
      </nav>
    </>
  );
}