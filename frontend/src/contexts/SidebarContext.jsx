import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebarNavigation = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarNavigation must be used within a SidebarNavigationProvider');
  }
  return context;
};

export const SidebarNavigationProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Home');
  const [openSections, setOpenSections] = useState(new Set(['Home']));

  const toggleSection = (sectionName) => {
    setOpenSections(prev => {
      const wasOpen = prev.has(sectionName);
      if (wasOpen) {
        // Si ya estaba abierto, lo cerramos
        return new Set();
      } else {
        // Si no estaba abierto, cerramos todos y abrimos solo este
        return new Set([sectionName]);
      }
    });
    setActiveSection(sectionName);
  };

  const openSection = (sectionName) => {
    // Cerrar todas las secciones y abrir solo la seleccionada
    setOpenSections(new Set([sectionName]));
    setActiveSection(sectionName);
  };

  return (
    <SidebarContext.Provider
      value={{
        activeSection,
        openSections,
        toggleSection,
        openSection,
        setActiveSection
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
