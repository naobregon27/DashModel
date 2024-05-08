const express = require('express');
//import fileUpload from "express-fileupload";
//const multer = require('multer')

const indexRoutes = require('./routes/index.routes');
const imagesRoutes = require('./routes/images.routes');

require('./db.js');
const cors= require("cors")


const app = express();
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permite todas las origenes
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Permite métodos específicos
    next();
  });


app.set("port", process.env.PORT || 4000);

/*app.use(fileUpload({
    tempFileDir: "/temp"
}))*/
app.use(indexRoutes);
app.use(imagesRoutes);

app.use('/uploads', express.static('uploads'));




app.listen(app.get("port"))
console.log("server conected on port: ", app.get("port"))