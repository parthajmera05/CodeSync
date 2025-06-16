"use client";
import React, { useState } from "react";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-opacity-50 backdrop-blur-md fixed w-full z-20 top-0 start-0 rounded-lg shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
          
        <span className="self-center text-2xl hidden md:block lg:block font-semibold whitespace-nowrap bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
        CodeSync
        </span> 

        </a>
        <div className="flex gap-1 md:gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="text-white bg-red-600 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            <a href="/combined">Get started</a>
          </button>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`
            absolute 
            top-[75%] 
            right-0 
            w-full
            lg:w-auto
            lg:static 
            lg:block
            rounded-lg
            p-1
            ${isMenuOpen ? "block" : "hidden"}
          `}
          id="navbar-sticky"
        >
          <ul className="bg-black lg:bg-transparent w-full flex flex-col p-4 lg:p-0 mt-4 font-medium border border-white rounded-lg lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:mt-0 lg:border-0">
            <li>
              <button
                onClick={() => scrollToSection("home")}
                className="block py-2 px-3 text-white hover:text-orange-500 rounded lg:bg-transparent lg:p-0"
                aria-current="page"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("features")}
                className="block py-2 text-white px-3 rounded hover:text-orange-500 lg:hover:bg-transparent lg:p-0"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("about")}
                className="block py-2 text-white px-3 rounded hover:text-orange-500 lg:hover:bg-transparent lg:p-0"
              >
                About Me
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
