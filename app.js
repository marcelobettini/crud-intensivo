const express = require("express")
const path = require("path")
const hbs = require("express-handlebars")
const fileupload = require("express-fileupload")
require("dotenv").config()
const pool = require("./db")
const PORT = process.env.PORT || 3000

//importamos las rutas del router factory
const listadoRouter = require("./routes/listado")

const app = express()

//Express-Handlebars
app.engine(".hbs", hbs.engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"))

//habilitamos la lectura de datos desde un formulario
app.use(express.urlencoded({ extended: false }))
    //config del middleware Express-FileUpload 
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))

app.use("/listado", listadoRouter)


app.listen(PORT, (err) => {
    err ? console.log("Se pudrió todo") : console.log(`Servidor corriendo en http://localhost:${PORT}/listado`)
})