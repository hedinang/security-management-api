const express = require('express');
const multer = require('multer')
const serviceService = require('../service/serviceService')
const router = express.Router();
const storage = multer.memoryStorage()

// const upload = multer({ dest: "upload/" })
const upload = multer({
    storage: storage,
    limits: { fieldSize: 100 * 1024 * 1024, files: 1 }
})

router.post('/list', async function (req, res) {
    let result = await serviceService.list(req.body);
    res.send(result)
})

router.get('/:serviceId', async function (req, res) {
    let result = await serviceService.get(req.params.serviceId);
    res.send(result)
})

router.post('/add', async function (req, res) {
    let result = await serviceService.add(req.body);
    res.send(result)
})

router.put('/update', upload.single('file'), async function (req, res) {
    let result = await serviceService.update(req.body, req.file);
    res.send(result)
})

router.delete('/:serviceId', async function (req, res) {
    let result = await serviceService.removeById(req.params.userId);
    res.send(result)
})

router.post('/delete', async function (req, res) {
    let result = await serviceService.remove(req.body);
    res.send(result)
})

module.exports = router
