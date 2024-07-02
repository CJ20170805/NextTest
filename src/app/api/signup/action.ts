"use server"

import { cookies } from 'next/headers';
import { prisma } from '@/app/db/prisma';
import bcrypt from 'bcrypt';
import { sign } from "@/app/utils/auth";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import { setTimeout } from 'timers/promises';

interface SignupProps {
    username: string;
    password: string;
    email: string;
}

export default async function signup(formData: SignupProps) {
    // store the formData to user table
    try {
        await prisma.user.create({
            data: {
                username: formData.username,
                password: await bcrypt.hash(formData.password, 10),
                email: formData.email,
            }
        })

        const token = await sign({email: formData.email});
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
    
        // revalidatePath('/signup');
        // redirect('/dashboard/home');

        return {
            success: true,
            data: null, errors: 'Register success!' ,
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: null, errors: 'Register failed!' ,
        }
    }

}