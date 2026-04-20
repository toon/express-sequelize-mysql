// models/index.js
const sequelize = require('../config/db');
const Estrategia = require('./Estrategia');
const ParMoeda = require('./ParMoeda');
const Ticker = require('./Ticker');
const Carteira = require('./Carteira');
const Operacao = require('./Operacao');
const TipoOperacao = require('./TipoOperacao');
const TipoProvento = require('./TipoProvento');
const TipoAtivo = require('./TipoAtivo');
const TipoAtivoClassificacao = require('./TipoAtivoClassificacao');
const TipoAtivoAgrupamento = require('./TipoAtivoAgrupamento');
const Provento = require('./Provento');
const Moeda = require('./Moeda');
const Opcao = require('./Opcao');
const TipoOpcaoStatus = require('./TipoOpcaoStatus');
const TipoOpcaoOperacao = require('./TipoOpcaoOperacao');
const TipoOpcaoPeriodo = require('./TipoOpcaoPeriodo');
const Dashboard = require('./Dashboard');
const PosicaoAtivo = require('./PosicaoAtivo');
const Investidor = require('./Investidor');
const Corretora = require('./Corretora');
// const User = require('./User');
// const Post = require('./Post');
// const Project = require('./Project');

// Defina associações (1:N)
// User.hasMany(Post);
// Post.belongsTo(User);
// User.belongsToMany(Project, { through: 'UserProjects' });
// Project.belongsToMany(User, { through: 'UserProjects' });

Opcao.belongsTo(TipoOpcaoOperacao);
TipoOpcaoOperacao.hasMany(Opcao)
Opcao.belongsTo(TipoOpcaoStatus);
TipoOpcaoStatus.hasMany(Opcao)
Opcao.belongsTo(TipoOpcaoPeriodo);
TipoOpcaoPeriodo.hasMany(Opcao)
Opcao.belongsTo(Ticker);
Ticker.hasMany(Opcao)

ParMoeda.belongsToMany(Estrategia, { through: 'EstrategiaParMoeda' });
Estrategia.belongsToMany(ParMoeda, { through: 'EstrategiaParMoeda' });

Carteira.belongsToMany(Ticker, { through: 'CarteiraTicker' });
Ticker.belongsToMany(Carteira, { through: 'CarteiraTicker' });

Ticker.hasMany(PosicaoAtivo);
PosicaoAtivo.belongsTo(Ticker)

PosicaoAtivo.belongsTo(Carteira);
Carteira.hasMany(PosicaoAtivo);


//Associações com Investidor/Corretora e Operacoes
Operacao.belongsTo(Investidor);
Investidor.hasMany(Operacao);
Operacao.belongsTo(Corretora);
Corretora.hasMany(Operacao);

//Associações com Investidor/Corretora e Proventos
Provento.belongsTo(Investidor);
Investidor.hasMany(Provento);
Provento.belongsTo(Corretora);
Corretora.hasMany(Provento);

//Associações com Investidor/Corretora e Opcoes
Opcao.belongsTo(Investidor);
Investidor.hasMany(Opcao);
Opcao.belongsTo(Corretora);
Corretora.hasMany(Opcao);

// Auto-associação para Rolagem de Opções
Opcao.belongsTo(Opcao, { as: 'OpcaoOriginal', foreignKey: 'rolagem_de_id' });
Opcao.hasMany(Opcao, { as: 'Rolagens', foreignKey: 'rolagem_de_id' });

// Associações Operacao
Operacao.belongsTo(PosicaoAtivo);
PosicaoAtivo.hasMany(Operacao)

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

Ticker.belongsTo(TipoAtivo);
TipoAtivo.hasMany(Ticker);

Ticker.belongsTo(TipoAtivoClassificacao);
TipoAtivoClassificacao.hasMany(Ticker);

Ticker.belongsTo(TipoAtivoAgrupamento);
TipoAtivoAgrupamento.hasMany(Ticker);

Ticker.belongsTo(Moeda);
Moeda.hasMany(Ticker);

const models = { 
    ParMoeda, 
    Estrategia, 
    Ticker, 
    Carteira,
    Operacao,
    TipoOperacao,
    TipoProvento,
    TipoAtivo,
    TipoAtivoClassificacao,
    TipoAtivoAgrupamento,
    Provento,
    Moeda,
    Opcao,
    TipoOpcaoStatus,
    TipoOpcaoOperacao,
    TipoOpcaoPeriodo,
    PosicaoAtivo,
    Investidor,
    Corretora,
    Dashboard
 };

// const models = { User, Post, Project };

module.exports = { ...models, sequelize };
