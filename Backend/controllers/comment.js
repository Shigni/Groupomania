// Importation des modèles
const Post = require('../models/post');
const User = require('../models/User');
const Comment = require('../models/comment');

// hasMany
User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'cascade', hooks: true });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Post.hasMany(Comment, { foreignKey: 'post_id', onDelete: 'cascade', hooks: true });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

exports.createComment = (req, res, next) => {
    const commentObject = req.body;
    const user_id = req.body.user_id;
    const post_id = req.params.post_id;
    const comment = new Comment({
        ...commentObject,
        user_id: user_id,
        post_id: post_id
    });
    comment.save()
        .then(() => res.status(201).json({ message: 'Commentaire publié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
    const user_id = res.locals.userId;
    const post_id = req.params.post_id;
    const comment_id = req.params.comment_id;
    var user = User.findOne({ where: { user_id: user_id } })
        .then(user => {
            var admin = user.admin;
            if (admin === true) {
                Comment.findOne({ where: { comment_id: comment_id } })
                    .then(comment => {
                        Comment.destroy({ where: { comment_id: comment_id } })
                            .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    })
            }
            else if (admin === false) {
                Comment.findOne({ where: { post_id: post_id, user_id: user_id, comment_id: comment_id } })
                    .then(comment => {
                        if (comment === null) {
                            res.status(403).json({ "error": "Accès interdit" });
                            return;
                        }                        Comment.destroy({ where: { comment_id: comment_id, post_id: post_id, user_id: user_id } })
                            .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                            .catch(error => res.status(400).json({ error }));

                    })
                    .catch(error => res.status(500).json({ error }));
            };
        })
};