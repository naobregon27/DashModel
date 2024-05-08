const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const Gallery = require("../models/Gallery");



// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    console.log("FILENAME", file);
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/api/images/upload", upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No se ha enviado ningún archivo." });


  console.log(req.file)

  const urlImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const savedImage = new Gallery({
    url: urlImage,
    title: req.body.title,
  });

  try {
    await savedImage.save();
    res.json(savedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocurrió un error al guardar la imagen");
  }
});

router.get("/api/images", async (req, res) => {
  const images = await Gallery.findAll();

  console.log(images);
  res.send(images)
})

router.get("/api/images/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID no válido' });
      return;
    }
    const images = await Gallery.findByPk(id);
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Se produjo un error' });
  }
});

router.delete("/api/images/:id", async (req, res) => {
  const image = await Gallery.findByPk(req.params.id);

  if (image) {
    const deletedImage = { ...image.dataValues }; // Guarda la información de la imagen
    await image.destroy();
    console.log('La imagen se eliminó correctamente');
    res.status(200).json(deletedImage);
  } else {
    res.status(404).json({ error: "Imagen no encontrada" });
  }
});

module.exports = router;
