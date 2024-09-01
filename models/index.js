// models/index.js
const sequelize = require('../config/db');
const Estrategia = require('./Estrategia');
const ParMoeda = require('./ParMoeda');
// const User = require('./User');
// const Post = require('./Post');
// const Project = require('./Project');

// Defina associações (1:N)
// User.hasMany(Post);
// Post.belongsTo(User);
// User.belongsToMany(Project, { through: 'UserProjects' });
// Project.belongsToMany(User, { through: 'UserProjects' });

ParMoeda.belongsToMany(Estrategia, { through: 'EstrategiaParMoeda' });
Estrategia.belongsToMany(ParMoeda, { through: 'EstrategiaParMoeda' });

const models = { ParMoeda, Estrategia };

// const models = { User, Post, Project };

module.exports = { ...models, sequelize };
