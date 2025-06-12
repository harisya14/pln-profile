import React from "react";
import Navbar from "./header";
import Footer from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className = "bg-white" }) => {
  return (
    <>
      <Navbar />
      <main className={`min-h-screen relative mx-auto ${className}`}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
