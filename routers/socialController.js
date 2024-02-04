const express = require('express');
const socialService = require('../service/socialService.js')
const router = express.Router();

router.get('/list', async function (req, res) {
    let result = await socialService.getList();
    res.send(result)
})


router.put('/update', async function (req, res) {
    let result = await socialService.update(req.body);
    res.send(result)
})


module.exports = router
