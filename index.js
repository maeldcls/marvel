const express = require("express");
const mustacheExpress = require("mustache-express");
const app = express();


/**
 * Configuration de mustache
 * comme moteur de template
 * pour l'extension .mustache
 */
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

/**
 * Configuration de express
 * pour récupérer les données d'un formulaire
 * et pour servir les fichiers statiques
 * (css, js, images, etc.)
 */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Routes à ajouter ici


app.get("/", (req, res) => {
  res.render("index", { pageTitle: "Accueil" });
});

const personnagesRouter = require('./routes/personnages')
app.use('/personnages', personnagesRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

