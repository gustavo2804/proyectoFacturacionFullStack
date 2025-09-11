import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { NavItem } from "./NavItem";
import { navigationConfig } from "../config/navigationConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar({sidebarTrigger}) {
  const [activeItem, setActiveItem] = useState('Home');
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { menuItems } = navigationConfig;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Búsqueda:', searchValue);
    // Aquí puedes agregar la lógica de búsqueda
  };

  return (
    <>
    <nav className={`w-full border-b divider-border transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-white/40 backdrop-blur-xl shadow-sm' 
        : 'navbar-bg-custom'
    }`}>

      <div className="w-full flex h-14 sm:h-16 items-center px-2 sm:px-4 sm:mt-4 lg:mt-2 lg:px-6 transition-all duration-200 ease-in-out">

      <SidebarTrigger className="text-slate-700 hover:bg-emerald-500 hover:text-white mr-1 sm:mr-2 flex-shrink-0" />
        
        {/* Contenedor central: navegación y búsqueda */}
        <div className="flex items-center flex-1 justify-center transition-all duration-200 ease-in-out">
          {/* Barra de búsqueda */}
          <div className="flex justify-center w-full max-w-lg">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Buscar..."
                  className="w-full h-8 sm:h-9 pl-8 sm:pl-10 pr-4 text-xs sm:text-sm border divider-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-700 placeholder:text-slate-500 hover:bg-slate-50 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-slate-500 hover:text-slate-700"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Botón */}
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-md border-emerald-500 bg-white text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors ml-1 sm:ml-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 flex-shrink-0 hidden sm:flex"
        >
          Sign Up
        </Button>
        
        {/* Botón móvil (solo icono) */}
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-md border-emerald-500 bg-white text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors ml-1 px-2 py-1 flex-shrink-0 sm:hidden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Button>
      </div>
    </nav>
    </>
  )
}




  export default Navbar