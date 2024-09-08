// server.js
const express = require('express');
const cors = require('cors');

const { sequelize, 
    ParMoeda, 
    Estrategia, 
    Ticker, 
    Carteira, 
    TipoOperacao, 
    Operacao, 
    TipoProvento,
    Provento,
    Dashboard
} = require('./models');

const genericRoutes = require('./routes/genericRoutes');
require('dotenv').config();

const app = express();

// Middleware CORS
app.use(cors());

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
        const btcusdt = await ParMoeda.findOne();
        await Estrategia.bulkCreate([
            { nome: 'Pullback de baixa 3 2 3', descricao: 'Compra quando cai 3%, vende quando sobe 2% ou cai mais 3%', ativo: 'true' },
            { nome: 'Pullback de baixa 2 1.5 3', descricao: 'Compra quando cai 2%, vende quando sobe 1.5% ou cai mais 3%', ativo: 'true' },
        ]);
        const estrategia = await Estrategia.create({ nome: 'Pullback de baixa 1.5 1.2 1.1', descricao: 'Compra quando cai 1.5%, vende quando sobe 1.2% ou cai mais 1.1%', ativo: 'true' });

        estrategia.addParMoeda(aaveusdt);
        estrategia.addParMoeda(btcusdt);
        
        await Ticker.bulkCreate([
            { nome: 'BBAS3', descricao: 'Banco do Brasil SA', ativo: 'true' },
            { nome: 'BBDC4', descricao: 'Banco Bradesco SA', ativo: 'false' },
            { nome: 'DMVF3', descricao: 'DMVF3', ativo: 'true' },
        ]);

        await Carteira.bulkCreate([
            { nome: 'MAGAR Brasil', ativo: 'true' },
        ]);

        await TipoOperacao.bulkCreate([
            { nome: 'Compra', ativo: 'true' },
            { nome: 'Venda', ativo: 'true' },
        ]);

        await TipoProvento.bulkCreate([
            { nome: 'Dividendos', ativo: 'true' },
            { nome: 'JCP', ativo: 'true' },
            { nome: 'Rendimentos', ativo: 'true' },
        ]);

        await Operacao.bulkCreate([
            {   data: '2024-09-04', 
                quantidade: 200,
                valor_unitario: 99.96,
                taxas: 6.60,
                TipoOperacaoId: 1,
                TickerId: 1,
                CarteiraId: 1,
            },
        ]);

        await Provento.bulkCreate([
            {   data: '2024-09-05', 
                valor_unitario: 1.96,
                total: 60.60,
                TipoProventoId: 1,
                TickerId: 1,
                CarteiraId: 1,
            },
        ]);

        await Dashboard.bulkCreate([
            {   quantidade: 100, 
                preco_medio: 1.96,
                investido: 10000,
                proventos: 135,
                TickerId: 1,
                CarteiraId: 1,
            },
            {   quantidade: 150, 
                preco_medio: 8.96,
                investido: 12000,
                proventos: 0,
                TickerId: 2,
                CarteiraId: 1,
            },
            {   quantidade: 150, 
                preco_medio: 8.96,
                investido: 12000,
                proventos: 0,
                TickerId: 3,
                CarteiraId: 1,
            },
        ]);


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
