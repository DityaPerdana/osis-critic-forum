import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 sm:h-16">
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="text-sm sm:text-base font-bold text-blue-600"
            >
              OSIS
            </Link>
            <Link
              to="/"
              className="text-sm sm:text-base font-bold text-gray-600"
            >
              SMKN
            </Link>
            <Link
              to="/"
              className="text-sm sm:text-base font-bold text-blue-600"
            >
              4
            </Link>
          </div>

          <div className="flex space-x-4 sm:space-x-8 text-sm sm:text-base">
            <Link
              to="/about"
              className={`${isActive("/about") ? "text-blue-600" : "text-gray-600"} hover:text-blue-500 transition-colors`}
            >
              About
            </Link>
            <Link
              to="/ekstrakurikuler"
              className={`${isActive("/ekstrakurikuler") ? "text-blue-600" : "text-gray-600"} hover:text-blue-500 transition-colors`}
            >
              Ekstrakurikuler
            </Link>
            <Link
              to="/forum"
              className={`${isActive("/forum") ? "text-blue-600" : "text-gray-600"} hover:text-blue-500 transition-colors cursor-pointer`}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/forum/";
              }}
            >
              Forum
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
