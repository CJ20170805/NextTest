'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form';
import { NumberInput, PasswordInput, TextInput, Button, Group } from '@mantine/core';
import loginAction from '@/app/api/login/action'; 
import './login.scss';

interface LoginProps {
    email: string;
    password: string;
}

const Login = () => {
    //const router = useRouter();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: ''},
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (!value || value == ''? 'Cannot be empty' : null),
        },
    });

    const submitHandler = async (form:LoginProps)=>{
       console.log('xxx', form);
       let res =  await loginAction(form);
       console.log('resss222', res);
       
       

    //    const response = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(form)
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     // Handle successful login
    //     //setMessage('Login successful!');
    //     console.log('Token:', data.res);
    //     // Save the token in localStorage or cookies if needed
    //   } else {
    //     // Handle error
    //     //setMessage(data.message);
    //   }
  
    }
    return (
        <div className="login-wrapper">
            <div className="login-form">
                <form onSubmit={form.onSubmit(submitHandler)}>
                    <TextInput
                        label="Email"
                        placeholder="Email"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Password"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                     <Group justify="space-between">
                    <Button type="submit">
                        Login
                    </Button>
                    <Link className="sign-up" href="/signup">Signup</Link>
                    </Group>
                </form>
                 {/* <form action={loginAction}>
      <input type="text" name="username" />
      <button type='submit'>xxssss</button>
    </form> */}
            </div>
        </div>
    )
}
export default Login;