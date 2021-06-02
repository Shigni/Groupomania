// Include Sequelize module.
const Sequelize = require('sequelize')

// Import sequelize object, 
// Database connection pool managed by Sequelize.
const sequelize = require('../utils/database')


// Define method takes two arrguments
// 1st - name of table
// 2nd - columns inside the table
const Like = sequelize.define('like', {

    // Column-1, like_id is an object with 
    // properties like type, keys, 
    // validation of column.
    like_id: {

        // Sequelize module has INTEGER Data_Type.
        type: Sequelize.INTEGER,

        // To increment like_id automatically.
        autoIncrement: true,

        // like_id can not be null.
        allowNull: false,

        // For uniquely identify user.
        primaryKey: true
    }
})

// Exporting Like, using this constant
// we can perform CRUD operations on
// 'like' table.
module.exports = Like;