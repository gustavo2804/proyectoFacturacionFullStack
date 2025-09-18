import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { NavItem } from "./NavItem";
import { navigationConfig } from "../config/navigationConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Settings } from "lucide-react";

export function Navbar({sidebarTrigger}) {
  const [activeItem, setActiveItem] = useState('Home');
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { menuItems } = navigationConfig;
  
  // User data for NavUser component
  const userData = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  };

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

      <div className="w-full flex h-14 sm:h-16 items-center px-2 sm:px-4 lg:px-6 transition-all duration-200 ease-in-out">
        
        {/* Logo section - left side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <SidebarTrigger className="text-slate-700 hover:bg-emerald-500 hover:text-white" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-lg font-semibold text-slate-700 hidden sm:block">Facturación</span>
          </div>
        </div>
        
        {/* Search section - center */}
        <div className="flex items-center flex-1 justify-center px-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
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

        {/* User section - right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Settings button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* User dropdown */}
          <div className="hidden sm:block">
            <NavUser user={userData} />
          </div>
          
          {/* Mobile user button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors sm:hidden"
          >
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">CN</span>
            </div>
          </Button>
        </div>
      </div>
    </nav>
    </>
  )
}




  export default Navbar