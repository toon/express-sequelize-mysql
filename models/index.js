// models/index.js
const sequelize = require('../config/db');
const Estrategia = require('./Estrategia');
const ParMoeda = require('./ParMoeda');
const Ticker = require('./Ticker');
const Carteira = require('./Carteira');
const Operacao = require('./Operacao');
const TipoOperacao = require('./TipoOperacao');
const TipoProvento = require('./TipoProvento');
const Provento = require('./Provento');
const Dashboard = require('./Dashboard');
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

Carteira.belongsToMany(Ticker, { through: 'CarteiraTicker' });
Ticker.belongsToMany(Carteira, { through: 'CarteiraTicker' });

Operacao.belongsTo(TipoOperacao);
TipoOperacao.hasMany(Operacao)
Operacao.belongsTo(Ticker);
Ticker.hasMany(Operacao);
Operacao.belongsTo(Carteira);
Carteira.hasMany(Operacao);

Provento.belongsTo(TipoProvento);
TipoProvento.hasMany(Provento);
Provento.belongsTo(Carteira);
Carteira.hasMany(Provento);
Provento.belongsTo(Ticker);
Ticker.hasMany(Provento);

Dashboard.belongsTo(Carteira);
Carteira.hasMany(Dashboard);
Dashboard.belongsTo(Ticker);
Ticker.hasMany(Dashboard);

const models = { 
    ParMoeda, 
    Estrategia, 
    Ticker, 
    Carteira,
    Operacao,
    TipoOperacao,
    TipoProvento,
    Provento,
    Dashboard
 };

// const models = { User, Post, Project };

module.exports = { ...models, sequelize };
