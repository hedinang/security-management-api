const express = require('express');
const multer = require('multer')
const requirementService = require('../service/requirementService')
const router = express.Router();
const storage = multer.memoryStorage()

// const upload = multer({ dest: "upload/" })
const upload = multer({
    storage: storage,
    limits: { fieldSize: 100 * 1024 * 1024, files: 1 }
})

router.post('/list', async function (req, res) {
    let result = await requirementService.list(req.body);
    res.send(result)
})

router.get('/:requirementId', async function (req, res) {
    let result = await requirementService.get(req.params.requirementId);
    res.send(result)
})

router.post('/add', async function (req, res) {
    let result = await requirementService.add(req.body);
    res.send(result)
})

router.put('/update', upload.single('file'), async function (req, res) {
    let result = await requirementService.update(req.body, req.file);
    res.send(result)
})

router.delete('/:requirementId', async function (req, res) {
    let result = await requirementService.removeById(req.params.userId);
    res.send(result)
})

router.post('/delete', async function (req, res) {
    let result = await requirementService.remove(req.body);
    res.send(result)
})

module.exports = router
