const express = require("express");
const multer = require("multer");
//const upload = multer({ dest: "public/img" });
const router = express.Router();

router.use(express.json());

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
  connection.query('SELECT * FROM equipes', (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la récupération des personnages : ', error);
      res.status(500).send('Erreur lors de la récupération des personnages');
      return;
    }

    res.render('create', { pageTitle: 'Créer un personnage',equipe: results})
  });
  
})

// Middleware de gestion des erreurs de Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('Erreur Multer :', error);
    res.status(500).send('Une erreur est survenue lors du téléversement du fichier.');
  } else {
    next(error);
  }
});

router.post('/create', upload.single("photo"), (req, res) => {
  let { name, description, equipe } = req.body;
  let fileName = ""; 
  
  if(req.file) {
    fileName = req.file.filename; 
    console.log(fileName);
  }

  if(!equipe){
    equipe=null;
  }

  connection.query('INSERT INTO personnages (nom,description,photo,equipe_id) VALUES (?,?,?,?)'
  , [name,description,fileName,equipe], (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la création d\'un personnage : ', error);
      return;
    }

    res.redirect('/personnages');
  });

});

router.post('/update', (req,res)=>{

})



router.get('/details/:id', (req, res) => {
  // Récupérer la valeur de l'ID à partir des paramètres de l'URL
  const id = req.params.id;

  connection.query(`SELECT * FROM personnages WHERE id = ${id}`, (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la récupération des personnages : ', error);
      res.status(500).send('Erreur lors de la récupération des personnages');
      return;
    }
  console.log(results);
    res.render('details', { pageTitle: 'Détails d\'un personnages', personnage: results[0] });
  });

});


module.exports = router;
