// Importation des models
const Post = require('../models/post');
const User = require('../models/User');
const Comment = require('../models/comment');
const user = require('./user')
// Importation du module fs 
const fs = require('fs');

// hasMany
User.hasMany(Post, { foreignKey: 'user_id', onDelete: 'cascade', hooks: true });
Post.belongsTo(User, { foreignKey: 'user_id' });

// Créer une media
exports.createPostMedia = (req, res, next) => {
    
    const postObject = JSON.parse(req.body.post);
    
    postObject.likes = 0;
    postObject.dislikes = 0;
   
    const post = new Post({
        ...postObject,
        mediaUrl: `${req.protocol}://${req.get('host')}/images/medias/${req.file.filename}`
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Post publié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Créer un message
exports.createPostMessage = (req, res, next) => {
    
    const postObject = req.body;
    
    postObject.likes = 0;
    postObject.dislikes = 0;

    const post = new Post({
        ...postObject
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Message publié !' }))
        .catch(error => res.status(400).json({ error }));
};



// Supprimer un media
exports.deletePost = (req, res, next) => {
    
    Post.findOne({ where: { post_id: req.params.post_id } })
        .then(post => {
            const media = post.mediaUrl;
            if (post.mediaUrl) {
                
                const filename = post.mediaUrl.split('/images/medias/')[1];
                fs.unlink(`images/medias/${filename}`, () => {
                    
                    Post.destroy({ where: { post_id: req.params.post_id } })
                        .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
            else {
                Post.destroy({ where: { post_id: req.params.post_id } })
                    .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'un post
exports.getPost = (req, res, next) => {
    Post.findOne({
        include: { all: true, nested: true }, where: { post_id: req.params.post_id }, order: [
            [Comment, 'comment_id', 'DESC']
        ]
    })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de tous les posts
exports.getPosts = (req, res, next) => {
    Post.findAll({
        include: { all: true, nested: true }, order: [
            ['post_id', 'DESC']
        ]
    })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};


