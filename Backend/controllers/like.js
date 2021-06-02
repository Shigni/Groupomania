// Importation des models
const Post = require('../models/post');
const User = require('../models/User');
const user = require('./user');
const Like = require('../models/like');

// hasMany
User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });
Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

exports.likePost = (req, res, next) => {
    // Ajout des constantes necessaires
    const user_id = req.body.user_id;
    const req_like = req.body.like;
    const post_id = req.params.post_id;
    // Recherche dans la db si le like existe déjà 
    Like.findOne({ where: { post_id: post_id, user_id: user_id } })
        .then(like => {
            // Si il n'existe pas, en ajoute un
            if (null === like) {
                const post_like = new Like({
                    user_id: user_id,
                    post_id: post_id
                });
                post_like.save()
                    .then(() => res.status(201).json({ message: 'Like créé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            // Si il existe, le supprime
            else {
                Like.destroy({ where: { post_id: post_id, user_id: user_id } })
                    .then(() => res.status(200).json({ message: 'Like supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}
