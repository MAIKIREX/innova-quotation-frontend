import type { ReactNode } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageTransition } from "@/components/layout/page-transition"

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DashboardLayout>
      <PageTransition>{children}</PageTransition>
    </DashboardLayout>
  )
}
