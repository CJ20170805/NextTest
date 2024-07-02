"use server"

import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { sign } from "@/app/utils/auth";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import { prisma } from '@/app/db/prisma';

interface LoginProps {
    email: string;
    password: string;
}


export default async function loginAction(formData: LoginProps) {
    const { email, password } = formData;
    

    const userExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    }) as LoginProps | null;
    
    
    if (!userExist) {
    return {
        errors: 'error: Invalid user',
        success: false,
        data: null,
      }
    }

    // Check password
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
     // throw new Error('error: Invalid password')
     return {
        success: false,
        data: null, errors: 'error: Invalid password',
      }
    }

    const token = await sign({email: userExist.email});
    console.log('crente action!!!!', token);
    

    if(token){
        cookies().set({
            name: 'token',
            value: token,
            httpOnly: false,
            path: '/',
            maxAge: 3600
          })
    }

    revalidatePath('/login');
    redirect('/dashboard/home');
    
}
