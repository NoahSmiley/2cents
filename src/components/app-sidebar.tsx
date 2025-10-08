// src/components/app-sidebar.tsx
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"
import { Wallet, Repeat, Target, Settings, List } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/assets/twocents.png";

const nav = [
    { to: "/", label: "Dashboard", icon: Wallet },
    { to: "/transactions", label: "Transactions", icon: List },
    { to: "/recurring", label: "Recurring", icon: Repeat },
    { to: "/goals", label: "Goals", icon: Target },
    { to: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2">
                    <img
                        src={logo}
                        alt="TwoCents"
                        className="h-10 w-10 shrink-0 rounded object-cover aspect-square"
                    />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs">Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {nav.map(({ to, label, icon: Icon }) => (
                                <SidebarMenuItem key={to}>
                                    <SidebarMenuButton
                                        asChild
                                        size="sm"
                                        tooltip={label}
                                        className={cn(
                                            // bigger square & a bit of breathing room when collapsed
                                            "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-1",
                                            // keep content centered in icon mode
                                            "group-data-[collapsible=icon]:justify-center"
                                        )}
                                    >
                                        <NavLink
                                            to={to}
                                            end
                                            className={({ isActive }) =>
                                                cn(
                                                    "flex items-center gap-2 w-full min-w-0",
                                                    // icon size
                                                    "[&>svg]:shrink-0 [&>svg]:!size-5",
                                                    // --- colors ---
                                                    isActive
                                                        ? "bg-fun-grad text-white"              // active = gradient + white text
                                                        : "text-white hover:bg-accent/40"       // inactive = plain white + subtle hover
                                                )
                                            }
                                        >
                                            <Icon className="text-white" />               {/* ensure icon is also white */}
                                            <span
                                                className={cn(
                                                    "truncate transition-all duration-200 ease-linear text-white", // force text white
                                                    "group-data-[collapsible=icon]:opacity-0",
                                                    "group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:ml-0",
                                                    "group-data-[collapsible=icon]:pointer-events-none"
                                                )}
                                            >
                                                {label}
                                            </span>
                                        </NavLink>

                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail className="p-0 m-0 rounded-none outline-none focus-visible:outline-none focus-visible:ring-0 after:rounded-none" />

        </Sidebar>
    )
}
