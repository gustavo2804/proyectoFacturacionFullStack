import React from "react";
import { useSidebarNavigation } from "@/contexts/SidebarContext";

const NavItem = ({ item, isActive, onClick }) => {
  const { openSection, activeSection } = useSidebarNavigation();

  const handleClick = (e) => {
    e.preventDefault();
    onClick(item.name);
    openSection(item.name);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative font-medium cursor-pointer transition-all duration-300 ${
        isActive 
        ? 'text-emerald-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-emerald-500' 
        : 'text-slate-700 hover:text-emerald-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-emerald-500 after:transition-all after:duration-300 hover:after:w-full'
      }`}
    >
      {item.name}
    </button>
  );
};

export { NavItem };