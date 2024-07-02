
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sign } from "@/app/utils/auth";

// Dummy user data (in a real application, fetch from a database)
const users = [
  {
    id: 1,
    username: 'user1',
    password: '$2b$10$tb7PcnfJ.jAht2QMO61NNOvbzX3WsyEc/Y32OokL2FlY5BPpOr8cS' // bcrypt hash for 'password'
  }
];

//const secret = 'YourSecretKey'; // Replace with your secret key

// const saltRounds = 10;
// const myPlaintextPassword = '123';

// bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
//     console.log('hassssssh', hash);
//     users[0].password = hash;
// });



export async function POST(request: Request) {
    const res = await request.json()
    console.log('resss', res);
    const { username, password } = res;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return new Response("error: Invalid username", {
        status: 401,
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
      return new Response("error: Invalid password", {
        status: 401,
      })
    }

    // Create token
    // const token = jwt.sign(
    //   users[0],
    //   secret,
    //   { algorithm: 'HS256', expiresIn: '1h' } // Token expires in 1 hour
    // );
    const token = await sign({username: users[0].username});
    console.log('crente', token);
    

    if(token){
      return new Response("{'message': 'Sucess!'}", {
          status: 200,
          headers: { 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600;` },
      })
    }


    // Return token
    // return new Response('Success!', {
    //   status: 200,
    // })

   

}
