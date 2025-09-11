"use client"

import { ChevronRight, Home, Receipt, Package, Users, Plus, List, FileText, Tag, Archive, Upload, BarChart3 } from "lucide-react"
import { useSidebarNavigation } from "@/contexts/SidebarContext"
import { useNavigate } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Mapeo de iconos
const iconMap: { [key: string]: any } = {
  home: Home,
  receipt: Receipt,
  package: Package,
  users: Users,
  plus: Plus,
  list: List,
  document: FileText,
  tag: Tag,
  archive: Archive,
  upload: Upload,
  chart: BarChart3,
}

export function NavCustom({
  items,
}: {
  items: {
    name: string
    href: string
    icon: string
    actions?: {
      name: string
      href: string
      icon: string
    }[]
  }[]
}) {
  const { activeSection, openSections, toggleSection, setActiveSection } = useSidebarNavigation();
  const navigate = useNavigate();

  const handleSectionToggle = (item: any) => {
    // Actualizar la sección activa
    setActiveSection(item.name);
    // Manejar la apertura/cierre de las secciones
    toggleSection(item.name);
    // Solo navegar si no tiene sub-acciones (es un elemento simple)
    if (!item.actions || item.actions.length === 0) {
      if (item.href) {
        navigate(item.href);
      }
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Facturación</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const IconComponent = iconMap[item.icon] || Home;
          const isOpen = openSections.has(item.name);
          const isActive = activeSection === item.name;
          
          return (
            <Collapsible
              key={item.name}
              asChild
              open={isOpen}
              onOpenChange={() => handleSectionToggle(item)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.name}
                    isActive={isActive}
                  >
                    <IconComponent />
                    <span>{item.name}</span>
                    {item.actions && item.actions.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.actions && item.actions.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.actions.map((action) => {
                        const ActionIcon = iconMap[action.icon] || Plus;
                        return (
                          <SidebarMenuSubItem key={action.name}>
                            <SidebarMenuSubButton 
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveSection(item.name);
                                navigate(action.href);
                              }}
                            >
                              <ActionIcon className="w-4 h-4" />
                              <span>{action.name}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
