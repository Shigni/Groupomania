// Include Sequelize module.
const Sequelize = require('sequelize')
  
// Import sequelize object, 
// Database connection pool managed by Sequelize.
const sequelize = require('../utils/database')

const defaultProfile = ('http://localhost:3000/images/default.png');
  
// Define method takes two arrguments
// 1st - name of table
// 2nd - columns inside the table
const User = sequelize.define('user', {
  
    // Column-1, user_id is an object with 
    // properties like type, keys, 
    // validation of column.
    user_id:{
  
        // Sequelize module has INTEGER Data_Type.
        type:Sequelize.INTEGER,
  
        // To increment user_id automatically.
        autoIncrement:true,
  
        // user_id can not be null.
        allowNull:false,
  
        // For uniquely identify user.
        primaryKey:true
    },
  
    // Column-2, name
    firstname: { type: Sequelize.STRING, allowNull:false },
    lastname: { type: Sequelize.STRING, allowNull:false },
    imageUrl: { type: Sequelize.STRING, defaultValue: defaultProfile },
  
    // Column-3, email
    email: { type: Sequelize.STRING, allowNull:false, unique: true },
    password: { type: Sequelize.STRING, allowNull:false },
    admin: { type : Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    // Column-4, default values for
    // dates => current time
    myDate: { type: Sequelize.DATE, 
            defaultValue: Sequelize.NOW },
  
     // Timestamps
     createdAt: Sequelize.DATE,
     updatedAt: Sequelize.DATE,
})
  
// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.
module.exports = User;