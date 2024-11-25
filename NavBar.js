import React, { useState } from 'react';
import './navbar.css';
import 'remixicon/fonts/remixicon.css';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    books: false,
    profile: false,
  });
  const navigate = useNavigate();

  // Toggle main menu visibility
  const toggleMenu = () => setShowMenu(!showMenu);

  // Toggle dropdown menus
  const toggleDropdown = (menu) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Handle book category selection
  const handleCategorySelect = (category) => {
    navigate('/Books', { state: { category } });
    setShowMenu(false); // Close menu after selection
  };

  return (
    <header className="header">
      <nav className="nav container">
        <div className="nav__data">
          <Link to="/" className="nav__logo">
            <i className="ri-planet-line"></i> Libravese
          </Link>

          <div
            className={`nav__toggle ${showMenu ? 'show-icon' : ''}`}
            onClick={toggleMenu}
          >
            <i className={`ri-${showMenu ? 'close' : 'menu'}-line nav__burger`}></i>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`}>
          <ul className="nav__list">
            <li>
              <Link to="/" className="nav__link">
                Home
              </Link>
            </li>

            {/* Dropdown for Books */}
            <li className="dropdown__item">
              <div
                className="nav__link"
                onClick={() => toggleDropdown('books')}
              >
                Books <i className="ri-arrow-down-s-line dropdown__arrow"></i>
              </div>
              {dropdownOpen.books && (
                <ul className="dropdown__menu">
                  <li>
                    <button
                      className="dropdown__link"
                      onClick={() => handleCategorySelect('All')}
                    >
                      All Book  
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown__link"
                      onClick={() => handleCategorySelect('Thriller')}
                    >
                      Thriller
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown__link"
                      onClick={() => handleCategorySelect('Novel')}
                    >
                      Novels
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown__link"
                      onClick={() => handleCategorySelect('Horror')}
                    >
                      Horror
                    </button>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/favourite" className="nav__link">
                Favourite
              </Link>
            </li>
            <li>
              <Link to="/ads" className="nav__link">
                Ads
              </Link>
            </li>

            {/* Dropdown for Profile */}
            <li className="dropdown__item">
              <div
                className="nav__link"
                onClick={() => toggleDropdown('profile')}
              >
                Profile <i className="ri-arrow-down-s-line dropdown__arrow"></i>
              </div>
              {dropdownOpen.profile && (
                <ul className="dropdown__menu">
                  <li>
                    <Link to="/settings" className="dropdown__link">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link to="/signout" className="dropdown__link">
                      SignOut
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
