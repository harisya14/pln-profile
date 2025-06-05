import React from "react";
import Navbar from "./header";
import Footer from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen relative mx-auto bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
