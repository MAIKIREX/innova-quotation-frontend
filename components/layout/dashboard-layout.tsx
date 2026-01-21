"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Users, Package, Settings, Menu, LogOut, User, ChevronLeft, ChevronRight, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export type DashboardLayoutProps = {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { href: "/quotations", label: "Proformas", icon: FileText },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/companies", label: "Companias", icon: Building2 },
  { href: "/settings", label: "Ajustes", icon: Settings },
]

type NavItemProps = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
  collapsed: boolean
}

function NavItem({ href, label, icon: Icon, isActive, collapsed }: NavItemProps) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
          collapsed ? "justify-center" : "rounded-md"
        } ${
          isActive
            ? "bg-[#3C6E71]/20 border-l-4 border-[#3C6E71] text-[#F4F7F5]"
            : "text-[#A7A2A9] hover:bg-[#3C6E71]/10 hover:text-[#F4F7F5]"
        }`}
      >
        <Icon className="w-5 h-5" />
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </div>
    </Link>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-[#000000] text-[#F4F7F5]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col border-r border-[#3C6E71]/40 bg-[#000000] transition-all duration-300 ${
          isSidebarCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#3C6E71]/30">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-[#F4F7F5]">
              <span className="text-[#3C6E71]">Innova</span> Proformas
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="text-[#A7A2A9] hover:text-[#F4F7F5]"
            aria-label={isSidebarCollapsed ? "Expandir sidebar" : "Ocultar sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return <NavItem key={item.href} {...item} isActive={isActive} collapsed={isSidebarCollapsed} />
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-6 border-t border-[#3C6E71]/30">
          {!isSidebarCollapsed && <p className="text-xs text-[#A7A2A9]">Versión 1.0</p>}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="bg-[#000000] border-b border-[#3C6E71]/40 px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#A7A2A9] hover:text-[#F4F7F5]">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-[#000000] border-[#3C6E71]/40">
                <div className="mt-8 space-y-2">
                  <h2 className="px-4 py-2 text-xl font-bold text-[#F4F7F5] mb-6">
                    <span className="text-[#3C6E71]">Innova</span> Proformas
                  </h2>
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return <NavItem key={item.href} {...item} isActive={isActive} collapsed={false} />
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Page Title */}
          <h2 className="hidden md:block text-lg font-semibold text-[#F4F7F5] flex-1">
            {NAV_ITEMS.find((item) => item.href === pathname)?.label || "Dashboard"}
          </h2>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-[#3C6E71]">
                  <AvatarFallback className="bg-[#3C6E71]/30 text-[#F4F7F5] text-xs font-bold">
                    {user?.profile?.name?.charAt(0) || "U"}
                    {user?.profile?.lastname?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#000000] border-[#3C6E71]/40">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold text-[#F4F7F5]">
                  {user?.profile?.name || "Usuario"} {user?.profile?.lastname || ""}
                </p>
                <p className="text-xs text-[#A7A2A9]">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-[#3C6E71]/30" />
              <DropdownMenuItem className="cursor-pointer text-[#A7A2A9] focus:bg-[#3C6E71]/10 focus:text-[#F4F7F5]">
                <User className="mr-2 h-4 w-4" />
                <span>Mi cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#3C6E71]/30" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-[#A7A2A9] focus:bg-[#F8333C]/10 focus:text-[#F8333C]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-[#000000]">
          <div className="p-4 md:p-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
