import AdminLayout from '../components/layout/layout';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin-Page',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {



  return (
    <>
      <AdminLayout>
        {children}
      </AdminLayout>
    </>
  )
}