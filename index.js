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




app.listen(3000, '127.0.0.1', () => console.log('Example app listening on port 3000!'));