'use client'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import './page.scss'

export default function webHomePage(){
    const authorized = false;
    if(authorized){
        redirect('/web/dashboard')
    }


    return(
        <>
        <h1>Web Home Page</h1>
        <div className="links">
        <Link href="/dashboard/home">Home</Link>
        <Link href="/admin/dashboard/home">Admin</Link>
        <Link href="/login">Login</Link>
        </div>
        </>
    )
}