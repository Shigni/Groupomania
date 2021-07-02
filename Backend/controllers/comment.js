// Importation des models
const Post = require('../models/post');
const User = require('../models/User');
const user = require('./user');
const Like = require('../models/like');
const Comment = require('../models/comment');

// hasMany
Post.hasMany(Comment, { foreignKey: 'post_id', onDelete: 'cascade', hooks:true });
Comment.belongsTo(Post, { foreignKey: 'post_id' });
User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'cascade', hooks:true });
Comment.belongsTo(User, { foreignKey: 'user_id' });

exports.createComment = (req, res, next) => {
    // Récupération des informations du formulaire de création de commentaire
    const commentObject = req.body;
    const user_id = req.body.user_id;
    const post_id = req.params.post_id;
    // Création dans la base de donnée du commentaire
    const comment = new Comment({
        ...commentObject,
        user_id: user_id,
        post_id: post_id
    });
    comment.save()
        .then(() => res.status(201).json({ message: 'Commentaire publié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprimer un commentaire
exports.deleteComment = (req, res, next) => {
    // Recherche de la media grâce à son ID
    const user_id = res.locals.userId;
    const post_id = req.params.post_id;
    const comment_id = req.params.comment_id;
    Comment.findOne({ where: { post_id: post_id, user_id: user_id, comment_id: comment_id } })
        .then(comment => {
            console.log(comment)
                Comment.destroy({ where: { comment_id: comment_id, post_id: post_id, user_id: user_id } })
                        .then(() => res.status(200).json({ message: 'Commentaire supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
            })
        .catch(error => res.status(404).json({ error }));
};