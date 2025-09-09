var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
// const uid2 = require('uid2'); // JWT ici
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const { checkBody } = require('../modules/checkbody');

/* GET TEST users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//GET ALL USERS
router.get("/allUsers", (req, res) => {
  User.find().then(data => {
    res.json(data);
    console.log("route get all users", data);
  })
})


//// ROUTE POST REGISTER : route pour créer un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    // Vérifie les champs requis
    if (!checkBody(req.body, ['username', 'email', 'password'])) {
      return res.status(400).json({ result: false, error: 'Champs manquants ou vides' });
    }

    // Vérifie le format de l'email avec une regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ result: false, error: 'Email invalide.' });
    }

    // Vérifie que le mot de passe a une longueur suffisante
    if (req.body.password.length < 6) {
      return res.status(400).json({ result: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    // Vérifie si l'email existe déjà
    const existingMail = await User.findOne({ email: req.body.email });
    if (existingMail) {
      return res.status(409).json({ result: false, error: 'Email déjà utilisé.' });
    }

    // Vérifie si le username existe déjà
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
      return res.status(409).json({ result: false, error: 'Username déjà utilisé.' });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Création de l'utilisateur
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      times: [],
    });

    // Sauvegarde en base de données
    const savedUser = await newUser.save();

    // Génération du token JWT
    const token = jwt.sign(
      { userId: savedUser._id }, // Payload du token
      process.env.JWT_SECRET,    // Clé secrète du .env
      { expiresIn: '2h' }        // Expire dans 2h
    );

    // Envoi d'une réponse de succès
    res.status(201).json({
      result: true,
      message: 'Inscription réussie',
      token,
      userId: savedUser._id,
    });

  } catch (error) {
    console.error('Erreur register :', error);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});

//// ROUTE POST LOGIN : route pour connecter un utilisateur
router.post('/login', async (req, res) => {
  try {
    if (!checkBody(req.body, ['email', 'password'])) {
      return res.status(400).json({ result: false, error: 'Champs manquants ou vides' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ result: false, error: 'Email incorrect ou utilisateur introuvable' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ result: false, error: 'Mot de passe incorrect' });
    }

    // Génération d’un nouveau token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      result: true,
      message: 'Connexion réussie',
      token,
      userId: user._id,
      username: user.username,
    });

  } catch (error) {
    console.error('Erreur login :', error);
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  }
});


// // -- ROUTE POST REGISTER : route pour créer un nouvel utilisateur : méthode avec uid2 --
// router.post('/register', (req, res) => {
//   if (!checkBody(req.body, ['username', 'lastname', 'email', 'password'])) {
//     return res.status(400).json({ result: false, error: 'Champs manquants ou vides' });
//   }

//   // Vérifie si l'email existe déjà
//   User.findOne({ email: req.body.email })
//     .then(data => {
//       if (data) {
//         return res.status(409).json({ result: false, error: 'Email déjà utilisé' });
//       }

//       const newUser = new User({
//         username: req.body.username,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password, 10),
//         token: uid2(32),
//       });

//       newUser.save().then(user => {
//         res.json({ result: true, token: user.token });
//       });
//     })
//     .catch(err => {
//       console.error("Erreur MongoDB :", err); // 👈 pour afficher l’erreur précise
//       res.status(500).json({ result: false, error: 'Erreur serveur' });
//     });
// });


//// ROUTE POST LOGIN : route pour connecter un utilisateur : méthode avec uid2 --
// router.post('/login', (req, res) => {
//   if (!checkBody(req.body, ['email', 'password'])) {
//     return res.status(400).json({ result: false, error: 'Champs manquants' });
//   }
//   User.findOne({ email: req.body.email })
//     .then(user => {
//       if (!user) {
//         return res.status(401).json({ result: false, error: 'Email inconnu' });
//       }
//       if (bcrypt.compareSync(req.body.password, user.password)) {
//         res.json({ result: true, token: user.token });
//       } else {
//         res.status(401).json({ result: false, error: 'Mot de passe incorrect' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ result: false, error: 'Erreur serveur' });
//     });
// });


module.exports = router;
