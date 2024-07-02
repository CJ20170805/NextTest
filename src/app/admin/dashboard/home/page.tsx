'use client'
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Checkbox } from '@mantine/core';
import Notification from '@/components/Notification';



const Home = () => {

  let [status, setStatus] = useState('');

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { title: '', published: true, content: '' },

    // functions will be used to validate values at corresponding key
    validate: {
      title: (value) => (value.length < 2 ? 'Title must have at least 2 letters' : null),
      content: (value) => (value.length < 2 ? 'Content must have at least 2 letters' : null),
    },
  });


  const handleSubmit = async () => {

    const res = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.getValues()),
    });

    if (res.ok) {
      form.reset();
      setStatus('success');
      setTimeout(() => {
        setStatus('');
      }, 3000);
      console.log('Post created successfully');
    } else {
      setStatus('error');
      console.error('Error creating post');
    }
  };

  return (
    <>
      {status !== '' && <Notification type={status} />}
      <form onSubmit={form.onSubmit(() => handleSubmit())}>
        <TextInput
          label="Title"
          placeholder="Title"
          key={form.key('title')}
          {...form.getInputProps('title')}
        />
        <TextInput
          label="Content"
          placeholder="Content"
          key={form.key('content')}
          {...form.getInputProps('content')}
        />
        <Checkbox
          mt="md"
          label="Publish"
          key={form.key('published')}
          {...form.getInputProps('published', { type: 'checkbox' })}
        />

        <Button type="submit" mt="sm">
          Submit
        </Button>
      </form>


    </>
  );
};

export default Home;