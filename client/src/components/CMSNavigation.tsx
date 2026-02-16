import {
  BarChart3,
  BookOpen,
  Box,
  ChevronDown,
  Compass,
  DollarSign,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Settings,
  Ship,
  Waves,
  Anchor,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export type MenuGroup = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
};

export type MenuItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const menuGroups: MenuGroup[] = [
  {
    title: "Dashboard",
    icon: Home,
    items: [
      {
        label: "Overview",
        path: "/admin",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Content Management",
    icon: FileText,
    items: [
      {
        label: "Blog Posts",
        path: "/admin/blog",
        icon: BookOpen,
      },
      {
        label: "Island Guides",
        path: "/admin/island-guides",
        icon: Compass,
      },
      {
        label: "Attraction Guides",
        path: "/admin/attraction-guides",
        icon: Anchor,
      },
      {
        label: "Packages",
        path: "/admin/packages",
        icon: Box,
      },
    ],
  },
  {
    title: "Activity Management",
    icon: Waves,
    items: [
      {
        label: "Activity Spots",
        path: "/admin/activity-spots",
        icon: MapPin,
      },
      {
        label: "Activity Types",
        path: "/admin/activity-types",
        icon: Waves,
      },
    ],
  },
  {
    title: "Travel & Transportation",
    icon: Ship,
    items: [
      {
        label: "Boat Routes",
        path: "/admin/boat-routes",
        icon: Ship,
      },
      {
        label: "Transport Routes",
        path: "/admin/transport-routes",
        icon: Ship,
      },
      {
        label: "Map Locations",
        path: "/admin/map-locations",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Business Management",
    icon: DollarSign,
    items: [
      {
        label: "CRM Dashboard",
        path: "/admin/crm",
        icon: MessageSquare,
      },
      {
        label: "Pricing Requests",
        path: "/admin/pricing-requests",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      {
        label: "SEO Optimizer",
        path: "/admin/seo",
        icon: FileText,
      },
      {
        label: "Staff Management",
        path: "/admin/staff",
        icon: Settings,
      },
    ],
  },
];

export function CMSNavigation() {
  const [location] = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Dashboard", "Content Management"])
  );

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const isItemActive = (path: string) => {
    return location === path || location.startsWith(path + "/");
  };

  return (
    <SidebarMenu className="px-2 py-1 gap-1">
      {menuGroups.map((group) => {
        const isExpanded = expandedGroups.has(group.title);
        const hasActiveItem = group.items.some((item) =>
          isItemActive(item.path)
        );

        return (
          <Collapsible
            key={group.title}
            open={isExpanded}
            onOpenChange={() => toggleGroup(group.title)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={group.title}
                  className={`h-10 transition-all font-normal ${
                    hasActiveItem ? "bg-accent/50" : ""
                  }`}
                >
                  <group.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{group.title}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub className="ml-0 border-l border-sidebar-border px-0">
                  {group.items.map((item) => {
                    const isActive = isItemActive(item.path);
                    return (
                      <SidebarMenuSubItem key={item.path}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive}
                          className={`h-9 transition-all ${
                            isActive ? "font-semibold" : "font-normal"
                          }`}
                        >
                          <a href={item.path}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
