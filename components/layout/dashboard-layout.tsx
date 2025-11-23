"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Users, Package, Settings, Menu, LogOut, User } from "lucide-react"
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
  { href: "/settings", label: "Ajustes", icon: Settings },
]

function NavItem({ href, label, icon: Icon, isActive }: any) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive ? "bg-slate-700 border-l-4 border-[#44C6D1] text-[#44C6D1]" : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-[#020617]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-[#111827] border-r border-[#1A587F]/40">
        {/* Logo Area */}
        <div className="px-6 py-6 border-b border-[#1A587F]/30">
          <h1 className="text-xl font-bold text-white">
            <span className="text-[#44C6D1]">Innova</span> Proformas
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return <NavItem key={item.href} {...item} isActive={isActive} />
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-6 border-t border-[#1A587F]/30">
          <p className="text-xs text-slate-500">Versión 1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="bg-[#111827] border-b border-[#1A587F]/40 px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#44C6D1]">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-[#111827] border-[#1A587F]/40">
                <div className="mt-8 space-y-2">
                  <h2 className="px-4 py-2 text-xl font-bold text-white mb-6">
                    <span className="text-[#44C6D1]">Innova</span> Proformas
                  </h2>
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return <NavItem key={item.href} {...item} isActive={isActive} />
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Page Title */}
          <h2 className="hidden md:block text-lg font-semibold text-white flex-1">
            {NAV_ITEMS.find((item) => item.href === pathname)?.label || "Dashboard"}
          </h2>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-[#44C6D1]">
                  <AvatarFallback className="bg-[#1A587F] text-white text-xs font-bold">
                    {user?.profile.name?.charAt(0) || "U"}
                    {user?.profile.lastname?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#111827] border-[#1A587F]/40">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold text-white">
                  {user?.profile.name || "Usuario"} {user?.profile.lastname || ""}
                </p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-[#1A587F]/30" />
              <DropdownMenuItem className="cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-[#44C6D1]">
                <User className="mr-2 h-4 w-4" />
                <span>Mi cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1A587F]/30" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-slate-300 focus:bg-slate-800 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-[#0F1419]">
          <div className="p-4 md:p-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
