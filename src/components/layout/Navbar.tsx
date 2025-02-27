import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  const Path = (props: any) => (
    <motion.path
      fill="transparent"
      strokeWidth="3"
      stroke="currentColor"
      strokeLinecap="round"
      {...props}
    />
  );

  return (
    <nav className="bg-background shadow-sm fixed w-full top-0 z-50">
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

          <div className="flex items-center gap-2">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="sm:hidden flex flex-col justify-center items-center w-8 h-8 text-gray-600"
            >
              <svg width="23" height="23" viewBox="0 0 23 23">
                <Path
                  variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" },
                  }}
                  animate={isOpen ? "open" : "closed"}
                />
                <Path
                  d="M 2 9.423 L 20 9.423"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.1 }}
                  animate={isOpen ? "open" : "closed"}
                />
                <Path
                  variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" },
                  }}
                  animate={isOpen ? "open" : "closed"}
                />
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden sm:flex space-x-4 sm:space-x-8 text-sm sm:text-base">
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

        {/* Mobile Menu */}
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={menuVariants}
          transition={{ duration: 0.2 }}
          className="sm:hidden absolute left-0 right-0 bg-white border-b"
        >
          <div className="flex flex-col space-y-4 p-4">
            <Link
              to="/about"
              className={`${isActive("/about") ? "text-blue-600" : "text-gray-600"} hover:text-blue-500 transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/ekstrakurikuler"
              className={`${isActive("/ekstrakurikuler") ? "text-blue-600" : "text-gray-600"} hover:text-blue-500 transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Ekstrakurikuler
            </Link>
            <Link
              to="/forum"
              className={`${isActive("/forum") ? "text-blue-600" : "text-gray-600"} hover:text-blue-500 transition-colors cursor-pointer`}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/forum/";
                setIsOpen(false);
              }}
            >
              Forum
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
