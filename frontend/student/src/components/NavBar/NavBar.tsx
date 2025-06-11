import { Link, NavLink } from 'react-router'
import './NavBar.css'
import { Button } from '@radix-ui/themes'
import { useState, useEffect, useRef } from 'react'
import { User, Menu, X } from 'lucide-react';

interface NavBarProps {
  loginStatus: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}

const NavBar = (props: NavBarProps) => {
  const { loginStatus, handleLogin, handleLogout } = props;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // desktop
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false); // mobile
  const dropdownRef = useRef<HTMLDivElement>(null); // desktop
  const hamburgerRef = useRef<HTMLDivElement>(null); // mobile

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleHamburger = () => setIsHamburgerOpen((prev) => !prev);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close hamburger dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isHamburgerOpen &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsHamburgerOpen(false);
      }
    };
    if (isHamburgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHamburgerOpen]);

  const onLogout = () => {
    handleLogout();
    setIsDropdownOpen(false);
    setIsHamburgerOpen(false);
  };

  const onLogin = () => {
    handleLogin();
    setIsDropdownOpen(false);
    setIsHamburgerOpen(false);
  };

  return (
    <nav className='flex items-center justify-between p-4 md:px-8 shadow-lg'>
      <div className='w-[30%] lg:w-[20%]'>
        <Link to='/' className='logo'>
          <img src="/logo.svg" alt="logo" />
          <h2>UniForm</h2>
        </Link>
      </div>
      <div className='gap-4 w-[69%] lg:w-[79%] justify-between hidden sm:flex'>
        <div className='nav-links mr-4'>
          <NavLink
            to='/'
          >Home</NavLink>
          <NavLink to='/test-component'>Features</NavLink>
          {loginStatus && <NavLink to='/dashboard'>Dashboard</NavLink>}
        </div>
        {loginStatus ? (
          <div className='relative' ref={dropdownRef}>
            <User className='user-icon' onClick={toggleDropdown} />
            {isDropdownOpen && (
              <div className='user-menu-dropdown open'>
                <div className='user-info'>
                  <div className='user-avatar'></div>
                  <span className='user-name'>User Name</span>
                </div>
                <Link to='/profile' className='menu-item' onClick={toggleDropdown}>User Profile</Link>
                <Button className='button-primary' onClick={onLogout}>Logout</Button>
              </div>
            )}
          </div>
        ) : (
          <div className='nav-buttons hidden sm:flex'>
            <Button size='3' variant='solid' className='button-secondary' onClick={onLogin}>Login</Button>
            <Button size='3' variant='solid' className='button-primary'>Signup</Button>
          </div>
        )}
      </div>

      {/* For Small Screen */}
      <div className='flex sm:hidden' ref={hamburgerRef}>
        <Menu className='hamburger-icon' onClick={toggleHamburger} />
        <div>
          <div className='relative'>
            {isHamburgerOpen && (
              <div className='hamburger-menu-dropdown open'>
                <div className='flex w-full items-center justify-end'>
                  <X
                    className='hamburger-icon'
                    onClick={toggleHamburger}
                  />
                </div>
                <div className='flex flex-col justify-between h-full'>
                  <div className='nav-links border-b-1 border-gray-200 mt-4 pt-4 pb-4 flex'>
                    <NavLink
                      to='/'
                      onClick={toggleHamburger}
                    >Home</NavLink>
                    <NavLink
                      to='/test-component'
                      onClick={toggleHamburger}
                    >Features</NavLink>
                    {loginStatus && (
                      <NavLink
                        to='/dashboard'
                        onClick={toggleHamburger}
                      >Dashboard</NavLink>
                    )}
                  </div>

                  {loginStatus ? (
                    <div>
                      <div className='user-info'>
                        <div>
                          <User className='user-avatar' />
                        </div>
                        <span className='user-name'>User Name</span>
                      </div>
                      <Link
                        to='/profile'
                        className='menu-item'
                        onClick={toggleHamburger}
                      >User Profile</Link>
                      <Button className='button-primary' onClick={onLogout}>Logout</Button>
                    </div>
                  ) : (
                    <div className='nav-buttons flex flex-col'>
                      <Button size='3' variant='solid' className='button-secondary' onClick={onLogin}>Login</Button>
                      <Button size='3' variant='solid' className='button-primary'>Signup</Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;