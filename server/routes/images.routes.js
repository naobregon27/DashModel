const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const Gallery = require("../models/Gallery");

// Función para generar slugs
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta para cargar imágenes con slugs
router.post("/api/images/upload", upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No se ha enviado ningún archivo." });

  const slug = slugify(req.body.title);
  const urlImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const savedImage = new Gallery({
    url: urlImage,
    title: req.body.title,
    slug: slug,
    medidas: req.body.medidas,
  });

  try {
    await savedImage.save();
    res.json(savedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocurrió un error al guardar la imagen");
  }
});

// Ruta para obtener todas las imágenes
router.get("/api/images", async (req, res) => {
  const images = await Gallery.findAll();
  res.send(images);
});

// Ruta para obtener una imagen por slug
router.get("/api/images/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const image = await Gallery.findOne({ where: { slug: slug } });
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ error: "Imagen no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Se produjo un error' });
  }
});

// Ruta para eliminar una imagen por slug
router.delete("/api/images/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const image = await Gallery.findOne({ where: { slug: slug } });
    if (image) {
      await image.destroy();
      res.status(200).json({ message: 'La imagen se eliminó correctamente', image: image });
    } else {
      res.status(404).json({ error: "Imagen no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Se produjo un error' });
  }
});

module.exports = router;
