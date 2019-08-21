const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('./users/usersRouter');
const authRouter = require('./auth/authRouter');
const knexConnection = require('../data/dbConfig')

const server = express();

const store = new KnexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 30
})

const sessionOptions = {
    name: 'session',
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET || 'secretString',
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false,
    },
    store: store
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));
server.use('/auth', authRouter);
server.use('/users', usersRouter);

server.use(errorHandler);

function errorHandler(error, req, res, next) {
    console.log(error.err || '');
    res.status(error.stat || 500).json({
        error: error.message || 'Internal server error.',
    });
}

server.get('/', (req, res, next) => {
    res.send('Server is working!');
});

module.exports = server;
