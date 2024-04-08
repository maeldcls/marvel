const express = require('express');
const router = express.Router();
const multer  = require('multer')

const connection = require('../database');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  // Récupérer les données à partir de la base de données
  connection.query('SELECT * FROM personnages', (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la récupération des personnages : ', error);
      res.status(500).send('Erreur lors de la récupération des personnages');
      return;
    }

    res.render('personnages', { pageTitle: 'Liste des personnages', personnages: results });
  });
});

router.get('/create', (req,res)=>{
  res.render('create', { pageTitle: 'Créer un personnage'})
})

router.post('/create', (req, res) => {
  const { name, description } = req.body;
  console.log(req.body)

   //res.send(`Nom: ${name}, Description: ${description}`);
});

router.get('/testformulaire', (req, res) => {
  res.render('testformulaire')
});

router.post('/testtraitement', (req, res) => {
  console.log(req.body)
});


// router.get('/:id', (req, res) => {
//   // Récupérer la valeur de l'ID à partir des paramètres de l'URL
//   const id = req.params.id;

//   // Envoyer la valeur de l'ID en réponse
//   res.send(`ID: ${id}`);
// });


module.exports = router;
