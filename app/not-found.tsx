"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-6">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-[#A7A2A9]">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#F4F7F5]">Pagina no encontrada</h1>
        <p className="mt-3 text-sm text-[#A7A2A9]">
          La pagina que buscas no existe o fue movida. Puedes volver al dashboard.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild className="bg-[#3C6E71] hover:bg-[#345c5f] text-[#F4F7F5]">
            <Link href="/quotations">Ir a Proformas</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#3C6E71]/40 text-[#F4F7F5]">
            <Link href="/login">Ir al Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
