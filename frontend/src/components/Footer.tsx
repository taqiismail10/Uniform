// uniform/frontend/src/components/Footer.tsx

import { FaTwitter, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 px-6 md:px-8 dark:bg-gray-950">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div className="flex flex-col items-start space-y-4">
          <div className="text-2xl sm:text-3xl font-bold text-white mb-2">UniForm</div>
          <div className="flex space-x-4">
            {/* Social media links: 'transition-colors duration-200' is handled by global 'a' rule in common.css */}
            {/* 'hover:text-white' is intentional here for contrast on dark background */}
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaYoutube className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-sm sm:text-base">
          <div>
            <h4 className="font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {/* Footer navigation links: 'transition-colors duration-200' is handled by global 'a' rule in common.css */}
              {/* 'hover:text-white' is intentional here for contrast on dark background */}
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Universities</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} UniForm. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;