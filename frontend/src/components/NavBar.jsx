import { useState, useEffect, useRef } from "react";
import logo from "../assets/hm-logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NavBar() {
  const [navCategories, setNavCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openSearch = () => {
    const activeQuery = new URLSearchParams(location.search).get("q") || "";
    setSearchTerm(location.pathname === "/search" ? activeQuery : "");
    setSearchOpen(true);
  };

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const submitSearch = (event) => {
    event.preventDefault();

    const term = searchTerm.trim();
    if (!term) return;

    setMenuOpen(false);
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <nav className="navbar">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="lg:hidden p-1 -ml-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link to="/">
          <img className="logo-img" src={logo} alt="Logo" />
        </Link>

        <div className="menus hidden lg:block">
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
          <button
            type="button"
            onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
            aria-label="Search products"
            aria-expanded={searchOpen}
          >
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
          </button>

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

      {searchOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-[#E2E2E2] shadow-sm">
          <form
            onSubmit={submitSearch}
            className="max-w-[1440px] mx-auto flex items-center gap-3 px-4 md:px-8 py-3 sm:py-4"
          >
            <input
              ref={searchInputRef}
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Search for products"
              className="flex-1 min-w-0 h-11 px-4 text-sm sm:text-base bg-[#F5F5F5] rounded outline-none focus:ring-1 focus:ring-black"
            />

            <button
              type="submit"
              className="h-11 px-4 sm:px-6 rounded font-semibold text-sm sm:text-base bg-black text-white hover:bg-gray-800"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="p-1 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[60] lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-[80vw] bg-white z-[70] shadow-xl lg:hidden transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-5 border-b border-[#E2E2E2]">
          <img className="h-6 w-auto" src={logo} alt="Logo" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col py-2">
          {navCategories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/category/${category.id}`}
                className="block px-5 py-4 text-base border-b border-[#F2F2F2] hover:bg-[#F8F8F8] transition-colors"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-5 py-4">
          <Link
            to={localStorage.getItem("token") ? "/profile" : "/login"}
            className="text-sm text-[rgba(0,0,0,0.56)] hover:text-black transition-colors"
          >
            {localStorage.getItem("token") ? "My Profile" : "Sign in"}
          </Link>
        </div>
      </aside>
    </>
  );
}
