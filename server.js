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
    TipoAtivo,
    Provento,
    Moeda,
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
        
        await Moeda.bulkCreate([
            { nome: 'R$', descricao: 'Real Brasileiro', ativo: 'true' },
            { nome: 'US$', descricao: 'Dólar Americano', ativo: 'true' },
        ]);

        await TipoAtivo.bulkCreate([
            { nome: 'Ações', ativo: 'true' },
            { nome: 'FII', ativo: 'true' },
            { nome: 'ETF', ativo: 'true' },
            { nome: 'Stocks', ativo: 'true' },
            { nome: 'ETF USA', ativo: 'true' },
            { nome: 'Cripto', ativo: 'true' },
        ]);

        await Ticker.bulkCreate([
            { nome: 'ISAE4.SA', descricao: 'ISA ENERGIA BRASIL S.A', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'MSFT', descricao: 'Microsoft Corp', ativo: 'true', TipoAtivoId: 4, MoedaId: 2 },
            { nome: 'LFTS11.SA', descricao: 'INVESTO TEVA TESOURO SELIC ETF', ativo: 'true', TipoAtivoId: 3, MoedaId: 1 },
            { nome: 'NVDA', descricao: 'NVIDIA Corp', ativo: 'true', TipoAtivoId: 4, MoedaId: 2 },
            { nome: 'BRFS3.SA', descricao: 'BRF SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'AAPL', descricao: 'Apple Inc', ativo: 'true', TipoAtivoId: 4, MoedaId: 2 },
            { nome: 'DIRR3.SA', descricao: 'Direcional Engenharia SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'JALL3.SA', descricao: 'JALLES MACHADO S.A.', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'MOVI3.SA', descricao: 'Movida Participacoes SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'EGIE3.SA', descricao: 'Engie Brasil Energia SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'CSNA3.SA', descricao: 'Companhia Siderurgica Nacional', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'TOTS3.SA', descricao: 'Totvs SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'CMIN3.SA', descricao: 'CSN MINERAÇÃO S.A.', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'DMVF3.SA', descricao: 'D1000 Varejo Farma Participacoes SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'BRST3.SA', descricao: 'BRISANET PARTICIPAÇÕES S.A.', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'MILS3.SA', descricao: 'Mills Estruturas e Servicos de Engnhr SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'EMBR3.SA', descricao: 'Embraer SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'BBSE3.SA', descricao: 'BB Seguridade Participacoes SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'CXSE3.SA', descricao: 'CAIXA SEGURIDADE PARTICIPAÇÕES S.A', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'ITSA4.SA', descricao: 'Itausa SA Preference Shares', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'BBDC4.SA', descricao: 'Banco Bradesco SA Preference Shares', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'BBAS3.SA', descricao: 'Banco do Brasil SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'KEPL3.SA', descricao: 'Kepler Weber SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'SMTO3.SA', descricao: 'Sao Martinho SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'HYPE3.SA', descricao: 'Hypera SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'ODPV3.SA', descricao: 'Odontoprev SA', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'CSMG3.SA', descricao: 'Companhia de Saneamento de Minas Gerais', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'SAPR11.SA', descricao: 'Companhia de Saneamento Parana SANEPAR Brazilian Units', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'CMIG4.SA', descricao: 'Companhia Energetica de Minas Gers CEMIG Preference Shares', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'CYRE3.SA', descricao: 'Cyrela Brazil Realty SA Emprdts e Prtpcs', ativo: 'true', TipoAtivoId: 1, MoedaId: 1 },
            { nome: 'BTLG11.SA', descricao: 'BTG Pactual Logística', ativo: 'true', TipoAtivoId: 2, MoedaId: 1 },
            { nome: 'HGBS11.SA', descricao: 'Hedge Brasil Shopping', ativo: 'true', TipoAtivoId: 2, MoedaId: 1 },
            { nome: 'HSML11.SA', descricao: 'HSI Malls', ativo: 'true', TipoAtivoId: 2, MoedaId: 1 },
            { nome: 'VISC11.SA', descricao: 'Vinci Shopping Centers', ativo: 'true', TipoAtivoId: 2, MoedaId: 1 },
            { nome: 'BTAL11.SA', descricao: 'BTG Pactual Agro Logística', ativo: 'true', TipoAtivoId: 2, MoedaId: 1 },
            { nome: 'RZTR11.SA', descricao: 'FUNDO DE INVESTIMENTO IMOBILIÁRIO RIZA TERRAX', ativo: 'true', TipoAtivoId: 2, MoedaId: 1 },
            { nome: 'GGRC11.SA', descricao: 'GGR COVEPI', ativo: 'true', TipoAtivoId: 2, MoedaId: 1 },
            { nome: 'ETHUSD', descricao: 'ETHER', ativo: 'true', TipoAtivoId: 6, MoedaId: 2 },
            { nome: 'BTCUSD', descricao: 'BITCOIN', ativo: 'true', TipoAtivoId: 6, MoedaId: 2 },
            { nome: 'SGOV', descricao: 'iShare 0-3 Month Treasure Bond ETF', ativo: 'true', TipoAtivoId: 5, MoedaId: 2 },
            { nome: 'GLD', descricao: 'SPDR Gold Shares', ativo: 'true', TipoAtivoId: 5, MoedaId: 2 },
            { nome: 'IAU', descricao: 'iShares Gold', ativo: 'true', TipoAtivoId: 5, MoedaId: 2 },
            { nome: 'VOO', descricao: 'Vanguard S&P 500', ativo: 'true', TipoAtivoId: 5, MoedaId: 2 },            
        ]);

        await Carteira.bulkCreate([
            { nome: 'MAGAR Brasil', ativo: 'true' },
            { nome: 'MAGAR USA', ativo: 'true' },
        ]);

        await TipoOperacao.bulkCreate([
            { nome: 'Compra', ativo: 'true' },
            { nome: 'Venda', ativo: 'true' },
            { nome: 'Bonificação', ativo: 'true' },
            { nome: 'Subscrição', ativo: 'true' },
        ]);

        await TipoProvento.bulkCreate([
            { nome: 'Dividendos', ativo: 'true' },
            { nome: 'JCP', ativo: 'true' },
            { nome: 'Rendimentos', ativo: 'true' },
        ]);

        await Operacao.bulkCreate([
            { data: '2025-02-10', quantidade: 270, valor_unitario: 129.08, taxas: 10.46, TipoOperacaoId: 1, TickerId: 3, CarteiraId: 1 },
            { data: '2025-02-28', quantidade: 100, valor_unitario: 130.06, taxas: 3.90, TipoOperacaoId: 1, TickerId: 3, CarteiraId: 1 },
            { data: '2025-04-03', quantidade: 274, valor_unitario: 131.40, taxas: 15.76, TipoOperacaoId: 1, TickerId: 3, CarteiraId: 1 },
            { data: '2025-04-09', quantidade: 123, valor_unitario: 131.69, taxas: 4.86, TipoOperacaoId: 2, TickerId: 3, CarteiraId: 1 },
            { data: '2025-04-23', quantidade: 80, valor_unitario: 132.26, taxas: 3.17, TipoOperacaoId: 1, TickerId: 3, CarteiraId: 1 },
            { data: '2025-05-09', quantidade: 71, valor_unitario: 132.99, taxas: 2.83, TipoOperacaoId: 1, TickerId: 3, CarteiraId: 1 },
            { data: '2025-01-21', quantidade: 1, valor_unitario: 223.00, taxas: 0.00, TipoOperacaoId: 1, TickerId: 6, CarteiraId: 1, cotacao_dolar: 6.18 },
            { data: '2025-02-14', quantidade: 1, valor_unitario: 407.05, taxas: 0.00, TipoOperacaoId: 1, TickerId: 2, CarteiraId: 1, cotacao_dolar: 5.92 },
            { data: '2025-02-03', quantidade: 2, valor_unitario: 115.62, taxas: 0.00, TipoOperacaoId: 1, TickerId: 4, CarteiraId: 1, cotacao_dolar: 5.92 },
            { data: '2025-03-10', quantidade: 3, valor_unitario: 107.62, taxas: 0.00, TipoOperacaoId: 1, TickerId: 4, CarteiraId: 1, cotacao_dolar: 5.71 },
            { data: '2024-03-20', quantidade: 200, valor_unitario: 28.08, taxas: 1.68, TipoOperacaoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2024-03-21', quantidade: 144, valor_unitario: 27.92, taxas: 1.21, TipoOperacaoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2024-11-11', quantidade: 100, valor_unitario: 26.02, taxas: 0.78, TipoOperacaoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2024-11-11', quantidade: 66, valor_unitario: 26.02, taxas: 0.52, TipoOperacaoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2025-01-21', quantidade: 500, valor_unitario: 25.65, taxas: 3.85, TipoOperacaoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2025-01-22', quantidade: 600, valor_unitario: 25.68, taxas: 4.62, TipoOperacaoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2025-01-27', quantidade: 10, valor_unitario: 27.66, taxas: 0.08, TipoOperacaoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2025-03-28', quantidade: 600, valor_unitario: 28.68, taxas: 5.16, TipoOperacaoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2025-04-09', quantidade: 600, valor_unitario: 27.17, taxas: 4.89, TipoOperacaoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2025-04-30', quantidade: 600, valor_unitario: 28.80, taxas: 5.18, TipoOperacaoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2025-05-02', quantidade: 600, valor_unitario: 28.85, taxas: 5.19, TipoOperacaoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 600, valor_unitario: 14.18, taxas: 2.55, TipoOperacaoId: 1, TickerId: 21, CarteiraId: 1 },
            { data: '2024-03-21', quantidade: 80, valor_unitario: 14.15, taxas: 0.34, TipoOperacaoId: 1, TickerId: 21, CarteiraId: 1 },
            { data: '2024-05-14', quantidade: 100, valor_unitario: 13.45, taxas: 0.40, TipoOperacaoId: 1, TickerId: 21, CarteiraId: 1 },
            { data: '2024-12-19', quantidade: 300, valor_unitario: 11.50, taxas: 1.04, TipoOperacaoId: 1, TickerId: 21, CarteiraId: 1 },
            { data: '2025-01-20', quantidade: 200, valor_unitario: 11.52, taxas: 0.69, TipoOperacaoId: 1, TickerId: 21, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 300, valor_unitario: 32.96, taxas: 2.97, TipoOperacaoId: 1, TickerId: 18, CarteiraId: 1 },
            { data: '2024-11-18', quantidade: 100, valor_unitario: 33.57, taxas: 1.01, TipoOperacaoId: 1, TickerId: 18, CarteiraId: 1 },
            { data: '2025-01-27', quantidade: 400, valor_unitario: 38.54, taxas: 4.62, TipoOperacaoId: 2, TickerId: 18, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 300, valor_unitario: 27.87, taxas: 0.00, TipoOperacaoId: 1, TickerId: 24, CarteiraId: 1 },
            { data: '2024-03-21', quantidade: 45, valor_unitario: 28.47, taxas: 3.56, TipoOperacaoId: 1, TickerId: 24, CarteiraId: 1 },
            { data: '2024-06-19', quantidade: 300, valor_unitario: 31.86, taxas: 3.28, TipoOperacaoId: 2, TickerId: 24, CarteiraId: 1 },
            { data: '2024-06-19', quantidade: 45, valor_unitario: 31.64, taxas: 0.00, TipoOperacaoId: 2, TickerId: 24, CarteiraId: 1 },
            { data: '2024-07-02', quantidade: 300, valor_unitario: 32.00, taxas: 3.32, TipoOperacaoId: 1, TickerId: 24, CarteiraId: 1 },
            { data: '2024-07-02', quantidade: 30, valor_unitario: 32.00, taxas: 0.00, TipoOperacaoId: 1, TickerId: 24, CarteiraId: 1 },
            { data: '2024-07-02', quantidade: 15, valor_unitario: 32.05, taxas: 0.00, TipoOperacaoId: 1, TickerId: 24, CarteiraId: 1 },
            { data: '2024-09-10', quantidade: 200, valor_unitario: 25.73, taxas: 1.50, TipoOperacaoId: 1, TickerId: 24, CarteiraId: 1 },
            { data: '2025-01-31', quantidade: 200, valor_unitario: 22.04, taxas: 1.32, TipoOperacaoId: 1, TickerId: 5, CarteiraId: 1 },
            { data: '2024-05-13', quantidade: 300, valor_unitario: 4.30, taxas: 0.38, TipoOperacaoId: 1, TickerId: 15, CarteiraId: 1 },
            { data: '2024-05-15', quantidade: 300, valor_unitario: 4.57, taxas: 0.40, TipoOperacaoId: 1, TickerId: 15, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 800, valor_unitario: 11.74, taxas: 2.82, TipoOperacaoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2024-05-03', quantidade: 200, valor_unitario: 5.00, taxas: 0.30, TipoOperacaoId: 3, TickerId: 29, CarteiraId: 1 },
            { data: '2024-05-03', quantidade: 40, valor_unitario: 5.00, taxas: 0.06, TipoOperacaoId: 3, TickerId: 29, CarteiraId: 1 },
            { data: '2024-07-17', quantidade: 40, valor_unitario: 11.23, taxas: 0.13, TipoOperacaoId: 2, TickerId: 29, CarteiraId: 1 },
            { data: '2024-07-18', quantidade: 40, valor_unitario: 11.05, taxas: 0.13, TipoOperacaoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2024-08-30', quantidade: 600, valor_unitario: 11.57, taxas: 2.08, TipoOperacaoId: 2, TickerId: 29, CarteiraId: 1 },
            { data: '2024-09-02', quantidade: 600, valor_unitario: 11.57, taxas: 2.08, TipoOperacaoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2024-09-02', quantidade: 100, valor_unitario: 11.57, taxas: 0.35, TipoOperacaoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2025-01-20', quantidade: 200, valor_unitario: 10.46, taxas: 0.63, TipoOperacaoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2024-05-20', quantidade: 200, valor_unitario: 5.27, taxas: 0.31, TipoOperacaoId: 1, TickerId: 13, CarteiraId: 1 },
            { data: '2024-05-21', quantidade: 200, valor_unitario: 5.51, taxas: 0.32, TipoOperacaoId: 1, TickerId: 13, CarteiraId: 1 },
            { data: '2024-08-21', quantidade: 400, valor_unitario: 5.55, taxas: 0.66, TipoOperacaoId: 2, TickerId: 13, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 400, valor_unitario: 20.38, taxas: 2.45, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-03-21', quantidade: 71, valor_unitario: 20.89, taxas: 0.44, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-07-30', quantidade: 400, valor_unitario: 22.04, taxas: 2.64, TipoOperacaoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2024-07-30', quantidade: 71, valor_unitario: 22.03, taxas: 0.47, TipoOperacaoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2024-07-31', quantidade: 400, valor_unitario: 21.31, taxas: 2.56, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-07-31', quantidade: 100, valor_unitario: 21.32, taxas: 0.64, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-09-12', quantidade: 500, valor_unitario: 24.95, taxas: 3.74, TipoOperacaoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2024-09-23', quantidade: 500, valor_unitario: 24.80, taxas: 3.72, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-10-08', quantidade: 200, valor_unitario: 22.88, taxas: 1.37, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-11-29', quantidade: 700, valor_unitario: 25.37, taxas: 5.33, TipoOperacaoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2024-12-02', quantidade: 700, valor_unitario: 24.95, taxas: 5.24, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2025-01-30', quantidade: 700, valor_unitario: 22.39, taxas: 4.70, TipoOperacaoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2025-01-31', quantidade: 800, valor_unitario: 22.45, taxas: 5.39, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-05-24', quantidade: 200, valor_unitario: 13.58, taxas: 0.80, TipoOperacaoId: 1, TickerId: 11, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 400, valor_unitario: 16.53, taxas: 0.00, TipoOperacaoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-03-21', quantidade: 82, valor_unitario: 16.73, taxas: 0.00, TipoOperacaoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 100, valor_unitario: 16.54, taxas: 0.00, TipoOperacaoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-07-05', quantidade: 100, valor_unitario: 16.75, taxas: 0.49, TipoOperacaoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-09-10', quantidade: 200, valor_unitario: 15.66, taxas: 0.97, TipoOperacaoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-10-08', quantidade: 200, valor_unitario: 14.31, taxas: 0.85, TipoOperacaoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 400, valor_unitario: 24.16, taxas: 2.90, TipoOperacaoId: 2, TickerId: 30, CarteiraId: 1 },
            { data: '2024-06-05', quantidade: 50, valor_unitario: 21.73, taxas: 0.33, TipoOperacaoId: 2, TickerId: 30, CarteiraId: 1 },
            { data: '2024-05-15', quantidade: 400, valor_unitario: 20.71, taxas: 2.49, TipoOperacaoId: 2, TickerId: 30, CarteiraId: 1 },
            { data: '2024-05-15', quantidade: 50, valor_unitario: 20.70, taxas: 0.31, TipoOperacaoId: 2, TickerId: 30, CarteiraId: 1 },
            { data: '2024-05-16', quantidade: 400, valor_unitario: 20.71, taxas: 2.49, TipoOperacaoId: 1, TickerId: 30, CarteiraId: 1 },
            { data: '2024-05-16', quantidade: 50, valor_unitario: 20.75, taxas: 0.31, TipoOperacaoId: 1, TickerId: 30, CarteiraId: 1 },
            { data: '2025-03-28', quantidade: 400, valor_unitario: 24.35, taxas: 2.92, TipoOperacaoId: 2, TickerId: 30, CarteiraId: 1 },
            { data: '2025-03-28', quantidade: 50, valor_unitario: 24.31, taxas: 0.36, TipoOperacaoId: 2, TickerId: 30, CarteiraId: 1 },
            { data: '2024-08-07', quantidade: 100, valor_unitario: 26.12, taxas: 0.78, TipoOperacaoId: 1, TickerId: 7, CarteiraId: 1 },
            { data: '2024-11-07', quantidade: 100, valor_unitario: 28.02, taxas: 0.84, TipoOperacaoId: 2, TickerId: 7, CarteiraId: 1 },
            { data: '2024-05-16', quantidade: 100, valor_unitario: 8.30, taxas: 0.23, TipoOperacaoId: 1, TickerId: 14, CarteiraId: 1 },
            { data: '2024-05-27', quantidade: 30, valor_unitario: 44.48, taxas: 0.39, TipoOperacaoId: 1, TickerId: 10, CarteiraId: 1 },
            { data: '2024-06-28', quantidade: 30, valor_unitario: 44.38, taxas: 0.39, TipoOperacaoId: 2, TickerId: 10, CarteiraId: 1 },
            { data: '2024-05-06', quantidade: 100, valor_unitario: 34.32, taxas: 0.55, TipoOperacaoId: 1, TickerId: 17, CarteiraId: 1 },
            { data: '2024-05-21', quantidade: 100, valor_unitario: 38.93, taxas: 1.16, TipoOperacaoId: 2, TickerId: 17, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 200, valor_unitario: 33.69, taxas: 2.02, TipoOperacaoId: 1, TickerId: 25, CarteiraId: 1 },
            { data: '2024-04-02', quantidade: 100, valor_unitario: 30.00, taxas: 0.90, TipoOperacaoId: 1, TickerId: 25, CarteiraId: 1 },
            { data: '2024-11-11', quantidade: 100, valor_unitario: 21.00, taxas: 0.63, TipoOperacaoId: 1, TickerId: 25, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 300, valor_unitario: 24.99, taxas: 2.25, TipoOperacaoId: 1, TickerId: 1, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 85, valor_unitario: 24.98, taxas: 0.64, TipoOperacaoId: 1, TickerId: 1, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 900, valor_unitario: 10.66, taxas: 2.88, TipoOperacaoId: 1, TickerId: 20, CarteiraId: 1 },
            { data: '2024-06-05', quantidade: 100, valor_unitario: 9.83, taxas: 0.29, TipoOperacaoId: 1, TickerId: 20, CarteiraId: 1 },
            { data: '2024-12-19', quantidade: 400, valor_unitario: 8.77, taxas: 1.05, TipoOperacaoId: 1, TickerId: 20, CarteiraId: 1 },
            { data: '2025-01-20', quantidade: 200, valor_unitario: 9.06, taxas: 0.54, TipoOperacaoId: 1, TickerId: 20, CarteiraId: 1 },
            { data: '2024-12-04', quantidade: 50, valor_unitario: 13.56, taxas: 0.00, TipoOperacaoId: 3, TickerId: 20, CarteiraId: 1 },
            { data: '2025-04-22', quantidade: 22, valor_unitario: 6.70, taxas: 0.00, TipoOperacaoId: 4, TickerId: 20, CarteiraId: 1 },
            { data: '2024-10-07', quantidade: 200, valor_unitario: 7.52, taxas: 0.44, TipoOperacaoId: 1, TickerId: 8, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 900, valor_unitario: 10.35, taxas: 2.79, TipoOperacaoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-11-18', quantidade: 200, valor_unitario: 10.23, taxas: 0.61, TipoOperacaoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-12-19', quantidade: 200, valor_unitario: 9.36, taxas: 0.56, TipoOperacaoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-05-09', quantidade: 100, valor_unitario: 13.21, taxas: 0.40, TipoOperacaoId: 1, TickerId: 16, CarteiraId: 1 },
            { data: '2025-01-31', quantidade: 100, valor_unitario: 9.20, taxas: 0.28, TipoOperacaoId: 2, TickerId: 16, CarteiraId: 1 },
            { data: '2024-02-07', quantidade: 200, valor_unitario: 5.97, taxas: 0.34, TipoOperacaoId: 1, TickerId: 9, CarteiraId: 1 },
            { data: '2024-04-07', quantidade: 200, valor_unitario: 6.63, taxas: 0.39, TipoOperacaoId: 2, TickerId: 9, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 700, valor_unitario: 12.71, taxas: 2.67, TipoOperacaoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2024-03-21', quantidade: 59, valor_unitario: 12.59, taxas: 0.22, TipoOperacaoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2024-11-18', quantidade: 200, valor_unitario: 10.42, taxas: 0.63, TipoOperacaoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2024-03-20', quantidade: 300, valor_unitario: 25.83, taxas: 2.32, TipoOperacaoId: 1, TickerId: 28, CarteiraId: 1 },
            { data: '2024-03-21', quantidade: 72, valor_unitario: 26.19, taxas: 0.57, TipoOperacaoId: 1, TickerId: 28, CarteiraId: 1 },
            { data: '2024-08-07', quantidade: 300, valor_unitario: 28.92, taxas: 2.60, TipoOperacaoId: 2, TickerId: 28, CarteiraId: 1 },
            { data: '2024-08-07', quantidade: 72, valor_unitario: 28.91, taxas: 0.62, TipoOperacaoId: 2, TickerId: 28, CarteiraId: 1 },
            { data: '2024-08-08', quantidade: 400, valor_unitario: 28.88, taxas: 3.47, TipoOperacaoId: 1, TickerId: 28, CarteiraId: 1 },
            { data: '2025-01-20', quantidade: 100, valor_unitario: 25.79, taxas: 0.77, TipoOperacaoId: 1, TickerId: 28, CarteiraId: 1 },
            { data: '2025-01-20', quantidade: 100, valor_unitario: 25.79, taxas: 0.77, TipoOperacaoId: 1, TickerId: 28, CarteiraId: 1 },
            { data: '2025-04-30', quantidade: 500, valor_unitario: 30.55, taxas: 4.58, TipoOperacaoId: 2, TickerId: 28, CarteiraId: 1 },
            { data: '2025-05-02', quantidade: 500, valor_unitario: 30.54, taxas: 4.58, TipoOperacaoId: 1, TickerId: 28, CarteiraId: 1 },
            { data: '2024-05-22', quantidade: 50, valor_unitario: 30.06, taxas: 0.44, TipoOperacaoId: 1, TickerId: 12, CarteiraId: 1 },
            { data: '2025-01-31', quantidade: 50, valor_unitario: 32.20, taxas: 0.48, TipoOperacaoId: 2, TickerId: 12, CarteiraId: 1 },
            { data: '2025-05-15', quantidade: 400, valor_unitario: 7.80, taxas: 0.93, TipoOperacaoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-03-19', quantidade: 33.04656, valor_unitario: 199.72, taxas: 0.00, TipoOperacaoId: 1, TickerId: 41, CarteiraId: 2, cotacao_dolar: 5.09 },
            { data: '2024-09-10', quantidade: 2.67025, valor_unitario: 232.39, taxas: 0.00, TipoOperacaoId: 1, TickerId: 41, CarteiraId: 2, cotacao_dolar: 5.66 },
            { data: '2025-05-15', quantidade: 1.69965, valor_unitario: 294.18, taxas: 0.00, TipoOperacaoId: 1, TickerId: 41, CarteiraId: 2, cotacao_dolar: 5.77 },
            { data: '2024-03-19', quantidade: 65.94718, valor_unitario: 100.54, taxas: 0.00, TipoOperacaoId: 1, TickerId: 40, CarteiraId: 2, cotacao_dolar: 5.09 },
            { data: '2024-08-07', quantidade: 0.20838, valor_unitario: 100.39, taxas: 0.00, TipoOperacaoId: 1, TickerId: 40, CarteiraId: 2, cotacao_dolar: 5.63},
            { data: '2024-09-10', quantidade: 5.97312, valor_unitario: 100.45, taxas: 0.00, TipoOperacaoId: 1, TickerId: 40, CarteiraId: 2, cotacao_dolar: 5.66 },
            { data: '2024-07-11', quantidade: 0.20878, valor_unitario: 100.39, taxas: 0.00, TipoOperacaoId: 1, TickerId: 40, CarteiraId: 2, cotacao_dolar: 5.43 },
            { data: '2025-04-16', quantidade: 0.19795, valor_unitario: 100.53, taxas: 0.00, TipoOperacaoId: 1, TickerId: 40, CarteiraId: 2, cotacao_dolar: 5.90 },
            { data: '2025-05-15', quantidade: 5.14375, valor_unitario: 100.52, taxas: 0.00, TipoOperacaoId: 1, TickerId: 40, CarteiraId: 2, cotacao_dolar: 5.77 },
            { data: '2024-03-12', quantidade: 122.31757, valor_unitario: 40.88, taxas: 0.00, TipoOperacaoId: 1, TickerId: 42, CarteiraId: 1 },
            { data: '2024-04-05', quantidade: 0.78005, valor_unitario: 44.12, taxas: 0.00, TipoOperacaoId: 1, TickerId: 42, CarteiraId: 1 },
            { data: '2024-07-03', quantidade: 0.32122, valor_unitario: 44.61, taxas: 0.00, TipoOperacaoId: 1, TickerId: 42, CarteiraId: 1 },
            { data: '2024-08-10', quantidade: 0.43898, valor_unitario: 49.41, taxas: 0.00, TipoOperacaoId: 1, TickerId: 42, CarteiraId: 1 },
            { data: '2025-01-21', quantidade: 17.21945, valor_unitario: 51.63, taxas: 0.00, TipoOperacaoId: 1, TickerId: 42, CarteiraId: 1 },
            { data: '2024-03-12', quantidade: 10.57971, valor_unitario: 472.60, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2024-04-05', quantidade: 0.77093, valor_unitario: 477.34, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2024-04-17', quantidade: 0.4331, valor_unitario: 461.69, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2024-05-08', quantidade: 0.4204, valor_unitario: 475.66, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2024-06-17', quantidade: 0.4136, valor_unitario: 503.06, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2024-10-02', quantidade: 0.2515, valor_unitario: 523.59, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2025-01-14', quantidade: 0.6142, valor_unitario: 535.45, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2025-01-21', quantidade: 1.60965, valor_unitario: 551.67, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2025-03-10', quantidade: 0.14103, valor_unitario: 519.32, taxas: 0.00, TipoOperacaoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2025-05-19', quantidade: 500, valor_unitario: 37.94, taxas: 0, TipoOperacaoId: 1, TickerId: 18, CarteiraId: 1 },
            { data: '2025-05-19', quantidade: 113, valor_unitario: 133.42, taxas: 0, TipoOperacaoId: 2, TickerId: 3, CarteiraId: 1 },
            { data: '2025-05-06', quantidade: 80, valor_unitario: 15.57, taxas: 0.37, TipoOperacaoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-05-06', quantidade: 100, valor_unitario: 15.55, taxas: 0.47, TipoOperacaoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-05-06', quantidade: 1100, valor_unitario: 15.56, taxas: 5.13, TipoOperacaoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-05-30', quantidade: 800, valor_unitario: 23.90, taxas: 5.74, TipoOperacaoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2025-06-04', quantidade: 800, valor_unitario: 23.52, taxas: 5.64, TipoOperacaoId: 1, TickerId: 27, CarteiraId: 1 },
        ]);

        await Provento.bulkCreate([
            { data: '2025-02-13', valor_unitario: 0.17, total: 0.17, TipoProventoId: 1, TickerId: 6, CarteiraId: 1 },
            { data: '2025-03-13', valor_unitario: 0.58, total: 0.58, TipoProventoId: 1, TickerId: 2, CarteiraId: 1 },
            { data: '2025-02-04', valor_unitario: 0, total: 0.03, TipoProventoId: 1, TickerId: 4, CarteiraId: 1 },
            { data: '2024-06-21', valor_unitario: 0.16, total: 56.68, TipoProventoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2024-06-21', valor_unitario: 0.25, total: 85.72, TipoProventoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2024-06-28', valor_unitario: 0.20, total: 59.72, TipoProventoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.002, total: 0.73, TipoProventoId: 3, TickerId: 22, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.004, total: 1.49, TipoProventoId: 3, TickerId: 22, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.27, total: 91.96, TipoProventoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.15, total: 52.24, TipoProventoId: 1, TickerId: 22, CarteiraId: 1 },
            { data: '2024-09-27', valor_unitario: 0.16, total: 54.57, TipoProventoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2024-06-12', valor_unitario: 0.41, total: 209.51, TipoProventoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2024-12-27', valor_unitario: 0.15, total: 76.51, TipoProventoId: 2, TickerId: 22, CarteiraId: 1 },
            { data: '2024-05-02', valor_unitario: 0.02, total: 10.97, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2024-06-03', valor_unitario: 0.02, total: 10.97, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2024-08-01', valor_unitario: 0.02, total: 12.58, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2024-02-09', valor_unitario: 0.02, total: 12.58, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2024-01-10', valor_unitario: 0.02, total: 12.58, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2024-01-11', valor_unitario: 0.02, total: 12.58, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2024-02-11', valor_unitario: 0.02, total: 12.58, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-02-01', valor_unitario: 0.02, total: 12.58, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-01-31', valor_unitario: 0.34, total: 261.92, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-03-02', valor_unitario: 0.02, total: 17.42, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-05-03', valor_unitario: 0.02, total: 20.64, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-04-30', valor_unitario: 0.10, total: 130.96, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2025-02-05', valor_unitario: 0.02, total: 20.64, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 1.39, total: 417.27, TipoProventoId: 1, TickerId: 18, CarteiraId: 1 },
            { data: '2024-06-28', valor_unitario: 0.09, total: 96.90, TipoProventoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.50, total: 516.21, TipoProventoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2024-12-27', valor_unitario: 0.12, total: 96.90, TipoProventoId: 1, TickerId: 29, CarteiraId: 1 },
            { data: '2024-05-09', valor_unitario: 0.79, total: 372.64, TipoProventoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-05-17', valor_unitario: 0.14, total: 68.10, TipoProventoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-05-17', valor_unitario: 0.31, total: 124.16, TipoProventoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.42, total: 197.06, TipoProventoId: 1, TickerId: 27, CarteiraId: 1 },
            { data: '2024-08-19', valor_unitario: 0, total: 126.83, TipoProventoId: 2, TickerId: 27, CarteiraId: 1 },
            { data: '2024-11-28', valor_unitario: 0.55, total: 110.09, TipoProventoId: 1, TickerId: 11, CarteiraId: 1 },
            { data: '2024-05-08', valor_unitario: 0.55, total: 320.43, TipoProventoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-05-08', valor_unitario: 0.02, total: 7.11, TipoProventoId: 3, TickerId: 19, CarteiraId: 1 },
            { data: '2024-08-15', valor_unitario: 0.28, total: 190.96, TipoProventoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-11-18', valor_unitario: 0.23, total: 253.18, TipoProventoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2025-01-17', valor_unitario: 0.31, total: 335.42, TipoProventoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2025-01-17', valor_unitario: 0.00, total: 1.42, TipoProventoId: 1, TickerId: 19, CarteiraId: 1 },
            { data: '2024-11-26', valor_unitario: 0.60, total: 238.71, TipoProventoId: 1, TickerId: 30, CarteiraId: 1 },
            { data: '2025-01-16', valor_unitario: 1.27, total: 81.28, TipoProventoId: 1, TickerId: 7, CarteiraId: 1 },
            { data: '2025-01-21', valor_unitario: 0.72, total: 257.53, TipoProventoId: 2, TickerId: 1, CarteiraId: 1 },
            { data: '2025-02-21', valor_unitario: 0.67, total: 257.43, TipoProventoId: 2, TickerId: 1, CarteiraId: 1 },
            { data: '2025-03-21', valor_unitario: 0.67, total: 257.53, TipoProventoId: 2, TickerId: 1, CarteiraId: 1 },
            { data: '2024-07-01', valor_unitario: 0.02, total: 20.00, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0, total: 80.41, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0, total: 53.55, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2024-01-10', valor_unitario: 0.02, total: 20.00, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2025-02-01', valor_unitario: 0.02, total: 20.00, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2025-03-07', valor_unitario: 0.09, total: 141.79, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2025-03-07', valor_unitario: 0.05, total: 51.85, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2025-03-07', valor_unitario: 0.04, total: 41.14, TipoProventoId: 2, TickerId: 20, CarteiraId: 1 },
            { data: '2025-03-07', valor_unitario: 0.41, total: 673.44, TipoProventoId: 1, TickerId: 20, CarteiraId: 1 },
            { data: '2025-04-24', valor_unitario: 0.09, total: 152.19, TipoProventoId: 1, TickerId: 20, CarteiraId: 1 },
            { data: '2024-09-20', valor_unitario: 0.07, total: 13.53, TipoProventoId: 1, TickerId: 8, CarteiraId: 1 },
            { data: '2024-04-15', valor_unitario: 0.16, total: 141.90, TipoProventoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-04-15', valor_unitario: 0.27, total: 239.30, TipoProventoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-07-10', valor_unitario: 0.17, total: 152.78, TipoProventoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-08-23', valor_unitario: 0.07, total: 67.07, TipoProventoId: 2, TickerId: 23, CarteiraId: 1 },
            { data: '2024-11-28', valor_unitario: 0.08, total: 73.53, TipoProventoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-11-28', valor_unitario: 0.07, total: 61.19, TipoProventoId: 2, TickerId: 23, CarteiraId: 1 },
            { data: '2025-04-16', valor_unitario: 0.30, total: 386.42, TipoProventoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2025-04-16', valor_unitario: 0.11, total: 138.77, TipoProventoId: 1, TickerId: 23, CarteiraId: 1 },
            { data: '2024-07-15', valor_unitario: 0.08, total: 7.98, TipoProventoId: 2, TickerId: 16, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.06, total: 6.24, TipoProventoId: 2, TickerId: 16, CarteiraId: 1 },
            { data: '2024-08-30', valor_unitario: 0.14, total: 13.79, TipoProventoId: 1, TickerId: 16, CarteiraId: 1 },
            { data: '2025-01-15', valor_unitario: 0.19, total: 19.44, TipoProventoId: 2, TickerId: 16, CarteiraId: 1 },
            { data: '2024-08-21', valor_unitario: 0.04, total: 26.69, TipoProventoId: 2, TickerId: 26, CarteiraId: 1 },
            { data: '2024-08-21', valor_unitario: 0.36, total: 276.32, TipoProventoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2024-12-18', valor_unitario: 0.41, total: 313.97, TipoProventoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2024-12-18', valor_unitario: 0.13, total: 101.19, TipoProventoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2025-01-29', valor_unitario: 0.03, total: 25.50, TipoProventoId: 2, TickerId: 26, CarteiraId: 1 },
            { data: '2025-03-04', valor_unitario: 0.16, total: 118.51, TipoProventoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2025-03-04', valor_unitario: 0.23, total: 171.28, TipoProventoId: 1, TickerId: 26, CarteiraId: 1 },
            { data: '2025-03-04', valor_unitario: 0.03, total: 21.68, TipoProventoId: 2, TickerId: 26, CarteiraId: 1 },
            { data: '2024-08-13', valor_unitario: 0.29, total: 155.42, TipoProventoId: 1, TickerId: 24, CarteiraId: 1 },
            { data: '2024-12-19', valor_unitario: 0.38, total: 209.23, TipoProventoId: 2, TickerId: 24, CarteiraId: 1 },
            { data: '2024-08-26', valor_unitario: 0.20, total: 9.78, TipoProventoId: 2, TickerId: 12, CarteiraId: 1 },
            { data: '2024-12-27', valor_unitario: 0.19, total: 9.35, TipoProventoId: 2, TickerId: 12, CarteiraId: 1 },
            { data: '2024-05-04', valor_unitario: 0.45, total: 20.77, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-08-05', valor_unitario: 0.43, total: 20.51, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-07-06', valor_unitario: 0.44, total: 20.30, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-05-07', valor_unitario: 0.44, total: 20.26, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-06-08', valor_unitario: 0.45, total: 20.92, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-09-06', valor_unitario: 0.45, total: 20.54, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-10-04', valor_unitario: 0.45, total: 21.69, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-11-06', valor_unitario: 0.45, total: 20.96, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2025-02-06', valor_unitario: 0.45, total: 18.45, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2025-03-06', valor_unitario: 0.45, total: 15.90, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2025-04-04', valor_unitario: 0.45, total: 17.57, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2025-05-06', valor_unitario: 0.45, total: 17.05, TipoProventoId: 1, TickerId: 40, CarteiraId: 2 },
            { data: '2024-03-27', valor_unitario: 1.54, total: 11.42, TipoProventoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2024-07-02', valor_unitario: 1.25, total: 14.33, TipoProventoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2024-01-10', valor_unitario: 1.14, total: 13.17, TipoProventoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2025-03-31', valor_unitario: 1.28, total: 16.89, TipoProventoId: 1, TickerId: 43, CarteiraId: 1 },
            { data: '2025-06-02', valor_unitario: 0.02, total: 20.64, TipoProventoId: 2, TickerId: 21, CarteiraId: 1 }, 
        ]);


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
    
    -- Calcula todos os indicadores com base nas últimas operações
    INSERT INTO Dashboards (CarteiraId, tickerid, preco_medio, quantidade, investido, proventos, lucro_realizado)
    WITH 
    -- 1. Calcula o saldo atual do ativo para a carteira específica
    saldo_atual AS (
        SELECT 
            CarteiraId,
            TickerId,
            (SUM(CASE WHEN TipoOperacaoId = 1 THEN quantidade ELSE 0 END) +  -- Compras
             SUM(CASE WHEN TipoOperacaoId = 3 THEN quantidade ELSE 0 END) +  -- Bonificações
             SUM(CASE WHEN TipoOperacaoId = 4 THEN quantidade ELSE 0 END) -  -- Subscrições
             SUM(CASE WHEN TipoOperacaoId = 2 THEN quantidade ELSE 0 END)) AS saldo  -- Vendas
        FROM operacaos
        WHERE CarteiraId = carteira_id
        AND TickerId = ticker_id
        GROUP BY CarteiraId, TickerId
        HAVING saldo > 0
    ),
    
    -- 2. Ordena as operações por data DESC (compras, bonificações e subscrições)
    operacoes_ordenadas AS (
        SELECT 
            o.*,
            ROW_NUMBER() OVER (PARTITION BY o.CarteiraId, o.TickerId ORDER BY o.data DESC, o.id DESC) AS ordem_operacao_reversa,
            -- Bonificações têm valor zerado, subscrições têm valor normal
            CASE WHEN o.TipoOperacaoId = 3 THEN 0 ELSE o.valor_unitario END AS valor_ajustado,
            -- Bonificações têm taxas zeradas, subscrições têm taxas normais
            CASE WHEN o.TipoOperacaoId = 3 THEN 0 ELSE o.taxas END AS taxas_ajustadas
        FROM operacaos o
        WHERE o.TipoOperacaoId IN (1, 3, 4)  -- 1 = compra, 3 = bonificação, 4 = subscrição
        AND o.CarteiraId = carteira_id
        AND o.TickerId = ticker_id
    ),
    
    -- 3. Calcula o acumulado começando pelas operações mais recentes
    operacoes_com_acumulado AS (
        SELECT 
            a.*,
            (SELECT SUM(b.quantidade) 
             FROM operacoes_ordenadas b 
             WHERE b.CarteiraId = a.CarteiraId 
             AND b.TickerId = a.TickerId
             AND b.ordem_operacao_reversa <= a.ordem_operacao_reversa) AS acumulado_reverso
        FROM operacoes_ordenadas a
    ),
    
    -- 4. Determina quanto de cada operação deve ser considerado (começando pelas últimas)
    operacoes_parciais AS (
        SELECT 
            c.*,
            s.saldo AS saldo_atual,
            CASE
                WHEN (SELECT COALESCE(SUM(d.quantidade), 0) 
                     FROM operacoes_com_acumulado d 
                     WHERE d.CarteiraId = c.CarteiraId 
                     AND d.TickerId = c.TickerId
                     AND d.ordem_operacao_reversa < c.ordem_operacao_reversa) >= s.saldo THEN 0
                WHEN c.acumulado_reverso > s.saldo THEN 
                    s.saldo - (SELECT COALESCE(SUM(d.quantidade), 0) 
                              FROM operacoes_com_acumulado d 
                              WHERE d.CarteiraId = c.CarteiraId 
                              AND d.TickerId = c.TickerId
                              AND d.ordem_operacao_reversa < c.ordem_operacao_reversa)
                ELSE c.quantidade
            END AS quantidade_considerar,
            -- Bonificações têm valor total zerado, subscrições têm valor normal
            (c.valor_ajustado * c.quantidade + c.taxas_ajustadas) AS valor_total_operacao
        FROM operacoes_com_acumulado c
        JOIN saldo_atual s ON c.CarteiraId = s.CarteiraId AND c.TickerId = s.TickerId
        WHERE (SELECT COALESCE(SUM(d.quantidade), 0) 
               FROM operacoes_com_acumulado d 
               WHERE d.CarteiraId = c.CarteiraId 
               AND d.TickerId = c.TickerId
               AND d.ordem_operacao_reversa < c.ordem_operacao_reversa) < s.saldo
    ),
    
    -- 5. Calcula preço médio e valor investido com base nas últimas operações
    dados_ativos AS (
        SELECT 
            p.CarteiraId,
            p.TickerId,
            -- Preço médio (considera compras e subscrições, bonificações não entram no cálculo)
            SUM(CASE WHEN p.TipoOperacaoId IN (1, 4) THEN p.quantidade_considerar * p.valor_ajustado + 
                (p.taxas_ajustadas * (p.quantidade_considerar/p.quantidade)) ELSE 0 END) / 
            SUM(p.quantidade_considerar) AS preco_medio,
            -- Quantidade atual
            MAX(p.saldo_atual) AS quantidade,
            -- Valor investido (soma de compras e subscrições)
            SUM(CASE WHEN p.TipoOperacaoId IN (1, 4) THEN p.quantidade_considerar * p.valor_ajustado + 
                (p.taxas_ajustadas * (p.quantidade_considerar/p.quantidade)) ELSE 0 END) AS investido
        FROM operacoes_parciais p
        WHERE p.quantidade_considerar > 0
        GROUP BY p.CarteiraId, p.TickerId
    ),
    
    -- 6. Calcula o lucro realizado (apenas vendas válidas)
    lucro_realizado AS (
        SELECT 
            v.CarteiraId,
            v.TickerId,
            SUM(v.quantidade * v.valor_unitario - v.quantidade * 
                (SELECT SUM(CASE WHEN c.TipoOperacaoId IN (1,4) THEN c.quantidade * c.valor_unitario + c.taxas ELSE 0 END) / 
                 SUM(CASE WHEN c.TipoOperacaoId IN (1,3,4) THEN c.quantidade ELSE 0 END)
                 FROM operacaos c
                 WHERE c.TickerId = v.TickerId
                 AND c.CarteiraId = v.CarteiraId
                 AND c.TipoOperacaoId IN (1,3,4)  -- Considera compras, bonificações e subscrições
                 AND (c.data < v.data OR (c.data = v.data AND c.id < v.id))) - v.taxas) AS lucro_total
        FROM operacaos v
        WHERE v.TipoOperacaoId = 2  -- 2 = venda
        AND v.CarteiraId = carteira_id
        AND v.TickerId = ticker_id
        -- Verifica se havia saldo suficiente antes da venda
        AND (SELECT SUM(CASE WHEN TipoOperacaoId IN (1,3,4) THEN quantidade ELSE -quantidade END)
             FROM operacaos 
             WHERE TickerId = v.TickerId
             AND CarteiraId = v.CarteiraId
             AND (data < v.data OR (data = v.data AND id < v.id))) >= v.quantidade
        GROUP BY v.CarteiraId, v.TickerId
    )
    
    -- Insere os dados na tabela Dashboards
    SELECT 
        da.CarteiraId,
        da.TickerId,
        ROUND(da.preco_medio, 2) AS preco_medio,
        da.quantidade,
        ROUND(da.investido, 2) AS investido,
        COALESCE(pr.proventos, 0) AS proventos,
        COALESCE(lr.lucro_total, 0) AS lucro_realizado
    FROM 
        dados_ativos da
    LEFT JOIN
        (
            SELECT 
                p.CarteiraId,
                p.TickerId,
                COALESCE(SUM(p.total), 0) AS proventos
            FROM 
                provento p
            WHERE 
                p.CarteiraId = carteira_id
                AND p.TickerId = ticker_id
            GROUP BY p.CarteiraId, p.TickerId
        ) pr
    ON 
        da.CarteiraId = pr.CarteiraId
        AND da.TickerId = pr.TickerId
    LEFT JOIN
        lucro_realizado lr
    ON 
        da.CarteiraId = lr.CarteiraId
        AND da.TickerId = lr.TickerId;
END;

`;
  
await sequelize.query(sql);
}


// // Função para criar procedimentos armazenados
// async function createStoredProcedures() {
//     const sql = `

// CREATE PROCEDURE atualiza_dashboards(carteira_id INT, ticker_id INT)
// BEGIN
//     -- Remove os dados existentes para a carteira e ticker correspondentes
//     DELETE FROM Dashboards
//     WHERE tickerid = ticker_id
//     AND CarteiraId = carteira_id;
    
//     -- Calcula todos os indicadores com base nas últimas operações
//     INSERT INTO Dashboards (CarteiraId, tickerid, preco_medio, quantidade, investido, proventos, lucro_realizado)
//     WITH 
//     -- 1. Calcula o saldo atual do ativo para a carteira específica
//     saldo_atual AS (
//         SELECT 
//             CarteiraId,
//             TickerId,
//             (SUM(CASE WHEN TipoOperacaoId = 1 THEN quantidade ELSE 0 END) +  -- Compras
//              SUM(CASE WHEN TipoOperacaoId = 3 THEN quantidade ELSE 0 END) +  -- Bonificações
//              SUM(CASE WHEN TipoOperacaoId = 4 THEN quantidade ELSE 0 END) -  -- Subscrições
//              SUM(CASE WHEN TipoOperacaoId = 2 THEN quantidade ELSE 0 END)) AS saldo  -- Vendas
//         FROM operacaos
//         WHERE CarteiraId = carteira_id
//         AND TickerId = ticker_id
//         GROUP BY CarteiraId, TickerId
//         HAVING saldo > 0
//     ),
    
//     -- 2. Ordena as operações por data DESC (compras, bonificações e subscrições)
//     operacoes_ordenadas AS (
//         SELECT 
//             o.*,
//             ROW_NUMBER() OVER (PARTITION BY o.CarteiraId, o.TickerId ORDER BY o.data DESC, o.id DESC) AS ordem_operacao_reversa,
//             -- Bonificações têm valor zerado, subscrições têm valor normal
//             CASE WHEN o.TipoOperacaoId = 3 THEN 0 ELSE o.valor_unitario END AS valor_ajustado,
//             -- Bonificações têm taxas zeradas, subscrições têm taxas normais
//             CASE WHEN o.TipoOperacaoId = 3 THEN 0 ELSE o.taxas END AS taxas_ajustadas
//         FROM operacaos o
//         WHERE o.TipoOperacaoId IN (1, 3, 4)  -- 1 = compra, 3 = bonificação, 4 = subscrição
//         AND o.CarteiraId = carteira_id
//         AND o.TickerId = ticker_id
//     ),
    
//     -- 3. Calcula o acumulado começando pelas operações mais recentes
//     operacoes_com_acumulado AS (
//         SELECT 
//             a.*,
//             (SELECT SUM(b.quantidade) 
//              FROM operacoes_ordenadas b 
//              WHERE b.CarteiraId = a.CarteiraId 
//              AND b.TickerId = a.TickerId
//              AND b.ordem_operacao_reversa <= a.ordem_operacao_reversa) AS acumulado_reverso
//         FROM operacoes_ordenadas a
//     ),
    
//     -- 4. Determina quanto de cada operação deve ser considerado (começando pelas últimas)
//     operacoes_parciais AS (
//         SELECT 
//             c.*,
//             s.saldo AS saldo_atual,
//             CASE
//                 WHEN (SELECT COALESCE(SUM(d.quantidade), 0) 
//                      FROM operacoes_com_acumulado d 
//                      WHERE d.CarteiraId = c.CarteiraId 
//                      AND d.TickerId = c.TickerId
//                      AND d.ordem_operacao_reversa < c.ordem_operacao_reversa) >= s.saldo THEN 0
//                 WHEN c.acumulado_reverso > s.saldo THEN 
//                     s.saldo - (SELECT COALESCE(SUM(d.quantidade), 0) 
//                               FROM operacoes_com_acumulado d 
//                               WHERE d.CarteiraId = c.CarteiraId 
//                               AND d.TickerId = c.TickerId
//                               AND d.ordem_operacao_reversa < c.ordem_operacao_reversa)
//                 ELSE c.quantidade
//             END AS quantidade_considerar,
//             -- Bonificações têm valor total zerado, subscrições têm valor normal
//             (c.valor_ajustado * c.quantidade + c.taxas_ajustadas) AS valor_total_operacao
//         FROM operacoes_com_acumulado c
//         JOIN saldo_atual s ON c.CarteiraId = s.CarteiraId AND c.TickerId = s.TickerId
//         WHERE (SELECT COALESCE(SUM(d.quantidade), 0) 
//                FROM operacoes_com_acumulado d 
//                WHERE d.CarteiraId = c.CarteiraId 
//                AND d.TickerId = c.TickerId
//                AND d.ordem_operacao_reversa < c.ordem_operacao_reversa) < s.saldo
//     ),
    
//     -- 5. Calcula preço médio e valor investido com base nas últimas operações
//     dados_ativos AS (
//         SELECT 
//             p.CarteiraId,
//             p.TickerId,
//             -- Preço médio (considera compras e subscrições, bonificações não entram no cálculo)
//             SUM(CASE WHEN p.TipoOperacaoId IN (1, 4) THEN p.quantidade_considerar * p.valor_ajustado + 
//                 (p.taxas_ajustadas * (p.quantidade_considerar/p.quantidade)) ELSE 0 END) / 
//             SUM(p.quantidade_considerar) AS preco_medio,
//             -- Quantidade atual
//             MAX(p.saldo_atual) AS quantidade,
//             -- Valor investido (soma de compras e subscrições)
//             SUM(CASE WHEN p.TipoOperacaoId IN (1, 4) THEN p.quantidade_considerar * p.valor_ajustado + 
//                 (p.taxas_ajustadas * (p.quantidade_considerar/p.quantidade)) ELSE 0 END) AS investido
//         FROM operacoes_parciais p
//         WHERE p.quantidade_considerar > 0
//         GROUP BY p.CarteiraId, p.TickerId
//     ),
    
//     -- 6. Calcula o lucro realizado (apenas vendas válidas)
//     lucro_realizado AS (
//         SELECT 
//             v.CarteiraId,
//             v.TickerId,
//             SUM(v.quantidade * v.valor_unitario - v.quantidade * 
//                 (SELECT SUM(CASE WHEN c.TipoOperacaoId IN (1,4) THEN c.quantidade * c.valor_unitario + c.taxas ELSE 0 END) / 
//                  SUM(CASE WHEN c.TipoOperacaoId IN (1,3,4) THEN c.quantidade ELSE 0 END)
//                  FROM operacaos c
//                  WHERE c.TickerId = v.TickerId
//                  AND c.CarteiraId = v.CarteiraId
//                  AND c.TipoOperacaoId IN (1,3,4)  -- Considera compras, bonificações e subscrições
//                  AND (c.data < v.data OR (c.data = v.data AND c.id < v.id))) - v.taxas) AS lucro_total
//         FROM operacaos v
//         WHERE v.TipoOperacaoId = 2  -- 2 = venda
//         AND v.CarteiraId = carteira_id
//         AND v.TickerId = ticker_id
//         -- Verifica se havia saldo suficiente antes da venda
//         AND (SELECT SUM(CASE WHEN TipoOperacaoId IN (1,3,4) THEN quantidade ELSE -quantidade END)
//              FROM operacaos 
//              WHERE TickerId = v.TickerId
//              AND CarteiraId = v.CarteiraId
//              AND (data < v.data OR (data = v.data AND id < v.id))) >= v.quantidade
//         GROUP BY v.CarteiraId, v.TickerId
//     )
    
//     -- Insere os dados na tabela Dashboards
//     SELECT 
//         da.CarteiraId,
//         da.TickerId,
//         ROUND(da.preco_medio, 2) AS preco_medio,
//         da.quantidade,
//         ROUND(da.investido, 2) AS investido,
//         COALESCE(pr.proventos, 0) AS proventos,
//         COALESCE(lr.lucro_total, 0) AS lucro_realizado
//     FROM 
//         dados_ativos da
//     LEFT JOIN
//         (
//             SELECT 
//                 p.CarteiraId,
//                 p.TickerId,
//                 COALESCE(SUM(p.total), 0) AS proventos
//             FROM 
//                 provento p
//             WHERE 
//                 p.CarteiraId = carteira_id
//                 AND p.TickerId = ticker_id
//             GROUP BY p.CarteiraId, p.TickerId
//         ) pr
//     ON 
//         da.CarteiraId = pr.CarteiraId
//         AND da.TickerId = pr.TickerId
//     LEFT JOIN
//         lucro_realizado lr
//     ON 
//         da.CarteiraId = lr.CarteiraId
//         AND da.TickerId = lr.TickerId;
// END;

// `;
  
// await sequelize.query(sql);
// }

// // Função para criar procedimentos armazenados
// async function createStoredProcedures() {
//     const sql = `
//       CREATE PROCEDURE atualiza_dashboards(carteira_id INT, ticker_id INT)
//       BEGIN
//           -- Remove os dados existentes para a carteira e ticker correspondentes
//           DELETE FROM Dashboards
//           WHERE tickerid = ticker_id
//           AND CarteiraId = carteira_id;
  
//           -- Reinsere os novos dados atualizados
//           INSERT INTO Dashboards (CarteiraId, tickerid, preco_medio, quantidade, investido, proventos)
//           SELECT 
//               operacoes.CarteiraId,
//               operacoes.tickerid,
//               ROUND(operacoes.preco_medio, 2) AS preco_medio,
//               operacoes.qtde,
//               operacoes.investido,
//               COALESCE(proventos.proventos, 0) AS proventos
//           FROM 
//               (
//                   SELECT 
//                       o.CarteiraId, 
//                       o.tickerid, 
//                       SUM(o.quantidade * o.valor_unitario + o.taxas) / SUM(o.quantidade) AS preco_medio, 
//                       (SUM(CASE WHEN o.tipooperacaoId = 1 THEN quantidade ELSE 0 END) +
//                       SUM(CASE WHEN o.tipooperacaoId = 3 THEN quantidade ELSE 0 END) -
// 					  SUM(CASE WHEN o.tipooperacaoId = 2 THEN quantidade ELSE 0 END)) AS qtde, 
//                       SUM(o.quantidade * o.valor_unitario + o.taxas) AS investido
//                   FROM 
//                       operacaos o
//                   WHERE 
//                       o.CarteiraId = carteira_id
//                       AND o.tickerid = ticker_id
//                   GROUP BY o.CarteiraId, o.tickerid
//               ) AS operacoes
//           LEFT JOIN
//               (
//                   SELECT 
//                       p.CarteiraId,
//                       p.tickerid,
//                       COALESCE(SUM(p.total), 0) AS proventos
//                   FROM 
//                       provento p
//                   WHERE 
//                       p.CarteiraId = carteira_id
//                       AND p.tickerid = ticker_id
//                   GROUP BY p.CarteiraId, p.tickerid
//               ) AS proventos
//           ON 
//               operacoes.CarteiraId = proventos.CarteiraId
//               AND operacoes.tickerid = proventos.tickerid;
//       END;
//     `;
  
//     await sequelize.query(sql);
//   }
  

// // Função para criar procedimentos armazenados
// async function createStoredProcedures() {
//     const sql = `

// CREATE PROCEDURE atualiza_dashboards(carteira_id INT, ticker_id INT)
// BEGIN
//     -- Remove os dados existentes para a carteira e ticker correspondentes
//     DELETE FROM Dashboards
//     WHERE tickerid = ticker_id
//     AND CarteiraId = carteira_id;
    
//     -- Calcula o preço médio baseado nas últimas compras e insere os novos dados
//     INSERT INTO Dashboards (CarteiraId, tickerid, preco_medio, quantidade, investido, proventos)
//     WITH 
//     -- 1. Calcula o saldo atual do ativo para a carteira específica
//     saldo_atual AS (
//         SELECT 
//             CarteiraId,
//             TickerId,
//             (SUM(CASE WHEN TipoOperacaoId = 1 THEN quantidade ELSE 0 END) +
//             (SUM(CASE WHEN TipoOperacaoId = 3 THEN quantidade ELSE 0 END) -
//             SUM(CASE WHEN TipoOperacaoId = 2 THEN quantidade ELSE 0 END))) AS saldo
//         FROM operacaos
//         WHERE CarteiraId = carteira_id
//         AND TickerId = ticker_id
//         GROUP BY CarteiraId, TickerId
//         HAVING saldo > 0
//     ),
    
//     -- 2. Ordena as compras por data DESC (da mais recente para a mais antiga)
//     compras_ordenadas AS (
//         SELECT 
//             o.*,
//             ROW_NUMBER() OVER (PARTITION BY o.CarteiraId, o.TickerId ORDER BY o.data DESC, o.id DESC) AS ordem_compra_reversa
//         FROM operacaos o
//         WHERE o.TipoOperacaoId = 1  -- 1 = compra
//         AND o.CarteiraId = carteira_id
//         AND o.TickerId = ticker_id
//     ),
    
//     -- 3. Calcula o acumulado começando pelas compras mais recentes
//     compras_com_acumulado AS (
//         SELECT 
//             a.*,
//             (SELECT SUM(b.quantidade) 
//              FROM compras_ordenadas b 
//              WHERE b.CarteiraId = a.CarteiraId 
//              AND b.TickerId = a.TickerId
//              AND b.ordem_compra_reversa <= a.ordem_compra_reversa) AS acumulado_reverso
//         FROM compras_ordenadas a
//     ),
    
//     -- 4. Determina quanto de cada compra deve ser considerado (começando pelas últimas)
//     compras_parciais AS (
//         SELECT 
//             c.*,
//             s.saldo AS saldo_atual,
//             CASE
//                 WHEN (SELECT COALESCE(SUM(d.quantidade), 0) 
//                      FROM compras_com_acumulado d 
//                      WHERE d.CarteiraId = c.CarteiraId 
//                      AND d.TickerId = c.TickerId
//                      AND d.ordem_compra_reversa < c.ordem_compra_reversa) >= s.saldo THEN 0
//                 WHEN c.acumulado_reverso > s.saldo THEN 
//                     s.saldo - (SELECT COALESCE(SUM(d.quantidade), 0) 
//                               FROM compras_com_acumulado d 
//                               WHERE d.CarteiraId = c.CarteiraId 
//                               AND d.TickerId = c.TickerId
//                               AND d.ordem_compra_reversa < c.ordem_compra_reversa)
//                 ELSE c.quantidade
//             END AS quantidade_considerar,
//             (c.valor_unitario * c.quantidade + c.taxas) AS valor_total_compra
//         FROM compras_com_acumulado c
//         JOIN saldo_atual s ON c.CarteiraId = s.CarteiraId AND c.TickerId = s.TickerId
//         WHERE (SELECT COALESCE(SUM(d.quantidade), 0) 
//                FROM compras_com_acumulado d 
//                WHERE d.CarteiraId = c.CarteiraId 
//                AND d.TickerId = c.TickerId
//                AND d.ordem_compra_reversa < c.ordem_compra_reversa) < s.saldo
//     ),
    
//     -- 5. Calcula o preço médio com base nas últimas compras
//     preco_medio_calculado AS (
//         SELECT 
//             p.CarteiraId,
//             p.TickerId,
//             SUM(p.quantidade_considerar * p.valor_unitario + 
//                 (p.taxas * (p.quantidade_considerar/p.quantidade))) / 
//             SUM(p.quantidade_considerar) AS preco_medio,
//             MAX(p.saldo_atual) AS quantidade,
//             SUM(p.quantidade_considerar * p.valor_unitario + 
//                 (p.taxas * (p.quantidade_considerar/p.quantidade))) AS investido
//         FROM compras_parciais p
//         WHERE p.quantidade_considerar > 0
//         GROUP BY p.CarteiraId, p.TickerId
//     )
    
//     -- Insere os dados na tabela Dashboards
//     SELECT 
//         pm.CarteiraId,
//         pm.TickerId,
//         ROUND(pm.preco_medio, 2) AS preco_medio,
//         pm.quantidade,
//         ROUND(pm.investido, 2) AS investido,
//         COALESCE(pr.proventos, 0) AS proventos
//     FROM 
//         preco_medio_calculado pm
//     LEFT JOIN
//         (
//             SELECT 
//                 p.CarteiraId,
//                 p.TickerId,
//                 COALESCE(SUM(p.total), 0) AS proventos
//             FROM 
//                 provento p
//             WHERE 
//                 p.CarteiraId = carteira_id
//                 AND p.TickerId = ticker_id
//             GROUP BY p.CarteiraId, p.TickerId
//         ) pr
//     ON 
//         pm.CarteiraId = pr.CarteiraId
//         AND pm.TickerId = pr.TickerId;
// END;    
    
//     `;
  
//     await sequelize.query(sql);
//   }

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
