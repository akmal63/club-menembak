import Sidebar from '@/components/sidebar'
import { ToastProvider } from '@/components/toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </ToastProvider>
  )
}
