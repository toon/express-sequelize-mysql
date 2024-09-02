// server.js
const express = require('express');
const cors = require('cors');
const { sequelize, ParMoeda, Estrategia } = require('./models');
const genericRoutes = require('./routes/genericRoutes');
require('dotenv').config();

const app = express();

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:8081' // Permite essa origem específica
  }));

app.use(express.json());
app.use('/api', genericRoutes);

// Função para adicionar dados iniciais
async function insertInitialData() {

    try {
        // Insere dados iniciais
        await ParMoeda.bulkCreate([
            { nome: 'BTCUSDT', ativo: 'true' },
            { nome: 'ETCUSDT', ativo: 'true' },
            { nome: 'BATUSDT', ativo: 'false' },
        ]);
        const aaveusdt = await ParMoeda.create({ nome: 'AAVEUSDT', ativo: 'true' });
        await Estrategia.bulkCreate([
            { nome: 'Pullback de baixa 3 2 3', descricao: 'Compra quando cai 3%, vende quando sobe 2% ou cai mais 3%', ativo: 'true' },
            { nome: 'Pullback de baixa 2 1.5 3', descricao: 'Compra quando cai 2%, vende quando sobe 1.5% ou cai mais 3%', ativo: 'true' },
        ]);
        const estrategia = await Estrategia.create({ nome: 'Pullback de baixa 1.5 1.2 1.1', descricao: 'Compra quando cai 1.5%, vende quando sobe 1.2% ou cai mais 1.1%', ativo: 'true' });

        estrategia.addParMoeda(aaveusdt);


    } catch (error) {
        console.error('Erro ao inserir dados iniciais:', error);
    }

}

// Sincronizar os modelos e iniciar o servidor
sequelize.sync({ force: true }) // 'force: true' recria as tabelas a cada início
    .then(async () => {
        // Insere os dados iniciais
        await insertInitialData();

        // Inicia o servidor
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Erro ao sincronizar o banco de dados:', error);
    });
