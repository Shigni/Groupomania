// Include Sequelize module.
const Sequelize = require('sequelize')

// Import sequelize object, 
// Database connection pool managed by Sequelize.
const sequelize = require('../utils/database')

// Define method takes two arrguments
// 1st - name of table
// 2nd - columns inside the table
const PostMedia = sequelize.define('postMedia', {

    // Column-1, user_id is an object with 
    // properties like type, keys, 
    // validation of column.
    media_id: {

        // Sequelize module has INTEGER Data_Type.
        type: Sequelize.INTEGER,

        // To increment user_id automatically.
        autoIncrement: true,

        // user_id can not be null.
        allowNull: false,

        // For uniquely identify user.
        primaryKey: true
    },

    // Column-2, name
    title: { type: Sequelize.STRING, allowNull: false },
    mediaUrl: { type: Sequelize.STRING, allowNull: false },
    myDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    likes: { type: Sequelize.INTEGER, required: true },
    dislikes: { type: Sequelize.INTEGER, required: true },
    usersLiked: { type: Sequelize.STRING, required: true },
    usersDisliked: { type: Sequelize.STRING, required: true },

    // Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
})

// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.
module.exports = PostMedia;