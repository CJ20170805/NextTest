'use strict';

const Hapi = require('@hapi/hapi');
const { log } = require('console');
const hapiAuthJWT = require('hapi-auth-jwt2');
const JWT = require('jsonwebtoken');

const Joi = require('joi');
const bcrypt = require('bcrypt');

const port = process.env.PORT || 3003; // allow port to be set
const secret = 'NeverShareYourSecret'; // Never Share This! even in private GitHub repos!

let users = [
    {
        id: 1,
        username: 'user1',
        password: '' // bcrypt hash for 'password'
    }
];


const saltRounds = 10;
const myPlaintextPassword = '123';

bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    console.log('hassssssh', hash);
    users[0].password = hash;
});


// bring your own validation function
const validate = async function (decoded, request, h) {
    console.log(" - - - - - - - decoded token:");
    console.log(decoded);
    console.log(" - - - - - - - request info:");
    //   console.log(request.info);
    console.log(request.auth.token);
    console.log(" - - - - - - - user agent:");
    console.log(request.headers['user-agent']);

    const user = users.find(u => u.id === decoded.id);
    if (user) {
        return { isValid: true, credentials: { user } };
    }
    return { isValid: false }

};

const validateUser = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        return user;
    }
    return null;
};

const init = async () => {
    const server = new Hapi.server({ port: port });
    await server.register(hapiAuthJWT);
    // see: https://hapi.dev/api/#-serverauthschemename-scheme
    server.auth.strategy('jwt', 'jwt',
        {
            key: secret,
            validate,
            verifyOptions: { ignoreExpiration: true }
        });

    server.auth.default('jwt');

    server.route([
        {
            method: "GET", path: "/", config: { auth: false },
            handler: function (request, h) {
                return { text: 'Token not required' };
            }
        },
        {
            method: 'GET', path: '/restricted', config: { auth: 'jwt' },
            handler: function (request, h) {
                const response = h.response({ message: 'You used a Valid JWT Token to access /restricted endpoint!' });
                response.header("Authorization", request.headers.authorization);
                return response;
            }
        },
        {
            method: 'POST',
            path: '/login',
            options: {
                auth: false,
                validate: {
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request, h) => {
                const { username, password } = request.payload;
                const user = await validateUser(username, password);

                if (!user) {
                    return h.response({ message: 'Invalid username or password' }).code(401);
                }

                const token = JWT.sign(users[0], secret);

                console.log(token);

                return { username, token };
            }
        }
    ]);
    await server.start();
    return server;


};

init().then(server => {
    console.log('Server running at:', server.info.uri);
}).catch(err => {
    console.log(err);
});
