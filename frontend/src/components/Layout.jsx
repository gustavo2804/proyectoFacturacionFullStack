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
  return (
    <SidebarNavigationProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col transition-all duration-200 ease-in-out sidebar-inset-bg-custom">
          <header className="sticky top-0 z-10 bg-background shrink-0 w-full transition-all duration-200 ease-in-out">
            <div className="w-full flex flex-col items-center pb-4">
                <Navbar className="mt-4 p-4"/>
                <Slider/>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="flex flex-col items-top justify-center w-full p-4 pt-6">
              {children}
            </div>
          </main>
        </SidebarInset>
        <ComprobantesAlert />
      </SidebarProvider>
    </SidebarNavigationProvider>
  )
}
