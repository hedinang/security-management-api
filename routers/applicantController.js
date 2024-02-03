const express = require('express');
const multer = require('multer')
const applicantService = require('../service/applicantService')
const router = express.Router();
const storage = multer.memoryStorage()

// const upload = multer({ dest: "upload/" })
const upload = multer({
    storage: storage,
    limits: { fieldSize: 100 * 1024 * 1024, files: 1 }
})

router.post('/list', async function (req, res) {
    let result = await applicantService.list(req.body);
    res.send(result)
})

router.get('/:applicantId', async function (req, res) {
    let result = await applicantService.get(req.params.applicantId);
    res.send(result)
})

router.post('/add', upload.single('file'), async function (req, res) {
    let result = await applicantService.add(req.body, req.file);
    res.send(result)
})

router.put('/update', upload.single('file'), async function (req, res) {
    let result = await applicantService.update(req.body, req.file);
    res.send(result)
})

router.delete('/:applicantId', async function (req, res) {
    let result = await applicantService.removeById(req.params.userId);
    res.send(result)
})

router.post('/delete', async function (req, res) {
    let result = await applicantService.remove(req.body);
    res.send(result)
})

module.exports = router
