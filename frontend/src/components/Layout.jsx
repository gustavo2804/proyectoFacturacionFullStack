import { useLocation } from 'react-router-dom';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import Slider from "./Slider"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Navbar } from "./Navbar"
import { SidebarNavigationProvider } from "@/contexts/SidebarContext";
import ComprobantesAlert from "./ComprobantesAlert";

export default function Layout({children}) {
  const location = useLocation();
  
  // Rutas que no deben mostrar el layout completo (solo el contenido)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  // Si es una ruta de autenticación, solo mostrar el contenido
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Para rutas protegidas, mostrar el layout completo
  return (
    <SidebarNavigationProvider>
      <SidebarProvider>
        <div className="flex flex-col h-screen w-full">
          {/* Navbar extending over entire width */}
          <header className="sticky top-0 z-20 bg-background shrink-0 w-full transition-all duration-200 ease-in-out">
            <Navbar />
          </header>
          
          {/* Main content area with sidebar */}
          <div className="flex flex-1 overflow-hidden w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col transition-all duration-200 ease-in-out sidebar-inset-bg-custom flex-1 min-w-0">
              <main className="flex-1 overflow-auto w-full">
                <div className="flex flex-col items-top justify-center w-full p-4 pt-6">
                  {children}
                </div>
              </main>
            </SidebarInset>
          </div>
        </div>
        <ComprobantesAlert />
      </SidebarProvider>
    </SidebarNavigationProvider>
  )
}
