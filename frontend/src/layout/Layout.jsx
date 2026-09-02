import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}