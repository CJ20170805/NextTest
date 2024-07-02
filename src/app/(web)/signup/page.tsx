'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form';
import { NumberInput, PasswordInput, TextInput, Button, Group } from '@mantine/core';
import signupAction from '@/app/api/signup/action';
import './signup.scss';

interface signupProps {
    username: string;
    password: string;
    email: string;
}

const Signup = () => {
    const router = useRouter();
    const signup = () => {
        // router.push('/web/dashboard');
    }
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },

        // functions will be used to validate values at corresponding key
        validate: {
            username: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (!value || value == '' ? 'Cannot be empty' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords did not match' : null,
        },
    });

    const submitHandler = async (form: signupProps) => {
        console.log('xxx', form);
        let res = await signupAction(form);
        console.log('resss222', res);
        if (res?.success) {
            router.push('/dashboard/home');
        }




    }
    return (
        <div className="signup-wrapper">
            <div className="signup-form">
                <form onSubmit={form.onSubmit(submitHandler)}>
                    <TextInput
                        label="Username"
                        placeholder="Username"
                        key={form.key('username')}
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        label="Email"
                        placeholder="email"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Password"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />

                    <PasswordInput
                        mt="sm"
                        label="Confirm password"
                        placeholder="Confirm password"
                        key={form.key('confirmPassword')}
                        {...form.getInputProps('confirmPassword')}
                    />

                    <Group justify="space-between">
                        <Button type="submit">
                            signup
                        </Button>
                        <Link className="sign-up" href="/login">Login</Link>
                    </Group>
                </form>
                {/* <form action={signupAction}>
      <input type="text" name="username" />
      <button type='submit'>xxssss</button>
    </form> */}
            </div>
        </div>
    )
}
export default Signup;