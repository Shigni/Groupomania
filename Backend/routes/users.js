// Importation du module express 
const express = require('express');
// Importation du module router
const router = express.Router();

// Importation du controller user
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const checkPassword = require('../middleware/validator');


// Route création d'un utilisateur
router.post('/signup', checkPassword, userCtrl.signup);
// Route connexion d'un utilisateur
router.post('/login', userCtrl.login);
// Route modification d'un utilisateur
router.put('/user-profile/:user_id', auth, multer, userCtrl.update);
// Route supression d'un utilisateur
router.delete('/user-profile/:user_id', auth, multer, userCtrl.delete);
// Route récupération d'un utilisateur
router.get('/user-profile/:user_id', auth, multer, userCtrl.getUser);
// Route de modification du mot de passe
router.put('/user-profile/:user_id/password', checkPassword, auth, multer, userCtrl.updatePassword);

module.exports = router;
