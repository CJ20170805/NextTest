import { prisma } from '@/app/db/prisma';
import { type NextRequest } from 'next/server'

console.log('?????');


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id');
  console.log('iDDDDD', id);
  
  if(id){
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id)
      }
    });
    return Response.json({ post })
  }else{
    const posts = await prisma.post.findMany();
    return Response.json({ posts })
  }


}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id');
  console.log('iDDDDD', id);
  try {
    await prisma.post.delete({
      where: {
        id: Number(id)
      }
    });
    return Response.json({ message: 'Post deleted successfully' })
  } catch (error) {
    return Response.json({ error: 'Error deleting post' })
  }
}

export async function POST(request: Request) {
  const res = await request.json()
  console.log('resss', res);
  const { title, content, published } = res;

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        published, 
        authorId: 1,
      },
    });
    return new Response('Success!', {
      status: 200,
    })
  } catch (error) {
    return new Response(`error: ${error}`, {
      status: 500,
    })
  }
  // return Response.json({ res })
}

export async function PUT(request: NextRequest) {
  const res = await request.json()
  const { id, title, content, published } = res;
  try {
    await prisma.post.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        content,
        published,
      },
    });
    return Response.json({ message: 'Post updated successfully' })
  } catch (error) {
    return Response.json({ error: 'Error updating post' })
  }
}

// import { prisma } from '@/app/db/prisma';

// export default async function handle(req: NextApiRequest, res: NextApiResponse) {
//   const { title, content, authorEmail } = req.body;

//   try {
//     const result = await prisma.post.create({
//       data: {
//         title,
//         content,
//         published: false,
//         author: { connect: { email: authorEmail } },
//       },
//     });
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating post' });
//   }
// }