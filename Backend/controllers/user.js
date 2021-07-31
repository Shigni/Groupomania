// Importation du module bcrypt (cryptage du mot de passe)
const bcrypt = require('bcrypt');
// Importation du modèle de création d'utilisateur
const User = require('../models/User');
// Importation du module JWT (token unique par utilisateur)
const jwt = require('jsonwebtoken');

const fs = require('fs');
const multer = require('../middleware/multer-config');


// Création d'un utilisateur
exports.signup = (req, res, next) => {
  
  bcrypt.hash(req.body.password, 10)
    .then(hash => {

      const user = new User({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
};

// Connexion d'un utilisateur  
exports.login = (req, res, next) => {
 
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
         
          res.status(200).json({
            user_id: user.user_id,
            token: jwt.sign(
              { user_id: user.user_id },
              process.env.JWT,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Get one
exports.getUser = (req, res, next) => {
  User.findOne({
    where: { user_id: req.params.user_id },
  }).then(user =>
    res.status(200).json(user))
    .catch(error => res.status(400).json({ error }));
};

// Update
exports.update = (req, res, next) => {
 
  let file = req.file;
  User.findOne({
    where: { user_id: req.params.user_id },
  })
    .then(user => {
          const filename = user.imageUrl.split('/images/')[1];
          const defaultFile = user.imageUrl;
          const defaultImage = 'http://localhost:3000/images/default.png';
          if (defaultFile == defaultImage) {
            const values = req.file ?
            {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {
              firstname: req.body.firstname,
              lastname: req.body.lastname,      
              email: req.body.email,
            };
          var condition = { where: { user_id: req.params.user_id } }
          var options = { multi: true };

          User.update(values, condition, options)
          }
          else if (file && filename != file.filename) {
            fs.unlink(`images/${filename}`, () => {
            })
          }
        
          const values = req.file ?
            {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
            };
          var condition = { where: { user_id: req.params.user_id } }
          var options = { multi: true };

          User.update(values, condition, options)
        })
        .catch(error => res.status(400).json({ error }))

        .then(response => {
          let user = User.findOne({ where: { user_id: req.params.user_id } })
            .then(user => res.status(200).json((user)))
        })
        .catch(error => res.status(400).json({ error }))
    .catch(error => res.status(400).json({ error }))
};

// Supprimer un utilisateur
exports.delete = (req, res, next) => {
  
  User.findOne({ where: { user_id: req.params.user_id } })
    .then(user => {
  
      const filename = user.imageUrl.split('/images/')[1];
      const defaultFile = user.imageUrl;
      const defaultDelImage = 'http://localhost:3000/images/default.png';
      if (defaultFile != defaultDelImage) {
        fs.unlink(`images/${filename}`, () => {
        })
      }
    })
 
  User.destroy({ where: { user_id: req.params.user_id } })
    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.updatePassword = (req, res, next) => {
  const user_id = res.locals.userId;

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      let file = req.file;
    
      User.findOne({
        where: { user_id: user_id },
      })
        .then(user => {
         
          if (user_id != req.params.user_id) {
            res.status(403).json({ "error": "Accès interdit" });
            return;
          }
         
          const values = req.file ?
            {
              password: hash,
            } : {
              password: hash,
            };
          var condition = { where: { user_id: req.params.user_id } }
          var options = { multi: true };
        
          User.update(values, condition, options)
        })
        .catch(error => res.status(400).json({ error }))

        .then(response => {
          let user = User.findOne({ where: { user_id: req.params.user_id } })
            .then(user => res.status(200).json((user)))
        })
        .catch(error => res.status(400).json({ error }))
        .catch(error => res.status(400).json({ error }))
    });
}

