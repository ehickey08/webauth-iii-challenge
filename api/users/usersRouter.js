const express = require('express');
const { restricted } = require('../middleware');
const Users = require('./usersModel')

const router = express.Router()

router.use('/', restricted)

router.get('/', async (req, res, next) => {
    try{
        const users = await Users.getAll()
        res.status(200).json(users);
    }catch(err){
        next({err, stat: 500, message: 'Could not retrieve Users'})
    }
})

module.exports = router;