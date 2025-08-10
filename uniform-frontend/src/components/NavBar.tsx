import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Check if a link is active
  const isActive = (path: string) => {
    // For anchor links
    if (path.startsWith("#")) {
      return activeSection === path;
    }
    // For regular routes
    return location.pathname === path;
  };

  // Track active section for anchor links
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "process", "testimonial", "support"];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(`#${section}`);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          color: #4b5563;
          transition: color 0.3s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #000;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 1px;
          left: 50%;
          background-color: #000;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
          left: 0;
        }
      `}</style>
      <nav className="sticky top-0 z-50 bg-white shadow-sm py-1 sm:py-2">
        <div className="w-full mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src="/logo.svg" alt="logo" width={30} />
                <span className="text-2xl font-bold ml-2 text-gray-900">UniForm</span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center md:space-x-2 lg:space-x-4 xl:space-x-6">
                <a
                  href="#hero"
                  className={`px-3 py-2 rounded-md font-medium nav-link ${isActive('#hero') ? 'active' : ''}`}
                >
                  Home
                </a>
                <a
                  href="#features"
                  className={`px-3 py-2 rounded-md font-medium nav-link ${isActive('#features') ? 'active' : ''}`}
                >
                  Features
                </a>
                <a
                  href="#process"
                  className={`px-3 py-2 rounded-md font-medium nav-link ${isActive('#process') ? 'active' : ''}`}
                >
                  Process
                </a>
                <a
                  href="#testimonial"
                  className={`px-3 py-2 rounded-md font-medium nav-link ${isActive('#testimonial') ? 'active' : ''}`}
                >
                  Testimonial
                </a>
                <a
                  href="#support"
                  className={`hidden lg:flex px-3 py-2 rounded-md font-medium nav-link ${isActive('#support') ? 'active' : ''}`}
                >
                  Support
                </a>
              </div>
            </div>
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/registration">Registration</Link>
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Navigation Menu - Slide In */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col p-4 space-y-2">
          <a
            href="#hero"
            className={`px-1 py-1 rounded-md text-base font-medium nav-link ${isActive('#hero') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </a>
          <a
            href="#features"
            className={`px-1 py-1 rounded-md text-base font-medium nav-link ${isActive('#features') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Features
          </a>
          <a
            href="#process"
            className={`px-1 py-1 rounded-md text-base font-medium nav-link ${isActive('#process') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Process
          </a>
          <a
            href="#testimonial"
            className={`px-1 py-1 rounded-md text-base font-medium nav-link ${isActive('#testimonial') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Testimonial
          </a>
          <a
            href="#support"
            className={`px-1 py-1 rounded-md text-base font-medium nav-link ${isActive('#support') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Support
          </a>
        </div>
        <div className="p-4 mt-10 border-t border-gray-200">
          <div className="mb-3">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link to="/login" onClick={closeMenu}>Login</Link>
            </Button>
          </div>
          <div>
            <Button
              className="w-full"
              asChild
            >
              <Link to="/registration" onClick={closeMenu}>Registration</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-white opacity-80 z-40 md:hidden"
          onClick={closeMenu}
        ></div>
      )}
    </>
  );
};

export default NavBar;