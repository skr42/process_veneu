import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            Portfolio Manager
          </Link>
          
          {user ? (
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className={isActive('/profile') ? 'active' : ''}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  to="/skills" 
                  className={isActive('/skills') ? 'active' : ''}
                >
                  Skills
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects" 
                  className={isActive('/projects') ? 'active' : ''}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/work" 
                  className={isActive('/work') ? 'active' : ''}
                >
                  Work
                </Link>
              </li>
              <li>
                <Link 
                  to="/links" 
                  className={isActive('/links') ? 'active' : ''}
                >
                  Links
                </Link>
              </li>
              <li>
                <button 
                  onClick={logout} 
                  className="btn btn-secondary btn-small"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="nav-links">
              <li>
                <Link 
                  to="/login" 
                  className={isActive('/login') ? 'active' : ''}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={isActive('/register') ? 'active' : ''}
                >
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
