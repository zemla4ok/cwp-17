const express = require('express');
const multer  = require('multer');
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express();

app.post('/upload', upload.single('file'), (req, res, next) => {
  res.json({ succeed: true });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));