// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL
import { redirect } from 'next/navigation'

export default function dashboard() {
    redirect('/dashboard/home')
}