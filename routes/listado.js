const express = require("express")
const router = express.Router()
const products = require("../models/products");
const cloudinary = require("cloudinary").v2;
const util = require("util");
//con util "promisificamos" el método de subida de archivos, como hicimos con pool.query
//en definitiva, cloudinary también es una base de datos... en la nube
const upload = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

// controlador que trae los datos de la DB, de Cloudinary y los pasa a la vista "listado"
router.get("/", async(req, res) => {
    const rows = await products.getProducts();
    const data = rows.map((item) => {
        const imageURL = cloudinary.url(item.image, {
            width: 100,
            height: 100,
            crop: "fill"
        });
        return {...item, imageURL }
    })
    res.render("listado", { data })

})


// controlador para borrar un registro por id
router.get("/delete/:id", async(req, res) => {
    //voy a la base de datos con el id, y obtengo de ese registro el campo image, que contiene
    //el public_id de la imagen almacenada en Cloudinary
    const row = await products.getProductById(req.params.id)
    await destroy(row[0].image);
    await products.deleteProduct(req.params.id)
    res.redirect("/listado");
})

//mostramos la vista del formulario para agregar productos
router.get("/addItem", (req, res) => {
    res.render("addItem")
});

//recibimos del formulario de agregar productos los datos en la request
router.post("/addItem", async(req, res) => {
    //capturamos el archivo de imagen a Cloudinary y obtenemos la URL
    const imageFile = req.files.imageFile;
    const img_id = (await upload(imageFile.tempFilePath)).public_id

    await products.addProduct({...req.body, image: img_id });
    res.redirect("/listado")
})

router.get("/editItem/:id", async(req, res) => {
    const row = await products.getProductById(req.params.id)
    const product = {
        id: row[0].id,
        name: row[0].name,
        origin: row[0].origin,
        description: row[0].description,
        intensity: row[0].intensity,
        price: row[0].price,
        presentation: row[0].presentation,
        image: row[0].image,
    };
    res.render("editItem", { product })
})

router.post("/editItem", async(req, res) => {
    let img_id = null;
    if (!req.files) {
        img_id = req.body.prevImage
    } else {
        await destroy(req.body.prevImage)
        const imageFile = req.files.imageFile
        img_id = (await upload(imageFile.tempFilePath)).public_id;
    }
    const data = {
        id: req.body.id,
        name: req.body.name,
        origin: req.body.origin,
        description: req.body.origin,
        intensity: req.body.intensity,
        price: req.body.price,
        presentation: req.body.presentation,
        image: img_id,
    };
    await products.modifyProduct(data, data.id)
    res.redirect("/listado");


})

module.exports = router