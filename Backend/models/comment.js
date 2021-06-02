// Include Sequelize module.
const Sequelize = require('sequelize')
  
// Import sequelize object, 
// Database connection pool managed by Sequelize.
const sequelize = require('../utils/database')

  
// Define method takes two arrguments
// 1st - name of table
// 2nd - columns inside the table
const Comment = sequelize.define('comment', {
  
    // Column-1, comment_id is an object with 
    // properties like type, keys, 
    // validation of column.
    comment_id:{
  
        // Sequelize module has INTEGER Data_Type.
        type:Sequelize.INTEGER,
  
        // To increment comment_id automatically.
        autoIncrement:true,
  
        // comment_id can not be null.
        allowNull:false,
  
        // For uniquely identify comment.
        primaryKey:true
    },
  
    // Column-2, content
    commentContent: {type: Sequelize.STRING, allowNull: false}, 
      
    // dates => current time
    myDate: { type: Sequelize.DATE, 
            defaultValue: Sequelize.NOW },
  
     // Timestamps
     createdAt: Sequelize.DATE,
})
  
// Exporting Comment, using this constant
// we can perform CRUD operations on
// 'comment' table.
module.exports = Comment;