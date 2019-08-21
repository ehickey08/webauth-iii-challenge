const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('../users/usersModel');
const { checkUserAtReg, checkUserAtLogin } = require('../middleware');
const router = express.Router();

router.post('/register', checkUserAtReg, async ( req, res, next) => {
    try {
        let user = req.body;
        const hash = bcrypt.hashSync(user.password, 12);
        user.password = hash;
        const newUser = await Users.add(user);
        res.status(201).json(newUser);
    } catch (err) {
        next({ err, stat: 500, message: 'Could not register user.' });
    }
});

router.post('/login', checkUserAtLogin, (req, res, next) => {
    const { username, password } = req.body;
    Users.findByUsername(username)
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                req.session.username = username;
                res.status(200).json({message: `Welcome ${user.username}!` });
            }
            else 
                next({stat: 401, message: 'Invalid credentials'})
        })
        .catch(err => {
            next({ err, stat: 500, message: 'Error during login.' });
        });
});

router.get('/logout', (req, res) => {
    if(req.session.username){
        req.session.destroy(err => {
            if(err)
                res.status(400).json({You: 'could not be logged out!' });
            else
                res.status(200).json({You:'were logged out!' });
        })
    } else{
        res.status(400).json({You:'were never logged in!' });
    }
})
module.exports = router;
