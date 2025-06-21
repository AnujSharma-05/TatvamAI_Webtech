import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <div style={{ minHeight: "calc(100vh - 128px)" }}>{children}</div>
    <Footer />
  </>
);

export default MainLayout;