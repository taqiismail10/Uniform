import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 md:px-8 py-4 md:py-5 bg-white shadow-lg border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800">
      {/* Logo */}
      <a href="#" className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
        <img src="/logo.svg" alt="Logo" className="h-8 md:h-10 inline-block mr-2" />
        UniForm
      </a>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex flex-1 justify-center items-center space-x-6 lg:space-x-12">
        <a href="#" className="nav-link text-base lg:text-lg">Home</a>
        <a href="#" className="nav-link text-base lg:text-lg">Features</a>
      </div>

      {/* Sign Up / Login Buttons (Desktop) */}
      <div className="hidden md:flex items-center space-x-4 ml-6">
        <a href="/login" className="nav-link text-base lg:text-lg">Login</a>
        <Button className="btn-primary-custom">
          Sign Up
        </Button>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 h-12 w-12"
        >
          {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden z-50 dark:bg-gray-900">
          <div className="flex flex-col items-center py-4 space-y-4">
            <a href="#" className="nav-link text-lg">Home</a>
            <a href="#" className="nav-link text-lg">Features</a>
            <hr className="w-2/3 border-gray-200 dark:border-gray-700 my-2" />
            <a href="#" className="nav-link text-lg">Login</a>
            <Button className="btn-primary-custom w-3/4">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
