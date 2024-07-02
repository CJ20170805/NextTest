'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import './home.scss'

const Home = () => {
  const router = useRouter()


  const [list, setList] = useState([
    {
      id: 1,
      title: 'Title',
      content: 'Content',
      time: '2022-12-12',
    },
    {
      id: 2,
      title: 'Title2',
      content: 'Content2',
      time: '2022-12-12',
    },
    {
      id: 3,
      title: 'Title3',
      content: 'Content3',
      time: '2022-12-12',
    },
  ])



  useEffect(() => {
    console.log('hahaha');
    async function getList() {
      let res = await fetch('/api/post');
      let data = await res.json();
      setList(data.posts.filter((item:any) => item.published));
  
      console.log('hhh', data);
    }
    getList();
  }, [])


  const viewDetails = (item: any) => {
    router.push('/dashboard/home/detail/' + item.id);
    console.log(item)
  }

  return (
    <div className='home-page'>
      <div className="blog-list">
        {list && list.map((item, index) => (
          <div className="blog-item" key={index}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src='/images/bg.png'
                  height={160}
                  alt="Norway"
                />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{item.title}</Text>
                <Badge color="pink">New</Badge>
              </Group>

              <Text size="sm" c="dimmed">
                {item.content}
              </Text>

              <Button color="blue" onClick={() => { viewDetails(item) }} fullWidth mt="md" radius="md">
                View details
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;