// 'use client'

import { prisma } from '@/app/db/prisma';
//import { useEffect, useState } from "react";

export default async function Page({ params }: { params: { id: string } }) {

    // let [post, setPost] = useState();

    // useEffect(() => {
    //     async function fetchData() {
    //         const res = await fetch('/api/post?id=' + params.id);
    //         const data = await res.json();
    //         setPost(data.post);
    //         console.log(data);
    //     }
    //     fetchData();
    // }, [])

    let post = null;

    const res = await prisma.post.findUnique({
      where: {
        id: Number(params.id)
      }
    });

    console.log('ressss', res);
    

    post = res;


  return (
    <>
      {post ? (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}