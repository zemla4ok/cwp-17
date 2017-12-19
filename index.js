const express = require('express');
const multer  = require('multer');
const sharp = require('sharp');
const uuid = require('uuid/v4');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express();

app.get('/upload', upload.single('file'), (req, res, next) => {
    res.sendFile('form.html', {root: './public/'});
});

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.json({succeed: true});
});

//pdf
const pdfStorage = multer.diskStorage({
    destination: './uploads/pdf/',
    filename: function (req, file, cb) {
        cb(null, uuid() + ".pdf");
    }
});

const pdfUpload = multer({
    storage: pdfStorage,
    fileFilter: function fileFilter(req, file, cb) {
        file.originalname.toUpperCase().endsWith(".PDF") ? cb(null, true) : cb(null, false);
    }
});

app.get('/pdf', upload.single('file'), (req, res, next) => {
    res.sendFile('pdf.html', {root: './public/'});
});

app.post('/pdf', pdfUpload.array('files', 3), (req, res, next) => {
    let files = req.files;
    res.json({files: files.map((file) => file = file.filename)});
});

//images
const imageStorage = multer.diskStorage({
    destination: './uploads/images/',
    filename: function (req, file, cb) {
        cb(null, uuid() + "-master" + file.originalname.slice(-4));
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: function fileFilter(req, file, cb) {
        file.originalname.toUpperCase().endsWith(".JPG") || file.originalname.toUpperCase().endsWith(".PNG")
            ? cb(null, true) : cb(null, false);
    }
});

app.get('/images', function (req, res) {
    res.sendFile('image.html', {root: './public/'});
});

app.post('/images', imageUpload.single('image'), async (req, res, next) => {
    let regexp = /-master\.[^\.]+$/;
    let filenames = [
        req.file.filename.replace(regexp, "-preview" + req.file.filename.slice(-4)),
        req.file.filename.replace(regexp, "-thumbnail" + req.file.filename.slice(-4)),
        req.file.filename
    ];
    await sharp('./uploads/images/' + req.file.filename).resize(800, 600).toFile('./uploads/images/' + filenames[0]);
    await sharp('./uploads/images/' + req.file.filename).resize(300, 180).toFile('./uploads/images/' + filenames[1]);
    res.json(filenames);
});

app.listen(3000, '127.0.0.1', () => console.log('Example app listening on port 3000!'));