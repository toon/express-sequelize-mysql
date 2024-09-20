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
            { nome: 'BBAS3.SA', descricao: 'Banco do Brasil SA', ativo: 'true' },
            { nome: 'BBDC4.SA', descricao: 'Banco Bradesco SA', ativo: 'false' },
            { nome: 'DMVF3.SA', descricao: 'DMVF3', ativo: 'true' },
            { nome: 'CMIG4.SA', descricao: 'CMIG4', ativo: 'true' },
            { nome: 'CMIN3.SA', descricao: 'CMIN3', ativo: 'true' },
            
        ]);

        await Carteira.bulkCreate([
            { nome: 'MAGAR Brasil', ativo: 'true' },
        ]);

        await TipoOperacao.bulkCreate([
            { nome: 'Compra', ativo: 'true' },
            { nome: 'Venda', ativo: 'true' },
            { nome: 'Bonificação', ativo: 'true' },
            { nome: 'Recompra', ativo: 'true' },
        ]);

        await TipoProvento.bulkCreate([
            { nome: 'Dividendos', ativo: 'true' },
            { nome: 'JCP', ativo: 'true' },
            { nome: 'Rendimentos', ativo: 'true' },
        ]);

        await Operacao.bulkCreate([
            {   data: '2024-05-20', 
                quantidade: 200,
                valor_unitario: 5.27,
                taxas: 0.31,
                TipoOperacaoId: 1,
                TickerId: 5,
                CarteiraId: 1,
            },
            {   data: '2024-05-21', 
                quantidade: 200,
                valor_unitario: 5.51,
                taxas: 0.32,
                TipoOperacaoId: 1,
                TickerId: 5,
                CarteiraId: 1,
            },
            {   data: '2024-08-21', 
                quantidade: 400,
                valor_unitario: 5.55,
                taxas: 0.66,
                TipoOperacaoId: 2,
                TickerId: 5,
                CarteiraId: 1,
            },
            {   data: '2024-03-20', 
                quantidade: 200,
                valor_unitario: 28.08,
                taxas: 0,
                TipoOperacaoId: 1,
                TickerId: 1,
                CarteiraId: 1,
            },
            {   data: '2024-03-21', 
                quantidade: 114,
                valor_unitario: 27.92,
                taxas: 0,
                TipoOperacaoId: 1,
                TickerId: 1,
                CarteiraId: 1,
            },
            {   data: '2024-03-20', 
                quantidade: 600,
                valor_unitario: 14.18,
                taxas: 0,
                TipoOperacaoId: 1,
                TickerId: 2,
                CarteiraId: 1,
            },
            {   data: '2024-03-21', 
                quantidade: 80,
                valor_unitario: 14.15,
                taxas: 0,
                TipoOperacaoId: 1,
                TickerId: 2,
                CarteiraId: 1,
            },
            {   data: '2024-05-14', 
                quantidade: 100,
                valor_unitario: 13.45,
                taxas: 0,
                TipoOperacaoId: 1,
                TickerId: 2,
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
            {   data: '2024-09-05', 
                valor_unitario: 1.96,
                total: 40.00,
                TipoProventoId: 1,
                TickerId: 1,
                CarteiraId: 1,
            },
            {   data: '2024-09-05', 
                valor_unitario: 1.96,
                total: 40.00,
                TipoProventoId: 1,
                TickerId: 2,
                CarteiraId: 1,
            },
        ]);

        // await Dashboard.bulkCreate([
        //     {   quantidade: 100, 
        //         preco_medio: 1.96,
        //         investido: 2000,
        //         proventos: 0,
        //         TickerId: 1,
        //         CarteiraId: 1,
        //     },
        //     {   quantidade: 150, 
        //         preco_medio: 8.96,
        //         investido: 2300,
        //         proventos: 0,
        //         TickerId: 2,
        //         CarteiraId: 1,
        //     },
        //     {   quantidade: 150, 
        //         preco_medio: 8.96,
        //         investido: 12000,
        //         proventos: 0,
        //         TickerId: 3,
        //         CarteiraId: 1,
        //     },
        // ]);


    } catch (error) {
        console.error('Erro ao inserir dados iniciais:', error);
    }

}


  // Função para remover procedures e triggers preexistentes
  async function dropProcsTriggers() {
    const procstriggers = [
      `
      DROP PROCEDURE IF EXISTS atualiza_dashboards;
      `,
      `
      DROP TRIGGER IF EXISTS atualiza_preco_medio_depois_insert_operacao;
      `,
      `
      DROP TRIGGER IF EXISTS atualiza_preco_medio_depois_update_operacao;
      `,
      `
      DROP TRIGGER IF EXISTS atualiza_preco_medio_depois_delete_operacao;
      `,
      `
      DROP TRIGGER IF EXISTS atualiza_preco_medio_depois_insert_provento;
      `,
      `
      DROP TRIGGER IF EXISTS atualiza_preco_medio_depois_update_provento;
      `,
      `
      DROP TRIGGER IF EXISTS atualiza_preco_medio_depois_delete_provento;
      `
    ];
  
    for (const proctrigger of procstriggers) {
      await sequelize.query(proctrigger);
    }
  }


// Função para criar procedimentos armazenados
async function createStoredProcedures() {
    const sql = `
      CREATE PROCEDURE atualiza_dashboards(carteira_id INT, ticker_id INT)
      BEGIN
          -- Remove os dados existentes para a carteira e ticker correspondentes
          DELETE FROM Dashboards
          WHERE tickerid = ticker_id
          AND CarteiraId = carteira_id;
  
          -- Reinsere os novos dados atualizados
          INSERT INTO Dashboards (CarteiraId, tickerid, preco_medio, quantidade, investido, proventos)
          SELECT 
              operacoes.CarteiraId,
              operacoes.tickerid,
              ROUND(operacoes.preco_medio, 2) AS preco_medio,
              operacoes.qtde,
              operacoes.investido,
              COALESCE(proventos.proventos, 0) AS proventos
          FROM 
              (
                  SELECT 
                      o.CarteiraId, 
                      o.tickerid, 
                      SUM(o.quantidade * o.valor_unitario + o.taxas) / SUM(o.quantidade) AS preco_medio, 
                      (SUM(CASE WHEN o.tipooperacaoId = 1 THEN quantidade ELSE 0 END) +
                      SUM(CASE WHEN o.tipooperacaoId = 3 THEN quantidade ELSE 0 END) -
					  SUM(CASE WHEN o.tipooperacaoId = 2 THEN quantidade ELSE 0 END)) AS qtde, 
                      SUM(o.quantidade * o.valor_unitario + o.taxas) AS investido
                  FROM 
                      operacaos o
                  WHERE 
                      o.CarteiraId = carteira_id
                      AND o.tickerid = ticker_id
                  GROUP BY o.CarteiraId, o.tickerid
              ) AS operacoes
          LEFT JOIN
              (
                  SELECT 
                      p.CarteiraId,
                      p.tickerid,
                      COALESCE(SUM(p.total), 0) AS proventos
                  FROM 
                      provento p
                  WHERE 
                      p.CarteiraId = carteira_id
                      AND p.tickerid = ticker_id
                  GROUP BY p.CarteiraId, p.tickerid
              ) AS proventos
          ON 
              operacoes.CarteiraId = proventos.CarteiraId
              AND operacoes.tickerid = proventos.tickerid;
      END;
    `;
  
    await sequelize.query(sql);
  }
  
  // Função para criar triggers
  async function createTriggers() {
    const triggers = [
      `
      CREATE TRIGGER atualiza_preco_medio_depois_insert_operacao
      AFTER INSERT ON operacaos
      FOR EACH ROW
      BEGIN
          CALL atualiza_dashboards(NEW.CarteiraId, NEW.tickerid);
      END;
      `,
      `
      CREATE TRIGGER atualiza_preco_medio_depois_update_operacao
      AFTER UPDATE ON operacaos
      FOR EACH ROW
      BEGIN
          CALL atualiza_dashboards(NEW.CarteiraId, NEW.tickerid);
      END;
      `,
      `
      CREATE TRIGGER atualiza_preco_medio_depois_delete_operacao
      AFTER DELETE ON operacaos
      FOR EACH ROW
      BEGIN
          CALL atualiza_dashboards(OLD.CarteiraId, OLD.tickerid);
      END;
      `,
      `
      CREATE TRIGGER atualiza_preco_medio_depois_insert_provento
      AFTER INSERT ON provento
      FOR EACH ROW
      BEGIN
          CALL atualiza_dashboards(NEW.CarteiraId, NEW.tickerid);
      END;
      `,
      `
      CREATE TRIGGER atualiza_preco_medio_depois_update_provento
      AFTER UPDATE ON provento
      FOR EACH ROW
      BEGIN
          CALL atualiza_dashboards(NEW.CarteiraId, NEW.tickerid);
      END;
      `,
      `
      CREATE TRIGGER atualiza_preco_medio_depois_delete_provento
      AFTER DELETE ON provento
      FOR EACH ROW
      BEGIN
          CALL atualiza_dashboards(OLD.CarteiraId, OLD.tickerid);
      END;
      `
    ];
  
    for (const trigger of triggers) {
      await sequelize.query(trigger);
    }
  }

// Sincronizar os modelos e iniciar o servidor
sequelize.sync({ force: true }) // 'force: true' recria as tabelas a cada início
    .then(async () => {

        // Configurar procedimentos armazenados e triggers
        await dropProcsTriggers();
        await createStoredProcedures();
        await createTriggers();

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
