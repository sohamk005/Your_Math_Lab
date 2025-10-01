import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Header = ({ activePage, setActivePage }) => {

  const getNavLinkClass = ({ isActive }) => {
    return `px-3 py-2 text-md lg:text-lg font-medium rounded-md transition ${ 
      isActive 
        ? 'bg-blue-600 text-white' // Style for the active link
        : 'text-gray-600 hover:bg-blue-100' // Style for inactive links
    }`;
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-10">
      <nav className="max-w-5xl mx-auto flex justify-between items-center p-4">
        {/* The main title is now a Link to the homepage */}
        <Link to="/" className="text-xl lg:text-2xl font-bold text-gray-800 cursor-pointer">
          Your Math Lab
        </Link>
        <div className="flex space-x-1 lg:space-x-2">
          {/* Each button is now a NavLink with a 'to' prop pointing to the URL path */}
          <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
          <NavLink to="/solvers" className={getNavLinkClass}>Solvers</NavLink>
          <NavLink to="/curves" className={getNavLinkClass}>Curves</NavLink>
          <NavLink to="/matrix" className={getNavLinkClass}>Matrix</NavLink>
          <NavLink to="/calculus" className={getNavLinkClass}>Calculus</NavLink>
          <NavLink to="/generalplotter" className={getNavLinkClass}>Function Plotter</NavLink>
          <NavLink to="/parameterplotter" className={getNavLinkClass}>Parametric</NavLink>
          {/* <NavLink to="/blog" className={getNavLinkClass}>Blog</NavLink> */} 
        </div>
      </nav>
    </header>
  );
};

export default Header;

