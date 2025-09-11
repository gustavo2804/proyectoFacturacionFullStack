import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SliderItem from "./SliderItem"
import { useSidebarNavigation } from "@/contexts/SidebarContext"
import { navigationConfig } from "../config/navigationConfig"
import CreateUserModal from "./CreateUserModal"

export default function Slider() {
    const navigate = useNavigate()
    const { activeSection } = useSidebarNavigation()
    const [activeTab, setActiveTab] = useState(0)
    const [isScrolled, setIsScrolled] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false)

    // Reset activeTab to 0 when activeSection changes
    useEffect(() => {
        setActiveTab(0)
    }, [activeSection])

    // Scroll effect
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
    }, [])

    // Encontrar el item activo y sus acciones
    const activeMenuItem = navigationConfig.menuItems.find(
        item => item.name === activeSection
    )

    // Título y tabs por defecto si no hay sección activa
    const title = activeMenuItem ? activeMenuItem.name : 'Dashboard'
    const tabs = activeMenuItem?.actions || [
        { name: "Overview", href: '/overview' },
        { name: "Analytics", href: '/analytics' },
        { name: "Reports", href: '/reports' },
        { name: "Notifications", href: '/notifications' }
    ]

    const handleTabClick = (index, tab) => {
        // Verificar si es una acción de creación
       // if (tab.name === "Nuevo Cliente") {
         //   setCreateModalOpen(true)
           // return
       // }
        
        // Navegación normal
        setActiveTab(index)
        if (tab.href) {
            navigate(tab.href)
        }
    }

    const handleCreateSuccess = (newCliente) => {
        setCreateModalOpen(false)
        // Aquí puedes agregar lógica adicional como refrescar datos
    }

    return (
        <div className={`max-w-2xl border-b rounded-xl divider-border sm:mt-4 transition-all duration-300 ease-in-out ${
            isScrolled 
                ? 'bg-white/20 backdrop-blur-xl shadow-sm' 
                : 'bg-white'
        }`}>
            <div className="px-1 py-1 sm:px-2 sm:py-2 lg:px-3 lg:py-2">
                {/* Tabs de navegación */}
                <div className="w-auto flex items-center justify-center overflow-x-auto scrollbar-hide space-x-0 sm:space-x-1">
                    {tabs.map((tab, index) => (
                        <SliderItem
                            key={tab.name}
                            label={tab.name}
                            isActive={index === activeTab}
                            redirect={tab.href}
                            onClick={() => handleTabClick(index, tab)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal de creación de usuario */}
            <CreateUserModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    )
}