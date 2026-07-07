// prettier-ignore
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
    TipoAtivoClassificacao,
    Provento,
    Moeda,
    Opcao,
    TipoOperacaoTaxa,
    OperacaoTaxaStatus,    
    TipoOpcaoStatus,
    TipoOpcaoOperacao,
    TipoOpcaoPeriodo,
    Dashboard,
    PosicaoAtivo,
    Corretora,
    Investidor,
    TipoAtivoAgrupamento,
    CaixaOperacaoTaxa,
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
        await TipoOpcaoPeriodo.bulkCreate([
            { nome: 'Mensal', ativo: 'true' },
            { nome: 'Semanal', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const TIPO_OPCAO_PERIODO = {
            MENSAL: 1,
            SEMANAL: 2
        };

        await TipoOpcaoStatus.bulkCreate([
            { nome: 'Em andamento', ativo: 'true' },
            { nome: 'Encerrada', ativo: 'true' },
            { nome: 'Exercido', ativo: 'true' },
            { nome: 'Virou Pó', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const TIPO_OPCAO_STATUS = {
            EM_ANDAMENTO: 1,
            ENCERRADA: 2,
            EXERCIDO: 3,
            VIROU_PO: 4
        };

        await OperacaoTaxaStatus.bulkCreate([
            { nome: 'Em andamento', ativo: 'true' },
            { nome: 'Encerrada', ativo: 'true' },
        ]);

        const OPERACAO_TAXA_STATUS = {
            EM_ANDAMENTO: 1,
            ENCERRADA: 2,
        };

        await TipoOpcaoOperacao.bulkCreate([
            { nome: 'Compra de CALL', ativo: 'true' },
            { nome: 'Compra de PUT', ativo: 'true' },
            { nome: 'Venda de CALL', ativo: 'true' },
            { nome: 'Venda de PUT', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const TIPO_OPCAO_OPERACAO = {
            CC: 1, // Compra de CALL
            CP: 2, // Compra de PUT
            VC: 3, // Venda de CALL
            VP: 4, // Venda de PUT
        };
        
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

        const MOEDA = {
            BRL: 1,
            USD: 2
        };

        await Corretora.bulkCreate([
            { nome: 'Inter', descricao: 'Banco Inter SA', ativo: 'true' },
            { nome: 'CM', descricao: 'CM Capital', ativo: 'true' },
            { nome: 'BTG', descricao: 'Banco BTG', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const CORRETORA = {
            INTER: 1, 
            CM: 2,
            BTG: 3,
        };

        await Investidor.bulkCreate([
            { nome: 'Igor', descricao: 'Igor Thiago Marques Mendonça', ativo: 'true' },
            { nome: 'Cris', descricao: 'Crislaine Gruber', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const INVESTIDOR = {
            IGOR: 1,
            CRIS: 2
        };

        await TipoAtivo.bulkCreate([
            { nome: 'Ações', ativo: 'true' },
            { nome: 'FII', ativo: 'true' },
            { nome: 'ETF', ativo: 'true' },
            { nome: 'Stocks', ativo: 'true' },
            { nome: 'ETF USA', ativo: 'true' },
            { nome: 'Cripto', ativo: 'true' },
            { nome: 'Tesouro', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const TIPO_ATIVO = {
            ACAO: 1,
            FII: 2,
            ETF: 3,
            STOCK: 4,
            ETF_USA: 5,
            CRIPTO: 6,
            TESOURO: 7,
        };

        await TipoAtivoClassificacao.bulkCreate([
            { nome: 'Renda Variável', ativo: 'true' },
            { nome: 'Renda Fixa', ativo: 'true' },
        ]);

        const TIPO_ATIVO_CLASSIFICACAO = {
            RENDA_VARIAVEL: 1,
            RENDA_FIXA: 2,
        };

        await TipoAtivoAgrupamento.bulkCreate([
            { nome: 'Ação BR', ativo: 'true' },
            { nome: 'Renda Fixa BR', ativo: 'true' },
            { nome: 'Dólar', ativo: 'true' },
            { nome: 'Ouro', ativo: 'true' },
            { nome: 'FII BR', ativo: 'true' },
            { nome: 'Renda Variável USA', ativo: 'true' },
            { nome: 'Cripto', ativo: 'true' },
        ]);

        const TIPO_ATIVO_AGRUPAMENTO = {
            ACAO_BR: 1,
            RENDA_FIXA_BR: 2,
            DOLAR: 3,
            OURO: 4,
            FII_BR: 5,
            RENDA_VARIAVEL_USA: 6,
            CRIPTO: 7,
            
        };

        await Ticker.bulkCreate([
            { nome: 'ISAE4.SA', descricao: 'ISA ENERGIA BRASIL S.A', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'MSFT', descricao: 'Microsoft Corp', ativo: 'true', TipoAtivoId: TIPO_ATIVO.STOCK, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_VARIAVEL_USA },
            { nome: 'LFTS11.SA', descricao: 'INVESTO TEVA TESOURO SELIC ETF', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_FIXA, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_FIXA_BR },
            { nome: 'NVDA', descricao: 'NVIDIA Corp', ativo: 'true', TipoAtivoId: TIPO_ATIVO.STOCK, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_VARIAVEL_USA },
            { nome: 'MBRF3.SA', descricao: 'Marfrig Global Foods', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'AAPL', descricao: 'Apple Inc', ativo: 'true', TipoAtivoId: TIPO_ATIVO.STOCK, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_VARIAVEL_USA },
            { nome: 'DIRR3.SA', descricao: 'Direcional Engenharia SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'JALL3.SA', descricao: 'JALLES MACHADO S.A.', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'MOVI3.SA', descricao: 'Movida Participacoes SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'EGIE3.SA', descricao: 'Engie Brasil Energia SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'CSNA3.SA', descricao: 'Companhia Siderurgica Nacional', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'TOTS3.SA', descricao: 'Totvs SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'CMIN3.SA', descricao: 'CSN MINERAÇÃO S.A.', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'DMVF3.SA', descricao: 'D1000 Varejo Farma Participacoes SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'BRST3.SA', descricao: 'BRISANET PARTICIPAÇÕES S.A.', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'MILS3.SA', descricao: 'Mills Estruturas e Servicos de Engnhr SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'EMBJ3.SA', descricao: 'Embraer SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'BBSE3.SA', descricao: 'BB Seguridade Participacoes SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'CXSE3.SA', descricao: 'CAIXA SEGURIDADE PARTICIPAÇÕES S.A', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'ITSA4.SA', descricao: 'Itausa SA Preference Shares', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'BBDC4.SA', descricao: 'Banco Bradesco SA Preference Shares', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'BBAS3.SA', descricao: 'Banco do Brasil SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'KEPL3.SA', descricao: 'Kepler Weber SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'SMTO3.SA', descricao: 'Sao Martinho SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'HYPE3.SA', descricao: 'Hypera SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'SAUD3.SA', descricao: 'Bradsaúde SA (Odontoprev)', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'CSMG3.SA', descricao: 'Companhia de Saneamento de Minas Gerais', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'SAPR11.SA', descricao: 'Companhia de Saneamento Parana SANEPAR Brazilian Units', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'CMIG4.SA', descricao: 'Companhia Energetica de Minas Gers CEMIG Preference Shares', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'CYRE3.SA', descricao: 'Cyrela Brazil Realty SA Emprdts e Prtpcs', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'BTLG11.SA', descricao: 'BTG Pactual Logística', ativo: 'true', TipoAtivoId: TIPO_ATIVO.FII, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.FII_BR },
            { nome: 'HGBS11.SA', descricao: 'Hedge Brasil Shopping', ativo: 'true', TipoAtivoId: TIPO_ATIVO.FII, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.FII_BR },
            { nome: 'HSML11.SA', descricao: 'HSI Malls', ativo: 'true', TipoAtivoId: TIPO_ATIVO.FII, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.FII_BR },
            { nome: 'VISC11.SA', descricao: 'Vinci Shopping Centers', ativo: 'true', TipoAtivoId: TIPO_ATIVO.FII, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.FII_BR },
            { nome: 'BTAL11.SA', descricao: 'BTG Pactual Agro Logística', ativo: 'true', TipoAtivoId: TIPO_ATIVO.FII, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.FII_BR },
            { nome: 'RZTR11.SA', descricao: 'FUNDO DE INVESTIMENTO IMOBILIÁRIO RIZA TERRAX', ativo: 'true', TipoAtivoId: TIPO_ATIVO.FII, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.FII_BR },
            { nome: 'GGRC11.SA', descricao: 'GGR COVEPI', ativo: 'true', TipoAtivoId: TIPO_ATIVO.FII, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.FII_BR },
            { nome: 'ETHUSD', descricao: 'ETHER', ativo: 'true', TipoAtivoId: TIPO_ATIVO.CRIPTO, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL },
            { nome: 'BTCUSD', descricao: 'BITCOIN', ativo: 'true', TipoAtivoId: TIPO_ATIVO.CRIPTO, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL },
            { nome: 'SGOV', descricao: 'iShare 0-3 Month Treasure Bond ETF', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF_USA, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_FIXA, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.DOLAR },
            { nome: 'GLD', descricao: 'SPDR Gold Shares', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF_USA, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.OURO },
            { nome: 'IAU', descricao: 'iShares Gold', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF_USA, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.OURO },
            { nome: 'VOO', descricao: 'Vanguard S&P 500', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF_USA, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_VARIAVEL_USA },            
            { nome: 'BOVA11.SA', descricao: 'iShare Bovaci', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL },
            { nome: 'LFTB11.SA', descricao: 'INVESTO ETF', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_FIXA, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_FIXA_BR },
            { nome: 'CONY', descricao: 'YieldMax COIN Option Income Strategy ETF', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF_USA, MoedaId: MOEDA.USD, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.CRIPTO },
            { nome: 'POMO4.SA', descricao: 'Marcopolo SA Preference Shares', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'VAMO3.SA', descricao: 'Vamos Locacao De Caminhoes Maquinas E Equipamentos SA', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'SMAL11.SA', descricao: 'iShares BM&FBovespa Small Cap Fundo de Indice', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'SELIC2029', descricao: 'Tesouro Selic 2029', ativo: 'true', TipoAtivoId: TIPO_ATIVO.TESOURO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_FIXA, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_FIXA_BR },
            { nome: 'IPCA2035', descricao: 'Tesouro IPCA+ 2035', ativo: 'true', TipoAtivoId: TIPO_ATIVO.TESOURO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_FIXA, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.RENDA_FIXA_BR },
            { nome: 'BPAC11.SA', descricao: 'Banco BTG Pactual SA Brazilian Units', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ACAO, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.ACAO_BR },
            { nome: 'GOLD11.SA', descricao: 'TREND ETF LBMA OURO FDO. INV. ÍNDICE - INVEST. EXT', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.OURO },
            { nome: 'USDB11.SA', descricao: 'INVESTO BLOOMBERG US BOND ETF FDO INV IND IE', ativo: 'true', TipoAtivoId: TIPO_ATIVO.ETF, MoedaId: MOEDA.BRL, TipoAtivoClassificacaoId: TIPO_ATIVO_CLASSIFICACAO.RENDA_VARIAVEL, TipoAtivoAgrupamentoId: TIPO_ATIVO_AGRUPAMENTO.DOLAR },

        ]);

        // Criar variáveis constantes para os tickers criados
        const TICKER = {
            ISAE4: 1,
            MSFT: 2,
            LFTS11: 3,
            NVDA: 4,
            MBRF3: 5,
            AAPL: 6,
            DIRR3: 7,
            JALL3: 8,
            MOVI3: 9,
            EGIE3: 10,
            CSNA3: 11,
            TOTS3: 12,
            CMIN3: 13,
            DMVF3: 14,
            BRST3: 15,
            MILS3: 16,
            EMBJ3: 17,
            BBSE3: 18,
            CXSE3: 19,
            ITSA4: 20,
            BBDC4: 21,
            BBAS3: 22,
            KEPL3: 23,
            SMTO3: 24,
            HYPE3: 25,
            SAUD3: 26,
            CSMG3: 27,
            SAPR11: 28,
            CMIG4: 29,
            CYRE3: 30,
            BTLG11: 31,
            HGBS11: 32,
            HSML11: 33,
            VISC11: 34,
            BTAL11: 35,
            RZTR11: 36,
            GGRC11: 37,
            ETHUSD: 38,
            BTCUSD: 39,
            SGOV: 40,
            GLD: 41,
            IAU: 42,
            VOO: 43,
            BOVA11: 44,
            LFTB11: 45,
            CONY: 46,
            POMO4: 47,
            VAMO3: 48,
            SMAL11: 49,
            SELIC2029: 50,
            IPCA2035: 51,
            BPAC11: 52,
            GOLD11: 53,
            USDB11: 54.
        };

        await Carteira.bulkCreate([
            { nome: 'MAGAR Brasil', ativo: 'true' },
            { nome: 'MAGAR USA', ativo: 'true' },
            { nome: 'Diversas', ativo: 'true' },
            { nome: 'AÇÕES CRIS', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const CARTEIRA = {
            MAGAR_BRASIL: 1,
            MAGAR_USA: 2,
            DIVERSAS: 3,
            ACOES_CRIS: 4
        };

        await TipoOperacao.bulkCreate([
            { nome: 'Compra', ativo: 'true' },
            { nome: 'Venda', ativo: 'true' },
            { nome: 'Bonificação', ativo: 'true' },
            { nome: 'Subscrição', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const TIPO_OPERACAO = {
            COMPRA: 1,
            VENDA: 2,
            BONIFICACAO: 3,
            SUBSCRICAO: 4
        };

        await TipoProvento.bulkCreate([
            { nome: 'Dividendos', ativo: 'true' },
            { nome: 'JCP', ativo: 'true' },
            { nome: 'Rendimentos', ativo: 'true' },
        ]);

        // Criar constantes para IDs
        const TIPO_PROVENTO = {
            DIVIDENDOS: 1,
            JCP: 2,
            RENDIMENTOS: 3
        };

        await TipoOperacaoTaxa.create(
            { nome: 'Operação BTG Pactual', ativo: 'true', 
                OperacaoTaxaStatusId: OPERACAO_TAXA_STATUS.EM_ANDAMENTO, 
                TickerId: TICKER.BPAC11,
                data_abertura: '2026-03-26',
                data_encerramento: null,
                caixa: 0.0,
            },
        );

        const OPERACAO_TAXA = {
            BPAC11: 1,
        }

        await CaixaOperacaoTaxa.bulkCreate([

            {
                descricao: 'Aporte inicial',
                data: '2026-03-26',
                valor: 5511.00,
                saldo: 5511.00,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11,
            },
            {
                descricao: 'Compra BPAC11',
                data: '2026-03-26',
                valor: -5511.00,
                saldo: 0,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11,
            },
            {
                descricao: 'Venda CALL D521',
                data: '2026-03-26',
                valor: 435.00,
                saldo: 435.00,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11,
            },
            {
                descricao: 'Recompra CALL D521',
                data: '2026-04-14',
                valor: -1170.00,
                saldo: -735.00,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11,
            },
            {
                descricao: 'Venda CALL E570',
                data: '2026-04-14',
                valor: 798.00,
                saldo: 63.00,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11,
            },

        ]);


        await Opcao.bulkCreate([
            { nome: 'BOVAG136W2', TickerId: TICKER.BOVA11, TipoOpcaoStatusId: 2, data_abertura: '2025-07-01', data_vencimento: '2025-07-11', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 135.72, quantidade: 20, TipoOpcaoOperacaoId: 3, TipoOpcaoPeriodoId: 2, investido: 2714.40, 
                strike: 136.00, premio: 1.52, taxas: 0.03, data_recompra: '2025-07-11', preco_recompra: 0.01, resultado: 30.17 },

            { nome: 'BOVAF138W4', TickerId: TICKER.BOVA11, TipoOpcaoStatusId: 4, data_abertura: '2025-06-18', data_vencimento: '2025-06-27', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 135.72, quantidade: 20, TipoOpcaoOperacaoId: 3, TipoOpcaoPeriodoId: 2, investido: 2714.40, 
                strike: 138.00, premio: 0.59, taxas: 0.00, resultado: 11.80 },

            { nome: 'BBDCT154W1', TickerId: TICKER.BBDC4, TipoOpcaoStatusId: 4, data_abertura: '2025-07-14', data_vencimento: '2025-08-01', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 15.56, quantidade: 1300, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 2, investido: 20228.00, 
                strike: 15.21, premio: 0.19, taxas: 0.30, resultado: 246.70 },

            { nome: 'BOVAH137', TickerId: TICKER.BOVA11, TipoOpcaoStatusId: 2, data_abertura: '2025-07-14', data_vencimento: '2025-08-15', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 135.72, quantidade: 20, TipoOpcaoOperacaoId: 3, TipoOpcaoPeriodoId: 1, investido: 2714.40, 
                strike: 137.00, premio: 1.00, taxas: 0.00, data_recompra: '2025-08-04', preco_recompra: 0.09, resultado: 16.60 },

            { nome: 'CYRET234', TickerId: TICKER.CYRE3, TipoOpcaoStatusId: 2, data_abertura: '2025-07-18', data_vencimento: '2025-08-15', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 24.35, quantidade: 400, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 9740.00, 
                strike: 23.43, premio: 0.32, taxas: 0.24, data_recompra: '2025-07-21', preco_recompra: 0.10, resultado: 87.76 },

            { nome: 'CYRET234', TickerId: TICKER.CYRE3, TipoOpcaoStatusId: 2, data_abertura: '2025-07-18', data_vencimento: '2025-08-15', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 24.35, quantidade: 100, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 2435.00, 
                strike: 23.43, premio: 0.32, taxas: 0.04, data_recompra: '2025-07-23', preco_recompra: 0.14, resultado: 18.00 },

            { nome: 'CYRET234', TickerId: TICKER.CYRE3, TipoOpcaoStatusId: 2, data_abertura: '2025-07-24', data_vencimento: '2025-08-15', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 24.35, quantidade: 500, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 12175.00,
                strike: 23.43, premio: 0.30, taxas: 0.05, data_recompra: '2025-08-07', preco_recompra: 0.09, resultado: 105.00 },

            { nome: 'BBAST194', TickerId: TICKER.BBAS3, TipoOpcaoStatusId: 4, data_abertura: '2025-08-04', data_vencimento: '2025-08-15', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 27.19, quantidade: 200, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 5438.00,
                strike: 19.08, premio: 0.81, taxas: 0, data_recompra: null, preco_recompra: 0, resultado: 162.00 },

            { nome: 'BOVAI136', TickerId: TICKER.BOVA11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-08-04', data_vencimento: '2025-09-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 135.72, quantidade: 20, TipoOpcaoOperacaoId: 3, TipoOpcaoPeriodoId: 1, investido: 2714.40, 
                strike: 136.00, premio: 1.18, taxas: 12.83, data_recompra: null, preco_recompra: 0, resultado: 16.37 },

            { nome: 'CYREU239', TickerId: TICKER.CYRE3, TipoOpcaoStatusId: 2, data_abertura: '2025-08-11', data_vencimento: '2025-09-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 24.35, quantidade: 800, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 19480.00,
                strike: 23.93, premio: 0.53, taxas: 0.55, data_recompra: '2025-08-28', preco_recompra: 0.06, resultado: 376.00 },

            { nome: 'BBDCT160W5', TickerId: TICKER.BBDC4, TipoOpcaoStatusId: 2, data_abertura: '2025-08-12', data_vencimento: '2025-08-29', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 15.56, quantidade: 1300, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 2, investido: 20228.00, 
                strike: 15.98, premio: 0.19, taxas: 0.30, data_recompra: '2025-08-26', preco_recompra: 0.05, resultado: 182.00  },

            { nome: 'BBAST200W5', TickerId: TICKER.BBAS3, TipoOpcaoStatusId: 2, data_abertura: '2025-08-19', data_vencimento: '2025-08-29', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 27.19, quantidade: 200, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 2, investido: 5438.00,
                strike: 20, premio: 0.49, taxas: 0.24, data_recompra: '2025-08-27', preco_recompra: 0.09, resultado: 80.00 },

            { nome: 'BBDCU160W1', TickerId: TICKER.BBDC4, TipoOpcaoStatusId: 2, data_abertura: '2025-08-26', data_vencimento: '2025-09-05', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 15.56, quantidade: 1300, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 2, investido: 20228.00, 
                strike: 15.98, premio: 0.14, taxas: 0.68, data_recompra: '2025-08-29', preco_recompra: 0.03, resultado: 143.00  },

            { nome: 'CMIGU119', TickerId: TICKER.CMIG4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-08-26', data_vencimento: '2025-09-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 10.96, quantidade: 600, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 6576.00,
                strike: 11.08, premio: 0.24, taxas: 0.28, data_recompra: '2025-09-17', preco_recompra: 0.02, resultado: 132.00 },

            { nome: 'BBASU215W2', TickerId: TICKER.BBAS3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.VIROU_PO, data_abertura: '2025-08-29', data_vencimento: '2025-09-12', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 27.19, quantidade: 200, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.CP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 5438.00,
                strike: 21.50, premio: 0.56, taxas: 0.14, data_recompra: null, preco_recompra: 0, resultado: -112.00 },

            { nome: 'ITSAU114', TickerId: TICKER.ITSA4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-09-01', data_vencimento: '2025-09-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 11.25, quantidade: 2000, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 22500.00,
                strike: 11.17, premio: 0.20, taxas: 0.52, data_recompra: '2025-09-17', preco_recompra: 0.02, resultado: 396.00 },

            { nome: 'BBSEU350', TickerId: TICKER.BBSE3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-09-02', data_vencimento: '2025-09-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM,
                preco_aquisicao: 37.94, quantidade: 200, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: 1, investido: 7588.00,
                strike: 33.11, premio: 0.79, taxas: 31.62, data_recompra: null, preco_recompra: 0, resultado: 158.00, 
                preco_ativo_na_compra: 32.16, preco_ativo_no_encerramento: 32.92 },

            { nome: 'POMOI930', TickerId: TICKER.POMO4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-09-02', data_vencimento: '2025-09-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER,
                preco_aquisicao: 8.75, quantidade: 100, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 875.00,
                strike: 9.15, premio: 0.28, taxas: 17.68, data_recompra: null, preco_recompra: 0, resultado: 10.32 },
                
            { nome: 'ODPVI135', TickerId: TICKER.SAUD3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.VIROU_PO, data_abertura: '2025-09-04', data_vencimento: '2025-09-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER,
                preco_aquisicao: 12.23, quantidade: 900, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 11007.00,
                strike: 13.34, premio: 0.25, taxas: 0.29, data_recompra: null, preco_recompra: 0, resultado: 225.00 },

            { nome: 'BBASV225W1', TickerId: TICKER.BBAS3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-09-22', data_vencimento: '2025-10-03', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 27.19, quantidade: 200, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 5438.00,
                strike: 22.50, premio: 1.06, taxas: 0.28, data_recompra: '2025-10-02', preco_recompra: 0.35, resultado: 142,
                preco_ativo_no_encerramento: 22.22 },

            { nome: 'ITSAV115W1', TickerId: TICKER.ITSA4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-09-22', data_vencimento: '2025-10-03', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 11.25, quantidade: 2000, TipoOpcaoOperacaoId: 4, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 22500.00,
                strike: 11.48, premio: 0.25, taxas: 0.77, data_recompra: '2025-09-30', preco_recompra: 0.05, resultado: 400.00, 
                preco_ativo_no_encerramento: 11.61 },

            { nome: 'CMIGV125', TickerId: TICKER.CMIG4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-09-23', data_vencimento: '2025-10-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 10.96, quantidade: 600, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 6576.00,
                strike: 11.75, premio: 0.39, taxas: 0.30, data_recompra: null, preco_recompra: 0, resultado: 234.00,
                preco_ativo_na_compra: 11.42, preco_ativo_no_encerramento: 10.83 },

            { nome: 'BBDCV174W1', TickerId: TICKER.BBDC4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-09-25', data_vencimento: '2025-10-03', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 15.56, quantidade: 1300, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 20228.00, 
                strike: 17.46, premio: 0.13, taxas: 0.27, data_recompra: '2025-09-30', preco_recompra: 0.03, resultado: 130,
                preco_ativo_no_encerramento: 17.82 },

            { nome: 'CMIGV125', TickerId: TICKER.CMIG4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-09-26', data_vencimento: '2025-10-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 10.96, quantidade: 400, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 4384.00,
                strike: 11.75, premio: 0.49, taxas: 0, data_recompra: null, preco_recompra: 0, resultado: 196.00,
                preco_ativo_na_compra: 11.26, preco_ativo_no_encerramento: 10.83 },

            { nome: 'HYPEV230', TickerId: TICKER.HYPE3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-09-26', data_vencimento: '2025-10-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 29.60, quantidade: 300, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 8800.00,
                strike: 23.00, premio: 0.64, taxas: 0, data_recompra: null, preco_recompra: 0, resultado: 192.00,
                preco_ativo_na_compra: 23.14, preco_ativo_no_encerramento: 21.94 },

            { nome: 'BBDCV179W2', TickerId: TICKER.BBDC4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-09-30', data_vencimento: '2025-10-10', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 15.56, quantidade: 1300, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 20228.00, 
                strike: 17.71, premio: 0.22, taxas: 1.59, data_recompra: '2025-10-09', preco_recompra: 0.59, resultado: -481.00,
                preco_ativo_na_compra: 17.78, preco_ativo_no_encerramento: 17.09 },

            { nome: 'ITSAV115W2', TickerId: TICKER.ITSA4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-09-30', data_vencimento: '2025-10-10', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 11.25, quantidade: 2200, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 24750.00,
                strike: 11.50, premio: 0.13, taxas: 0.28, data_recompra: null, preco_recompra: 0, resultado: 0, 
                preco_ativo_na_compra: 11.52, preco_ativo_no_encerramento: 10.95 },

            { nome: 'VAMOJ370', TickerId: TICKER.VAMO3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.VIROU_PO, data_abertura: '2025-09-30', data_vencimento: '2025-10-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 3.49, quantidade: 1000, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.CC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 70.00,
                strike: 3.70, premio: 0.07, taxas: 0.03, data_recompra: null, preco_recompra: 0, resultado: -70.00, 
                preco_ativo_na_compra: 3.49, preco_ativo_no_encerramento: 2.95 },

            { nome: 'ODPVJ135', TickerId: TICKER.SAUD3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-10-01', data_vencimento: '2025-10-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER,
                preco_aquisicao: 12.23, quantidade: 900, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 11007.00,
                strike: 13.30, premio: 0.32, taxas: 0.37, data_recompra: '2025-10-15', preco_recompra: 0.20, resultado: 108.00,
                preco_ativo_na_compra: 13.31, preco_ativo_no_encerramento: 13.44 },

            { nome: 'BBASV229', TickerId: TICKER.BBAS3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-10-02', data_vencimento: '2025-10-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 27.19, quantidade: 200, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 5438.00,
                strike: 22.57, premio: 0.62, taxas: 0, data_recompra: null, preco_recompra: 0, resultado: 124.00,
                preco_ativo_na_compra: 22.27, preco_ativo_no_encerramento: 20.90 },

            { nome: 'BBDCW181', TickerId: TICKER.BBDC4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-10-09', data_vencimento: '2025-11-21', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 15.56, quantidade: 1300, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 20228.00, 
                strike: 17.84, premio: 0.92, taxas: 1.47, data_recompra: '2025-11-05', preco_recompra: 0.09, resultado: 1079.00,
                preco_ativo_na_compra: 17.09, preco_ativo_no_encerramento: 18.59,
                rolagem_de_id: 26 },

            { nome: 'ODPVK133', TickerId: TICKER.SAUD3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-10-15', data_vencimento: '2025-11-21', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER,
                preco_aquisicao: 12.23, quantidade: 900, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 11007.00,
                strike: 13.30, premio: 0.60, taxas: 0.42, data_recompra: '2025-11-05', preco_recompra: 0.06, resultado: 486.00,
                preco_ativo_na_compra: 13.47, preco_ativo_no_encerramento: 12.20 },

            { nome: 'SMALX101', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-10-28', data_vencimento: '2025-12-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 107.83, quantidade: 27, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 2911.41,
                strike: 101.00, premio: 0.73, taxas: 0.03, data_recompra: '2025-11-28', preco_recompra: 0.12, resultado: 13.23,
                preco_ativo_na_compra: 107.83, preco_ativo_no_encerramento: 116.10 },

            { nome: 'SMALL114', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-10-28', data_vencimento: '2025-12-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 107.83, quantidade: 27, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 2911.41,
                strike: 114.00, premio: 1.56, taxas: 0.18, data_recompra: '2025-11-28', preco_recompra: 3.86, resultado: -62.10,
                preco_ativo_na_compra: 107.83, preco_ativo_no_encerramento: 116.10 },

            { nome: 'ITSAL120', TickerId: TICKER.ITSA4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-11-06', data_vencimento: '2025-12-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 11.37, quantidade: 2200, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 25014.00,
                // strike: 12.00
                strike: 11.19
                , premio: 0.31, taxas: 0.28, data_recompra: '2025-12-12', preco_recompra: 0.66, resultado: -792.00, 
                preco_ativo_na_compra: 11.89, preco_ativo_no_encerramento: 11.81 },

            { nome: 'CMIGK131', TickerId: TICKER.CMIG4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-11-06', data_vencimento: '2025-11-21', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 11.22, quantidade: 1000, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 11220,
                strike: 12.15, premio: 0.14, taxas: 0.10, data_recompra: '2025-11-14', preco_recompra: 0.03, resultado: 110.00,
                preco_ativo_na_compra: 11.92, preco_ativo_no_encerramento: 11.40 },

            { nome: 'SMALA116', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-11-28', data_vencimento: '2026-01-16', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 107.83, quantidade: 27, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 2911.41,
                strike: 116.00, premio: 4.19, taxas: 0.18, data_recompra: '2025-12-17', preco_recompra: 1.25, resultado: 79.20,
                preco_ativo_na_compra: 116.10, preco_ativo_no_encerramento: 110.19 ,
                rolagem_de_id: 34 },

            { nome: 'SAPRL382', TickerId: TICKER.SAPR11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2025-12-01', data_vencimento: '2025-12-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER,
                preco_aquisicao: 35.73, quantidade: 600, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 21438.00,
                strike: 38.28, premio: 0.42, taxas: 158.65, data_recompra: null, preco_recompra: 0, resultado: 93.35, 
                preco_ativo_na_compra: 37.05, preco_ativo_no_encerramento: 38.97 },

            { nome: 'ITSAA126', TickerId: TICKER.ITSA4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-12-12', data_vencimento: '2026-01-16', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 11.37, quantidade: 2200, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 25014.00,
                strike_inicial: 11.83, strike: 11.60, premio: 0.36, taxas: 2.12, data_recompra: '2026-01-14', preco_recompra: 0.40, resultado: -105.60, 
                preco_ativo_na_compra: 11.81, preco_ativo_no_encerramento: 11.97,
                rolagem_de_id: 35 },

            { nome: 'SMALA116', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2025-12-29', data_vencimento: '2026-01-16', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 107.83, quantidade: 27, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 2911.41,
                strike: 116.00, premio: 0.89, taxas: 0.01, data_recompra: '2026-01-16', preco_recompra: 0.01, resultado: 23.49,
                preco_ativo_na_compra: 111.47, preco_ativo_no_encerramento: 112.57 },

            { nome: 'ITSAB130', TickerId: TICKER.ITSA4, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EXERCIDO, data_abertura: '2026-01-14', data_vencimento: '2026-02-20', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 11.37, quantidade: 2200, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 25014.00,
                strike_inicial: null, strike: 11.99, premio: 0.35, taxas: 1.10, data_recompra: null, preco_recompra: 0, resultado: 768.90, 
                preco_ativo_na_compra: 11.97, preco_ativo_no_encerramento: 15.08,
                rolagem_de_id: 39 },
                
            { nome: 'SMALC132', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-02-24', data_vencimento: '2026-03-20', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 107.83, quantidade: 27, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 2911.41,
                strike: 132.00, premio: 2.52, taxas: 0.10, data_recompra: '2026-03-02', preco_recompra: 1.10, resultado: 37.24,
                preco_ativo_na_compra: 129.04, preco_ativo_no_encerramento: 124.65 },

            { nome: 'SMALO115', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-03-12', data_vencimento: '2026-03-20', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 0, quantidade: 63, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 7245.00,
                strike: 115.00, premio: 2.02, taxas: 0.45, data_recompra: '2026-03-20', preco_recompra: 3.35, resultado: -85.11,
                preco_ativo_na_compra: 115.80, preco_ativo_no_encerramento: 111.78 },

            { nome: 'SMALP114W1', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-03-20', data_vencimento: '2026-04-02', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 0, quantidade: 63, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.SEMANAL, investido: 6793.29,
                strike: 114.00, premio: 3.80, taxas: 0.31, data_recompra: '2026-03-31', preco_recompra: 0.24, resultado: 223.97,
                preco_ativo_na_compra: 111.85, preco_ativo_no_encerramento: 119.39,
                rolagem_de_id: 43 },

            { nome: 'BPACD521', TickerId: TICKER.BPAC11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-03-26', data_vencimento: '2026-04-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 55.11, quantidade: 100, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 5511.00,
                strike: 52.19, premio: 4.35, taxas: 0.59, data_recompra: '2026-04-15', preco_recompra: 11.70, resultado: -735.59,
                preco_ativo_na_compra: 55.11, preco_ativo_no_encerramento: 63.84,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11,
            },

            { nome: 'BPACE570', TickerId: TICKER.BPAC11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-04-15', data_vencimento: '2026-05-15', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 63.87, quantidade: 100, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 6387.00,
                strike: 57.05, premio: 7.98, taxas: 0.59, data_recompra: '2026-05-12', preco_recompra: 0.86, resultado: 710.25,
                preco_ativo_na_compra: 63.87, preco_ativo_no_encerramento: 56.98,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11, rolagem_de_id: 45,
            },

            { nome: 'CYREQ242', TickerId: TICKER.CYRE3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-04-28', data_vencimento: '2026-05-15', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 24.16, quantidade: 400, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 9664.00,
                strike: 24.25, premio: 0.92, taxas: 1.32, data_recompra: '2026-05-13', preco_recompra: 1.69, resultado: -308.39,
                preco_ativo_na_compra: 24.16, preco_ativo_no_encerramento: 22.57,                
            },

            { nome: 'BPACF525', TickerId: TICKER.BPAC11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-05-12', data_vencimento: '2026-06-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 57.31, quantidade: 100, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 5731.00,
                strike: 52.55, premio: 5.77, taxas: 0.84, data_recompra: '2026-06-17', preco_recompra: 0.22, resultado: 554.32,
                preco_ativo_na_compra: 57.31, preco_ativo_no_encerramento: 51.67,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11, rolagem_de_id: 46,
            },

            { nome: 'CYRER240', TickerId: TICKER.CYRE3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-05-13', data_vencimento: '2026-06-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 22.73, quantidade: 400, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 9092.00,
                strike: 24.05, premio: 1.82, taxas: 0.93, data_recompra: '2026-06-16', preco_recompra: 2.61, resultado: -316.00,
                preco_ativo_na_compra: 22.73, preco_ativo_no_encerramento: 21.42,
                rolagem_de_id: 47,
            },

            { nome: 'SMALR110', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.ENCERRADA, data_abertura: '2026-05-14', data_vencimento: '2026-06-19', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 112.08, quantidade: 63, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 7067.97,
                strike: 110.00, premio: 2.51, taxas: 0.19, data_recompra: '2026-06-16', preco_recompra: 3.18, resultado: -42.21,
                preco_ativo_na_compra: 112.08, preco_ativo_no_encerramento: 106.95,
            },

            { nome: 'SMALS110', TickerId: TICKER.SMAL11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EM_ANDAMENTO, data_abertura: '2026-06-16', data_vencimento: '2026-07-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 106.92, quantidade: 63, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 6735.96,
                strike: 110.00, premio: 4.21, taxas: 0.19, data_recompra: null, preco_recompra: 0, resultado: 0,
                preco_ativo_na_compra: 106.92, preco_ativo_no_encerramento: 0,
                rolagem_de_id: 50,
            },

            { nome: 'CYRES239', TickerId: TICKER.CYRE3, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EM_ANDAMENTO, data_abertura: '2026-06-16', data_vencimento: '2026-07-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 21.25, quantidade: 400, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VP, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 8500.00,
                strike: 23.95, premio: 2.63, taxas: 0.93, data_recompra: null, preco_recompra: 0, resultado: 0,
                preco_ativo_na_compra: 22.73, preco_ativo_no_encerramento: 0,
                rolagem_de_id: 49,
            },

            { nome: 'BPACG479', TickerId: TICKER.BPAC11, TipoOpcaoStatusId: TIPO_OPCAO_STATUS.EM_ANDAMENTO, data_abertura: '2026-06-17', data_vencimento: '2026-07-17', InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG,
                preco_aquisicao: 51.67, quantidade: 100, TipoOpcaoOperacaoId: TIPO_OPCAO_OPERACAO.VC, TipoOpcaoPeriodoId: TIPO_OPCAO_PERIODO.MENSAL, investido: 5167.00,
                strike: 47.94, premio: 4.69, taxas: 0.25, data_recompra: null, preco_recompra: 0, resultado: 0,
                preco_ativo_na_compra: 51.67, preco_ativo_no_encerramento: 0,
                TipoOperacaoTaxaId: OPERACAO_TAXA.BPAC11, rolagem_de_id: 48,
            },

            ]);

        // Não é possível usar bulkCreate para vários causa do ID composto
        await PosicaoAtivo.bulkCreate([
            { TickerId: TICKER.SGOV, data_abertura: '2024-03-19', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 1
            { TickerId: TICKER.GLD, data_abertura: '2024-03-19', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 2
            // CSMG4
            { TickerId: TICKER.CMIG4, data_abertura: '2024-03-20', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 3
            // CSMG3
            { TickerId: TICKER.CSMG3, data_abertura: '2024-03-20', data_fechamento: '2024-07-30', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 4
            { TickerId: TICKER.CSMG3, data_abertura: '2024-07-31', data_fechamento: '2024-09-12', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 5
            { TickerId: TICKER.CSMG3, data_abertura: '2024-09-23', data_fechamento: '2024-11-29', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 6
            { TickerId: TICKER.CSMG3, data_abertura: '2024-12-02', data_fechamento: '2025-01-30', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 7
            { TickerId: TICKER.CSMG3, data_abertura: '2025-01-31', data_fechamento: '2025-05-30', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 8
            { TickerId: TICKER.CSMG3, data_abertura: '2025-06-04', data_fechamento: '2025-09-25', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 9
            // BBAS3
            { TickerId: TICKER.BBAS3, data_abertura: '2024-03-20', data_fechamento: '2025-03-28', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 10
            { TickerId: TICKER.BBAS3, data_abertura: '2025-04-09', data_fechamento: '2025-04-30', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 11
            { TickerId: TICKER.BBAS3, data_abertura: '2025-05-02', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 12
            // BBSE3
            { TickerId: TICKER.BBSE3, data_abertura: '2024-03-20', data_fechamento: '2025-01-27', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 13
            { TickerId: TICKER.BBSE3, data_abertura: '2025-05-19', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 14
            // CXSE3
            { TickerId: TICKER.CXSE3, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 15
            // HYPE3
            { TickerId: TICKER.HYPE3, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 16
            // IAU
            { TickerId: TICKER.IAU, data_abertura: '2024-03-12', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_USA }, // 17
            // ISAE4
            { TickerId: TICKER.ISAE4, data_abertura: '2024-03-20', data_fechamento: '2025-11-28', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 18
            // ITSA4
            { TickerId: TICKER.ITSA4, data_abertura: '2024-03-20', data_fechamento: '2025-08-29', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 19
            // KEPL3
            { TickerId: 23, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 20
            // SAUD3
            { TickerId: TICKER.SAUD3, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 21
            // SAPR11
            { TickerId: TICKER.SAPR11, data_abertura: '2024-03-20', data_fechamento: '2024-08-07', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 22
            { TickerId: TICKER.SAPR11, data_abertura: '2024-08-08', data_fechamento: '2025-12-19', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 23
            // SMTO3
            { TickerId: 24, data_abertura: '2024-03-20', data_fechamento: '2024-06-19', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 24
            { TickerId: 24, data_abertura: '2024-07-02', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 25
            // CONY
            { TickerId: TICKER.CONY, data_abertura: '2025-07-29', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 26
            // VOO
            { TickerId: TICKER.VOO, data_abertura: '2024-03-12', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_USA }, // 27
            // BRST3
            { TickerId: 15, data_abertura: '2024-05-13', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 28
            // DMVF3
            { TickerId: 14, data_abertura: '2024-05-16', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 29
            // CSNA3
            { TickerId: 11, data_abertura: '2024-05-24', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 30
            // BOVA11
            { TickerId: TICKER.BOVA11, data_abertura: '2025-06-18', data_fechamento: '2025-09-19', CarteiraId: CARTEIRA.DIVERSAS }, // 31
            // MSFT
            { TickerId: TICKER.MSFT, data_abertura: '2025-02-14', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 32
            // NVDA
            { TickerId: TICKER.NVDA, data_abertura: '2025-02-03', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 33
            // AAPL
            { TickerId: TICKER.AAPL, data_abertura: '2025-05-21', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 34
            // LFTS11
            { TickerId: TICKER.LFTS11, data_abertura: '2025-02-10', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 35
            // LFTB11
            { TickerId: TICKER.LFTB11, data_abertura: '2025-08-04', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 36
            // JALL3
            { TickerId: 8, data_abertura: '2024-10-07', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 37
            // MBRF3
            { TickerId: TICKER.MBRF3, data_abertura: '2024-10-07', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 38
            // BBDC4
            { TickerId: TICKER.BBDC4, data_abertura: '2024-03-20', data_fechamento: '2025-05-26', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 39
            // CYRE3
            { TickerId: TICKER.CYRE3, data_abertura: '2024-03-20', data_fechamento: '2024-05-15', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 40
            { TickerId: TICKER.CYRE3, data_abertura: '2024-05-16', data_fechamento: '2025-03-28', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 41
            // CMIN3
            { TickerId: TICKER.CMIN3, data_abertura: '2024-05-20', data_fechamento: '2024-08-21', CarteiraId: CARTEIRA.DIVERSAS }, // 42
            // DIRR3
            { TickerId: TICKER.DIRR3, data_abertura: '2024-08-07', data_fechamento: '2024-11-07', CarteiraId: CARTEIRA.DIVERSAS }, // 43
            // EGIE3
            { TickerId: TICKER.EGIE3, data_abertura: '2024-05-20', data_fechamento:  '2024-06-28', CarteiraId: CARTEIRA.DIVERSAS }, // 44
            // EMBJ3
            { TickerId: TICKER.EMBJ3, data_abertura: '2024-05-06', data_fechamento: '2024-05-21', CarteiraId: CARTEIRA.DIVERSAS }, // 45            
            // MILS3
            { TickerId: TICKER.MILS3, data_abertura: '2024-05-09', data_fechamento: '2025-01-31', CarteiraId: CARTEIRA.DIVERSAS }, // 46
            // TOTS3
            { TickerId: TICKER.TOTS3, data_abertura: '2024-05-22', data_fechamento: '2025-01-31', CarteiraId: CARTEIRA.DIVERSAS }, // 47
            // MOVI3
            { TickerId: TICKER.MOVI3, data_abertura: '2024-02-07', data_fechamento: '2024-04-07', CarteiraId: CARTEIRA.DIVERSAS }, // 48
            // ITSA4
            { TickerId: TICKER.ITSA4, data_abertura: '2025-10-10', data_fechamento: '2026-02-23', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 49
            // ITSA4
            { TickerId: TICKER.SMAL11, data_abertura: '2025-10-28', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 50
            // BBDC4
            { TickerId: TICKER.BBDC4, data_abertura: '2025-11-25', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 51
            { TickerId: TICKER.ISAE4, data_abertura: '2025-12-01', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 52
            { TickerId: TICKER.SAPR11, data_abertura: '2025-12-22', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 53

            { TickerId: TICKER.BBSE3, data_abertura: '2025-09-19', data_fechamento: '2025-12-30', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 54
            { TickerId: TICKER.BBSE3, data_abertura: '2026-01-02', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 55
            { TickerId: TICKER.LFTB11, data_abertura: '2025-09-23', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 56
            { TickerId: TICKER.BBAS3, data_abertura: '2025-10-17', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 57
            { TickerId: TICKER.LFTS11, data_abertura: '2025-04-03', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 58
            { TickerId: TICKER.CYRE3, data_abertura: '2024-01-08', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 59
            { TickerId: TICKER.CYRE3, data_abertura: '2024-01-08', data_fechamento: '2026-02-27', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 60
            { TickerId: TICKER.HGBS11, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 61
            { TickerId: TICKER.BTAL11, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 62
            { TickerId: TICKER.BTLG11, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 63
            { TickerId: TICKER.GGRC11, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 64
            { TickerId: TICKER.HSML11, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 65
            { TickerId: TICKER.RZTR11, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 66
            { TickerId: TICKER.VISC11, data_abertura: '2024-03-20', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 67
            { TickerId: TICKER.SELIC2029, data_abertura: '2024-03-18', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 68
            { TickerId: TICKER.IPCA2035, data_abertura: '2024-03-19', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 69
            { TickerId: TICKER.BBDC4, data_abertura: '2026-02-06', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 70
            { TickerId: TICKER.CMIG4, data_abertura: '2026-02-06', data_fechamento: '2026-03-31' , CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 71
            { TickerId: TICKER.SAUD3, data_abertura: '2026-02-06', data_fechamento: '2026-02-27', CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 72 - CRIS
            { TickerId: TICKER.ITSA4, data_abertura: '2026-02-24', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 73 - IGOR
            { TickerId: TICKER.ITSA4, data_abertura: '2026-02-24', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 74 - CRIS
            { TickerId: TICKER.SAUD3, data_abertura: '2026-03-02', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 75 - CRIS
            { TickerId: TICKER.BBDC4, data_abertura: '2026-03-02', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 76 - CRIS
            { TickerId: TICKER.CYRE3, data_abertura: '2026-03-02', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 77 - CRIS
            { TickerId: TICKER.BPAC11, data_abertura: '2026-03-26', data_fechamento: null, CarteiraId: CARTEIRA.DIVERSAS }, // 78 - IGOR
            { TickerId: TICKER.CMIG4, data_abertura: '2026-04-01', data_fechamento: null , CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 79 - CRIS
            { TickerId: TICKER.SAPR11, data_abertura: '2026-04-13', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 80 - CRIS
            { TickerId: TICKER.GOLD11, data_abertura: '2026-04-17', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 81 - IGOR
            { TickerId: TICKER.USDB11, data_abertura: '2026-05-05', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 82 - IGOR
            { TickerId: TICKER.CXSE3, data_abertura: '2026-05-08', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 83 - CRIS
            { TickerId: TICKER.ISAE4, data_abertura: '2026-05-08', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 84 - CRIS
            { TickerId: TICKER.USDB11, data_abertura: '2026-05-08', data_fechamento: null, CarteiraId: CARTEIRA.MAGAR_BRASIL }, // 85 - CRIS

        ]);

        await Operacao.bulkCreate([

            { data: '2026-05-05', quantidade: 110, valor_unitario: 95.29, taxas: 3.14, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.USDB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 82, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-05-08', quantidade: 95, valor_unitario: 95.68, taxas: 2.73, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.USDB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 85, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-06-09', quantidade: 2, valor_unitario: 100.06, taxas: 0.06, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.USDB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 85, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
        
            { data: '2026-04-17', quantidade: 80, valor_unitario: 25.27, taxas: 0.66, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GOLD11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 81, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-26', quantidade: 100, valor_unitario: 55.11, taxas: 1.64, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BPAC11, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 78, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            
            //FIIs
            { data: '2024-03-20', quantidade: 420, valor_unitario: 22.75, taxas: 2.87, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 61, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-25', quantidade: 80, valor_unitario: 19.89, taxas: 0.48, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 61, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-02-06', quantidade: 75, valor_unitario: 19.98, taxas: 0.45, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 61, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 134, valor_unitario: 71.94, taxas: 2.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 62, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-25', quantidade: 22, valor_unitario: 70.59, taxas: 0.47, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 62, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-04', quantidade: 50, valor_unitario: 72.44, taxas: 1.09, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 62, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-09-30', quantidade: 15, valor_unitario: 80.84, taxas: 0.36, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 62, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-02-06', quantidade: 28, valor_unitario: 88.19, taxas: 0.74, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 62, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-06-09', quantidade: 50, valor_unitario: 86.57, taxas: 1.30, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 62, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 92, valor_unitario: 104.75, taxas: 2.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 63, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-25', quantidade: 16, valor_unitario: 95.49, taxas: 0.46, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 63, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 844, valor_unitario: 11.42, taxas: 2.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 64, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-25', quantidade: 150, valor_unitario: 10.10, taxas: 0.46, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 64, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-23', quantidade: 200, valor_unitario: 10.08, taxas: 0.60, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 64, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-04', quantidade: 350, valor_unitario: 9.56, taxas: 1.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 64, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-06-09', quantidade: 300, valor_unitario: 9.92, taxas: 0.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 64, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 98, valor_unitario: 97.96, taxas: 2.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 65, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-25', quantidade: 18, valor_unitario: 85.08, taxas: 0.46, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 65, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-08', quantidade: 37, valor_unitario: 85.20, taxas: 0.95, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 65, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-08-07', quantidade: 24, valor_unitario: 84.19, taxas: 0.61, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 65, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 101, valor_unitario: 95.19, taxas: 2.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 66, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-25', quantidade: 18, valor_unitario: 85.22, taxas: 0.46, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 66, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-04-07', quantidade: 40, valor_unitario: 87.50, taxas: 1.05, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 66, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-23', quantidade: 22, valor_unitario: 92.25, taxas: 0.61, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 66, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-02-06', quantidade: 26, valor_unitario: 95.47, taxas: 0.74, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 66, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-04-24', quantidade: 9, valor_unitario: 95.71, taxas: 0.26, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 66, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-06-09', quantidade: 40, valor_unitario: 86.06, taxas: 1.07, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 66, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 78, valor_unitario: 123.02, taxas: 2.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 67, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-25', quantidade: 15, valor_unitario: 101.14, taxas: 0.46, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 67, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-02-06', quantidade: 14, valor_unitario: 108.58, taxas: 0.46, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 67, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-18', quantidade: 2.48, valor_unitario: 14494.47, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SELIC2029, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 68, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2024-11-18', quantidade: 0.85, valor_unitario: 15553.11, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SELIC2029, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 68, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-01-22', quantidade: 1.23, valor_unitario: 15868.99, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SELIC2029, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 68, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },

            { data: '2024-03-19', quantidade: 63.12, valor_unitario: 2281.19, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IPCA2035, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 69, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2024-11-18', quantidade: 11.32, valor_unitario: 2208.06, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IPCA2035, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 69, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },

            { data: '2025-02-10', quantidade: 270, valor_unitario: 129.08, taxas: 10.46, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-02-28', quantidade: 100, valor_unitario: 130.06, taxas: 3.90, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-04-03', quantidade: 274, valor_unitario: 131.40, taxas: 15.76, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 58, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-04-09', quantidade: 123, valor_unitario: 131.69, taxas: 4.86, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-04-23', quantidade: 80, valor_unitario: 132.26, taxas: 3.17, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-09', quantidade: 71, valor_unitario: 132.99, taxas: 2.83, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-21', quantidade: 1, valor_unitario: 223.00, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.AAPL, CarteiraId: CARTEIRA.DIVERSAS, cotacao_dolar: 6.18, PosicaoAtivoId: 34, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2025-02-14', quantidade: 1, valor_unitario: 407.05, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.MSFT, CarteiraId: CARTEIRA.DIVERSAS, cotacao_dolar: 5.92, PosicaoAtivoId: 32, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-05', quantidade: 1, valor_unitario: 473.29, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.MSFT, CarteiraId: CARTEIRA.DIVERSAS, cotacao_dolar: 5.52, PosicaoAtivoId: 32, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2025-02-03', quantidade: 2, valor_unitario: 115.62, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.NVDA, CarteiraId: CARTEIRA.DIVERSAS, cotacao_dolar: 5.92, PosicaoAtivoId: 33, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-03-10', quantidade: 3, valor_unitario: 107.62, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.NVDA, CarteiraId: CARTEIRA.DIVERSAS, cotacao_dolar: 5.71, PosicaoAtivoId: 33, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            //BBAS3
            { data: '2024-03-20', quantidade: 200, valor_unitario: 28.08, taxas: 1.68, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-21', quantidade: 144, valor_unitario: 27.92, taxas: 1.21, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-11', quantidade: 100, valor_unitario: 26.02, taxas: 0.78, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-11', quantidade: 66, valor_unitario: 26.02, taxas: 0.52, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-21', quantidade: 500, valor_unitario: 25.65, taxas: 3.85, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-22', quantidade: 600, valor_unitario: 25.68, taxas: 4.62, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-27', quantidade: 10, valor_unitario: 27.66, taxas: 0.08, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-03-28', quantidade: 600, valor_unitario: 28.68, taxas: 5.16, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 10, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2025-04-09', quantidade: 600, valor_unitario: 27.17, taxas: 4.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 11, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-04-30', quantidade: 600, valor_unitario: 28.80, taxas: 5.18, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 11, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-05-02', quantidade: 600, valor_unitario: 28.85, taxas: 5.19, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 12, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-07-07', quantidade: 200, valor_unitario: 22.16, taxas: 1.33, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 12, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-06-09', quantidade: 200, valor_unitario: 19.22, taxas: 1.15, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 12, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            { data: '2024-03-20', quantidade: 300, valor_unitario: 27.87, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 24, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-21', quantidade: 45, valor_unitario: 28.47, taxas: 3.56, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 24, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-06-19', quantidade: 300, valor_unitario: 31.86, taxas: 3.28, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 24, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-06-19', quantidade: 45, valor_unitario: 31.64, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 24, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-02', quantidade: 300, valor_unitario: 32.00, taxas: 3.32, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 25, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-02', quantidade: 30, valor_unitario: 32.00, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 25, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-02', quantidade: 15, valor_unitario: 32.05, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 25, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-09-10', quantidade: 200, valor_unitario: 25.73, taxas: 1.50, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 25, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-31', quantidade: 170, valor_unitario: 23.53, taxas: 1.32, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.MBRF3, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 38, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-13', quantidade: 300, valor_unitario: 4.30, taxas: 0.38, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 15, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 28, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-15', quantidade: 300, valor_unitario: 4.57, taxas: 0.40, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 15, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 28, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-20', quantidade: 200, valor_unitario: 5.27, taxas: 0.31, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIN3, PosicaoAtivoId: 42, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-21', quantidade: 200, valor_unitario: 5.51, taxas: 0.32, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIN3, PosicaoAtivoId: 42, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-08-21', quantidade: 400, valor_unitario: 5.55, taxas: 0.66, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CMIN3, PosicaoAtivoId: 42, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            
            //CSMG3
            { data: '2024-03-20', quantidade: 400, valor_unitario: 20.38, taxas: 2.45, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 4, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-21', quantidade: 71, valor_unitario: 20.89, taxas: 0.44, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 4, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-30', quantidade: 400, valor_unitario: 22.04, taxas: 2.64, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 4, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-30', quantidade: 71, valor_unitario: 22.03, taxas: 0.47, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 4, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-31', quantidade: 400, valor_unitario: 21.31, taxas: 2.56, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 5, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-31', quantidade: 100, valor_unitario: 21.32, taxas: 0.64, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 5, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-09-12', quantidade: 500, valor_unitario: 24.95, taxas: 3.74, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 5, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-09-23', quantidade: 500, valor_unitario: 24.80, taxas: 3.72, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 6, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-08', quantidade: 200, valor_unitario: 22.88, taxas: 1.37, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 6, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-29', quantidade: 700, valor_unitario: 25.37, taxas: 5.33, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 6, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-12-02', quantidade: 700, valor_unitario: 24.95, taxas: 5.24, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 7, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-30', quantidade: 700, valor_unitario: 22.39, taxas: 4.70, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 7, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-31', quantidade: 800, valor_unitario: 22.45, taxas: 5.39, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 8, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-05-30', quantidade: 800, valor_unitario: 23.90, taxas: 5.74, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 8, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            // { data: '2025-06-04', quantidade: 100, valor_unitario: 23.52, taxas: 0.71, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 9, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-06-04', quantidade: 800, valor_unitario: 23.52, taxas: 4.94, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 9, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-06-30', quantidade: 700, valor_unitario: 28.02, taxas: 5.88, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 9, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            
            { data: '2025-07-01', quantidade: 700, valor_unitario: 27.95, taxas: 5.87, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 9, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-08-29', quantidade: 600, valor_unitario: 30.19, taxas: 5.43, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 9, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-09-25', quantidade: 200, valor_unitario: 33.57, taxas: 2.01, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 9, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            { data: '2024-05-24', quantidade: 200, valor_unitario: 13.58, taxas: 0.80, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 11, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 30, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            
            { data: '2024-03-20', quantidade: 400, valor_unitario: 16.53, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-21', quantidade: 82, valor_unitario: 16.73, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-20', quantidade: 100, valor_unitario: 16.54, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-05', quantidade: 100, valor_unitario: 16.75, taxas: 0.49, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-09-10', quantidade: 200, valor_unitario: 15.66, taxas: 0.97, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-08', quantidade: 200, valor_unitario: 14.31, taxas: 0.85, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-07', quantidade: 300, valor_unitario: 14.70, taxas: 1.32, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-12-30', quantidade: 600, valor_unitario: 16.73, taxas: 3.01, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-01-02', quantidade: 600, valor_unitario: 16.70, taxas: 3.01, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-01-02', quantidade: 18, valor_unitario: 16.64, taxas: 0.09, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 15, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-05-08', quantidade: 300, valor_unitario: 17.78, taxas: 1.60, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 83, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },

            //CYRE3
            { data: '2024-03-20', quantidade: 400, valor_unitario: 24.16, taxas: 2.90, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 40, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-06', quantidade: 50, valor_unitario: 21.73, taxas: 0.33, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 40, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-15', quantidade: 400, valor_unitario: 20.71, taxas: 2.49, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 40, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-15', quantidade: 50, valor_unitario: 20.70, taxas: 0.31, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 40, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-16', quantidade: 400, valor_unitario: 20.71, taxas: 2.49, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 41, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-16', quantidade: 50, valor_unitario: 20.75, taxas: 0.31, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 41, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-03-28', quantidade: 400, valor_unitario: 24.35, taxas: 2.92, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 41, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-03-28', quantidade: 50, valor_unitario: 24.31, taxas: 0.36, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 41, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-01-08', quantidade: 500, valor_unitario: 24.34, taxas: 3.65, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 59, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },

            { data: '2026-01-08', quantidade: 300, valor_unitario: 24.33, taxas: 2.19, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 60, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-27', quantidade: 300, valor_unitario: 30.99, taxas: 1.35, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 60, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-02', quantidade: 300, valor_unitario: 29.88, taxas: 2.69, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CYRE3, PosicaoAtivoId: 77, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            { data: '2024-08-07', quantidade: 100, valor_unitario: 26.12, taxas: 0.78, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.DIRR3, PosicaoAtivoId: 43, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-07', quantidade: 100, valor_unitario: 28.02, taxas: 0.84, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.DIRR3, PosicaoAtivoId: 43, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-16', quantidade: 100, valor_unitario: 8.30, taxas: 0.23, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 14, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 29, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-27', quantidade: 30, valor_unitario: 44.48, taxas: 0.39, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.EGIE3, PosicaoAtivoId: 44, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-06-28', quantidade: 30, valor_unitario: 44.38, taxas: 0.39, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.EGIE3, PosicaoAtivoId: 44, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-06', quantidade: 100, valor_unitario: 34.32, taxas: 0.55, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.EMBJ3, PosicaoAtivoId: 45, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-21', quantidade: 100, valor_unitario: 38.93, taxas: 1.16, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.EMBJ3, PosicaoAtivoId: 45, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            
            { data: '2024-03-20', quantidade: 200, valor_unitario: 33.69, taxas: 2.02, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HYPE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 16, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-04-02', quantidade: 100, valor_unitario: 30.00, taxas: 0.90, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HYPE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 16, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-11', quantidade: 100, valor_unitario: 21.00, taxas: 0.63, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HYPE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 16, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-10-17', quantidade: 300, valor_unitario: 22.75, taxas: 3.75, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.HYPE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 16, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-17', quantidade: 33, valor_unitario: 21.25, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.SUBSCRICAO, TickerId: TICKER.HYPE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 16, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-17', quantidade: 44, valor_unitario: 21.25, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.SUBSCRICAO, TickerId: TICKER.HYPE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 16, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-03-23', quantidade: 2, valor_unitario: 21.25, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.SUBSCRICAO, TickerId: TICKER.HYPE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 16, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },

            { data: '2024-03-20', quantidade: 900, valor_unitario: 10.66, taxas: 2.88, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 19, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-06-05', quantidade: 100, valor_unitario: 9.83, taxas: 0.29, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 19, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-12-19', quantidade: 400, valor_unitario: 8.77, taxas: 1.05, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 19, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-20', quantidade: 200, valor_unitario: 9.06, taxas: 0.54, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 19, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-12-04', quantidade: 50, valor_unitario: 13.56, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.BONIFICACAO, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 19, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-04-22', quantidade: 22, valor_unitario: 6.70, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.BONIFICACAO, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 19, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-08-29', quantidade: 1672, valor_unitario: 11.25, taxas: 5.15, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 19, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-10-10', quantidade: 2200, valor_unitario: 11.37, taxas: 8.94, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 49, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-12-23', quantidade: 44, valor_unitario: 11.37, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.BONIFICACAO, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 49, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-20', quantidade: 2200, valor_unitario: 11.99, taxas: 8.98, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 49, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-23', quantidade: 44, valor_unitario: 14.89, taxas: 0.20, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 49, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-24', quantidade: 1000, valor_unitario: 14.71, taxas: 4.41, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 73, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-24', quantidade: 900, valor_unitario: 14.71, taxas: 3.97, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 74, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-06-09', quantidade: 200, valor_unitario: 12.63, taxas: 0.76, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 74, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },

            { data: '2024-10-07', quantidade: 200, valor_unitario: 7.52, taxas: 0.44, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 8, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 37, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-20', quantidade: 900, valor_unitario: 10.35, taxas: 2.79, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 20, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-18', quantidade: 200, valor_unitario: 10.23, taxas: 0.61, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 20, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-12-19', quantidade: 200, valor_unitario: 9.36, taxas: 0.56, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 20, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-09', quantidade: 100, valor_unitario: 13.21, taxas: 0.40, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.MILS3, PosicaoAtivoId: 46, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-31', quantidade: 100, valor_unitario: 9.20, taxas: 0.28, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.MILS3, PosicaoAtivoId: 46, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-02-07', quantidade: 200, valor_unitario: 5.97, taxas: 0.34, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.MOVI3, PosicaoAtivoId: 48, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-04-07', quantidade: 200, valor_unitario: 6.63, taxas: 0.39, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.MOVI3, PosicaoAtivoId: 48, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 700, valor_unitario: 12.71, taxas: 2.67, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 21, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-21', quantidade: 59, valor_unitario: 12.59, taxas: 0.22, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 21, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-18', quantidade: 200, valor_unitario: 10.42, taxas: 0.63, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 21, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-01-16', quantidade: 700, valor_unitario: 10.69, taxas: 2.24, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 21, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-06', quantidade: 300, valor_unitario: 11.78, taxas: 1.10, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 72, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-27', quantidade: 300, valor_unitario: 14.97, taxas: 1.35, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 72, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-27', quantidade: 959, valor_unitario: 14.68, taxas: 4.22, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 21, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-02-27', quantidade: 300, valor_unitario: 14.67, taxas: 1.32, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 21, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-02', quantidade: 600, valor_unitario: 14.27, taxas: 2.57, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 21, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-02', quantidade: 1000, valor_unitario: 14.26, taxas: 2.57, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 75, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },

            { data: '2024-03-20', quantidade: 300, valor_unitario: 25.83, taxas: 2.32, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 22, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-21', quantidade: 72, valor_unitario: 26.19, taxas: 0.57, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 22, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-08-07', quantidade: 300, valor_unitario: 28.92, taxas: 2.60, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 22, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-08-07', quantidade: 72, valor_unitario: 28.91, taxas: 0.62, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 22, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-08-08', quantidade: 400, valor_unitario: 28.88, taxas: 3.47, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            // { data: '2025-01-20', quantidade: 100, valor_unitario: 25.79, taxas: 0.77, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-20', quantidade: 200, valor_unitario: 25.79, taxas: 1.54, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-04-30', quantidade: 500, valor_unitario: 30.55, taxas: 4.58, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-02', quantidade: 500, valor_unitario: 30.54, taxas: 4.58, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            // { data: '2025-05-02', quantidade: 100, valor_unitario: 30.54, taxas: 0.92, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-06-30', quantidade: 500, valor_unitario: 38.15, taxas: 5.72, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-01', quantidade: 500, valor_unitario: 36.84, taxas: 5.53, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-12-19', quantidade: 600, valor_unitario: 38.28, taxas: 158.65, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 23, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-12-22', quantidade: 600, valor_unitario: 37.72, taxas: 6.77, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 53, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-31', quantidade: 400, valor_unitario: 44.32, taxas: 5.32, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 53, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-04-13', quantidade: 300, valor_unitario: 43.26, taxas: 3.87, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 53, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-04-13', quantidade: 300, valor_unitario: 43.21, taxas: 3.87, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 80, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },

            { data: '2024-05-22', quantidade: 50, valor_unitario: 30.06, taxas: 0.44, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.TOTS3, PosicaoAtivoId: 47, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-31', quantidade: 50, valor_unitario: 32.20, taxas: 0.48, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.TOTS3, PosicaoAtivoId: 47, CarteiraId: CARTEIRA.DIVERSAS, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-15', quantidade: 400, valor_unitario: 7.80, taxas: 0.93, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 20, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            
            //GLD
            { data: '2024-03-19', quantidade: 33.04656, valor_unitario: 199.72, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GLD, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.09, PosicaoAtivoId: 2, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-09-10', quantidade: 2.67025, valor_unitario: 232.39, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GLD, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.66, PosicaoAtivoId: 2, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-15', quantidade: 1.69965, valor_unitario: 294.18, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.GLD, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.77, PosicaoAtivoId: 2, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            { data: '2024-03-19', quantidade: 65.94718, valor_unitario: 100.54, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.09, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-08-07', quantidade: 0.20838, valor_unitario: 100.39, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.63, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER},
            { data: '2024-09-10', quantidade: 5.97312, valor_unitario: 100.45, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.66, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-11', quantidade: 0.20878, valor_unitario: 100.39, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.43, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-04-16', quantidade: 0.19795, valor_unitario: 100.53, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.90, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-15', quantidade: 5.14375, valor_unitario: 100.52, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL, cotacao_dolar: 5.77, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-06-06', quantidade: 0.22259, valor_unitario: 100.45, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.95, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-08', quantidade: 8.34504, valor_unitario: 100.45, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.80, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-09-05', quantidade: 10.04151, valor_unitario: 100.45, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.51, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-12-29', quantidade: 3.576606, valor_unitario: 100.35, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.69, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-01-06', quantidade: 14.23509, valor_unitario: 100.43, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.38, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-03-30', quantidade: 0.33708, valor_unitario: 100.66, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.21, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-04-24', quantidade: 0.96085, valor_unitario: 100.64, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.03, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-05-19', quantidade: 0.31590314, valor_unitario: 100.57, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SGOV, cotacao_dolar: 5.03, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 1, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            //IAU
            { data: '2024-03-12', quantidade: 122.31757, valor_unitario: 40.88, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IAU, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.09, PosicaoAtivoId: 17, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-04-05', quantidade: 0.78005, valor_unitario: 44.12, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IAU, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.12, PosicaoAtivoId: 17, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-03', quantidade: 0.32122, valor_unitario: 44.61, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IAU, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.58, PosicaoAtivoId: 17, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-08-10', quantidade: 0.43898, valor_unitario: 49.41, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IAU, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.51, PosicaoAtivoId: 17, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-21', quantidade: 17.21945, valor_unitario: 51.63, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IAU, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 6.16, PosicaoAtivoId: 17, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-11-18', quantidade: 2, valor_unitario: 76.11, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IAU, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.45, PosicaoAtivoId: 17, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2026-02-13', quantidade: 0.35528963, valor_unitario: 94.43, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.IAU, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.23, PosicaoAtivoId: 17, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            //VOO
            { data: '2024-03-12', quantidade: 10.57971, valor_unitario: 472.60, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.09, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-04-05', quantidade: 0.77093, valor_unitario: 477.34, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.12, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-04-17', quantidade: 0.4331, valor_unitario: 461.69, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.25, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-08', quantidade: 0.4204, valor_unitario: 475.66, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.09, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-06-17', quantidade: 0.4136, valor_unitario: 503.06, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.41, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-10-02', quantidade: 0.2515, valor_unitario: 523.59, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.43, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-14', quantidade: 0.6142, valor_unitario: 535.45, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 6.08, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-21', quantidade: 1.60965, valor_unitario: 551.67, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 6.16, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-03-10', quantidade: 0.14103, valor_unitario: 519.32, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.71, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-08-18', quantidade: 0.04881, valor_unitario: 591.86, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.50, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-11-18', quantidade: 0.17788548, valor_unitario: 606.57, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA, cotacao_dolar: 5.45, PosicaoAtivoId: 27, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            //BBDC4
            { data: '2024-03-20', quantidade: 600, valor_unitario: 14.18, taxas: 2.55, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 39, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-21', quantidade: 80, valor_unitario: 14.15, taxas: 0.34, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 39, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-14', quantidade: 100, valor_unitario: 13.45, taxas: 0.40, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 39, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-12-19', quantidade: 300, valor_unitario: 11.50, taxas: 1.04, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 39, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-20', quantidade: 200, valor_unitario: 11.52, taxas: 0.69, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 39, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-06', quantidade: 80, valor_unitario: 15.57, taxas: 0.37, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBDC4, PosicaoAtivoId: 39, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-06', quantidade: 100, valor_unitario: 15.55, taxas: 0.47, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBDC4, PosicaoAtivoId: 39, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-06', quantidade: 1100, valor_unitario: 15.56, taxas: 5.13, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBDC4, PosicaoAtivoId: 39, CarteiraId: CARTEIRA.MAGAR_BRASIL, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-11-25', quantidade: 1300, valor_unitario: 18.92, taxas: 7.38, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 51, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-06', quantidade: 200, valor_unitario: 20.47, taxas: 1.23, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 70, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-27', quantidade: 200, valor_unitario: 21.70, taxas: 1.30, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 70, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-02', quantidade: 200, valor_unitario: 20.65, taxas: 1.24, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 76, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-06-09', quantidade: 200, valor_unitario: 17.46, taxas: 1.05, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 76, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },


            { data: '2025-04-07', quantidade: 114, valor_unitario: 131.59, taxas: 4.50, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 58, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-05-19', quantidade: 113, valor_unitario: 133.42, taxas: 4.52, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 58, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-07-08', quantidade: 45, valor_unitario: 137.97, taxas: 1.86, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-09', quantidade: 28, valor_unitario: 136.03, taxas: 1.14, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-14', quantidade: 7, valor_unitario: 136.27, taxas: 0.37, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-14', quantidade: 2, valor_unitario: 136.38, taxas: 0.08, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-06-18', quantidade: 20, valor_unitario: 135.72, taxas: 0.81, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BOVA11, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 31, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM },
            { data: '2025-07-24', quantidade: 2, valor_unitario: 136.89, taxas: 0.08, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-03-04', quantidade: 1, valor_unitario: 202.26, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.AAPL, CarteiraId: CARTEIRA.DIVERSAS, cotacao_dolar: 5.80, PosicaoAtivoId: 34, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-07-31', quantidade: 146, valor_unitario: 137.27, taxas: 6.01, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            
            { data: '2025-07-29', quantidade: 1.7, valor_unitario: 80.69, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 26, cotacao_dolar: 5.58, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-08-01', quantidade: 1.9, valor_unitario: 70.80, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 26, cotacao_dolar: 5.54, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-10-06', quantidade: 1.024997385, valor_unitario: 76.50, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 26, cotacao_dolar: 5.80, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-10-17', quantidade: 0.177407102, valor_unitario: 60.32, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 26, cotacao_dolar: 5.80, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            
            //LFTB11
            { data: '2025-08-04', quantidade: 180, valor_unitario: 109.38, taxas: 5.91, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-08-05', quantidade: 2, valor_unitario: 109.39, taxas: 0.07, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-08-18', quantidade: 6, valor_unitario: 109.89, taxas: 0.20, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-08-19', quantidade: 1, valor_unitario: 109.86, taxas: 0.03, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-08-27', quantidade: 2, valor_unitario: 110.21, taxas: 0.07, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-09-02', quantidade: 175, valor_unitario: 110.41, taxas: 5.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-09-02', quantidade: 5, valor_unitario: 110.39, taxas: 0.17, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-09-23', quantidade: 8, valor_unitario: 111.35, taxas: 0.23, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-09-23', quantidade: 6, valor_unitario: 111.77, taxas: 0.19, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-10-13', quantidade: 54, valor_unitario: 112.80, taxas: 1.89, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-10-22', quantidade: 1, valor_unitario: 112.52, taxas: 0.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-11-06', quantidade: 63, valor_unitario: 113.30, taxas: 2.12, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-12-22', quantidade: 131, valor_unitario: 115.16, taxas: 5.00, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-12-26', quantidade: 176, valor_unitario: 115.30, taxas: 6.07, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-18', quantidade: 89, valor_unitario: 117.59, taxas: 3.13, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-03', quantidade: 29, valor_unitario: 118.39, taxas: 1.01, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-04-17', quantidade: 20, valor_unitario: 120.66, taxas: 0.66, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-04-24', quantidade: 65, valor_unitario: 120.73, taxas: 2.35, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-01-05', quantidade: 157, valor_unitario: 115.82, taxas: 5.44, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 56, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-01-06', quantidade: 81, valor_unitario: 115.76, taxas: 2.81, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 56, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-01-08', quantidade: 138, valor_unitario: 115.88, taxas: 4.75, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 56, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-06', quantidade: 45, valor_unitario: 117.24, taxas: 1.57, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 56, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-05-13', quantidade: 7, valor_unitario: 121.36, taxas: 0.25, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.LFTB11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 36, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            // BBSE3
            { data: '2024-03-20', quantidade: 300, valor_unitario: 32.96, taxas: 2.97, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 13, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-11-18', quantidade: 100, valor_unitario: 33.57, taxas: 1.01, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 13, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-27', quantidade: 400, valor_unitario: 38.54, taxas: 4.62, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 13, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2025-05-19', quantidade: 500, valor_unitario: 37.94, taxas: 0, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 14, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2025-08-07', quantidade: 100, valor_unitario: 35.64, taxas: 1.06, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 14, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },            

            { data: '2025-09-19', quantidade: 200, valor_unitario: 32.32, taxas: 31.62, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 54, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-12-30', quantidade: 200, valor_unitario: 36.33, taxas: 2.16, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 54, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            
            { data: '2026-01-02', quantidade: 200, valor_unitario: 36.28, taxas: 2.16, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 55, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },

            { data: '2025-09-19', quantidade: 20, valor_unitario: 137.18, taxas: 12.83, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.BOVA11, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 31, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.CM },
            { data: '2025-10-09', quantidade: 185, valor_unitario: 141.00, taxas: 7.81, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-10-17', quantidade: 200, valor_unitario: 22.57, taxas: 3.75, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 57, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },

            { data: '2024-03-20', quantidade: 800, valor_unitario: 11.74, taxas: 2.82, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-03', quantidade: 200, valor_unitario: 5.00, taxas: 0.30, TipoOperacaoId: TIPO_OPERACAO.BONIFICACAO, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-05-03', quantidade: 40, valor_unitario: 5.00, taxas: 0.06, TipoOperacaoId: TIPO_OPERACAO.BONIFICACAO, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-17', quantidade: 40, valor_unitario: 11.23, taxas: 0.13, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-07-18', quantidade: 40, valor_unitario: 11.05, taxas: 0.13, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-08-30', quantidade: 600, valor_unitario: 11.57, taxas: 2.08, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-09-02', quantidade: 700, valor_unitario: 11.57, taxas: 2.43, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            // { data: '2024-09-02', quantidade: 100, valor_unitario: 11.57, taxas: 0.35, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-01-20', quantidade: 200, valor_unitario: 10.46, taxas: 0.63, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-10-17', quantidade: 1000, valor_unitario: 11.57, taxas: 3.75, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 3, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-02-06', quantidade: 300, valor_unitario: 11.36, taxas: 1.1, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 71, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-03-31', quantidade: 300, valor_unitario: 12.61, taxas: 1.13, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 71, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },
            { data: '2026-04-01', quantidade: 300, valor_unitario: 12.63, taxas: 1.14, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 79, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },

            { data: '2025-10-28', quantidade: 27, valor_unitario: 107.83, taxas: 0.86, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.SMAL11, CarteiraId: CARTEIRA.DIVERSAS, PosicaoAtivoId: 50, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2025-11-25', quantidade: 109, valor_unitario: 143.55, taxas: 4.69, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.LFTS11, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 35, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },

            { data: '2024-03-20', quantidade: 300, valor_unitario: 24.99, taxas: 2.25, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 18, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2024-03-20', quantidade: 85, valor_unitario: 24.98, taxas: 0.64, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 18, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-05-08', quantidade: 100, valor_unitario: 30.38, taxas: 0.91, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 84, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.INTER },
            { data: '2025-11-28', quantidade: 300, valor_unitario: 27.89, taxas: 2.51, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 18, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-11-28', quantidade: 85, valor_unitario: 27.87, taxas: 0.72, TipoOperacaoId: TIPO_OPERACAO.VENDA, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 18, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.INTER },
            { data: '2025-12-01', quantidade: 600, valor_unitario: 27.69, taxas: 4.98, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 52, InvestidorId: INVESTIDOR.IGOR, CorretoraId: CORRETORA.BTG },
            { data: '2026-06-09', quantidade: 100, valor_unitario: 27.27, taxas: 0.82, TipoOperacaoId: TIPO_OPERACAO.COMPRA, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL, PosicaoAtivoId: 84, InvestidorId: INVESTIDOR.CRIS, CorretoraId: CORRETORA.BTG },


        ]);

        await Provento.bulkCreate([
            //HGBS11
            { data: '2024-04-12', valor_unitario: 0.18, total: 73.50, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-15', valor_unitario: 0.18, total: 73.50, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-14', valor_unitario: 0.18, total: 73.50, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-12', valor_unitario: 0.18, total: 73.50, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-14', valor_unitario: 0.16, total: 67.20, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-13', valor_unitario: 0.16, total: 67.20, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-10-14', valor_unitario: 0.16, total: 67.20, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-14', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-13', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-15', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-14', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-18', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-14', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-15', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-13', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-14', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-14', valor_unitario: 0.15, total: 75.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-12', valor_unitario: 0.15, total: 75.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-14', valor_unitario: 0.15, total: 75.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-14', valor_unitario: 0.15, total: 75.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-12', valor_unitario: 0.15, total: 75.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-15', valor_unitario: 0.15, total: 75.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-13', valor_unitario: 0.16, total: 80.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-13', valor_unitario: 0.17, total: 97.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-15', valor_unitario: 0.17, total: 97.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-15', valor_unitario: 0.17, total: 97.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-15', valor_unitario: 0.17, total: 97.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HGBS11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //BTAL11
            { data: '2024-04-24', valor_unitario: 0.65, total: 87.10, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-27', valor_unitario: 0.84, total: 112.56, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-26', valor_unitario: 0.84, total: 112.56, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-24', valor_unitario: 0.84, total: 112.56, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-26', valor_unitario: 0.84, total: 112.56, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-25', valor_unitario: 0.84, total: 112.56, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-10-24', valor_unitario: 0.84, total: 112.56, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-28', valor_unitario: 0.84, total: 131.04, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-27', valor_unitario: 0.84, total: 131.04, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-27', valor_unitario: 0.84, total: 131.04, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-26', valor_unitario: 0.84, total: 131.04, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-28', valor_unitario: 0.84, total: 131.04, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-28', valor_unitario: 0.84, total: 173.04, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-27', valor_unitario: 0.90, total: 185.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-26', valor_unitario: 0.90, total: 185.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-24', valor_unitario: 0.90, total: 185.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-25', valor_unitario: 0.90, total: 185.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-24', valor_unitario: 0.95, total: 195.70, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-24', valor_unitario: 0.95, total: 209.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-27', valor_unitario: 0.95, total: 209.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-26', valor_unitario: 0.95, total: 209.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-27', valor_unitario: 0.95, total: 209.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-27', valor_unitario: 1.00, total: 249.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-25', valor_unitario: 1.00, total: 249.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-28', valor_unitario: 1.00, total: 249.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-25', valor_unitario: 1.00, total: 249.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-25', valor_unitario: 1.00, total: 299.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTAL11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //VISC11
            { data: '2024-04-12', valor_unitario: 1.00, total: 78.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-15', valor_unitario: 1.00, total: 78.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-14', valor_unitario: 1.00, total: 78.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-12', valor_unitario: 0.85, total: 66.30, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-14', valor_unitario: 0.85, total: 66.30, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-13', valor_unitario: 0.83, total: 64.74, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-10-16', valor_unitario: 0.80, total: 62.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-14', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-13', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-15', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-14', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-14', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-14', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-15', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-13', valor_unitario: 0.80, total: 74.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-14', valor_unitario: 0.81, total: 75.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-14', valor_unitario: 0.81, total: 75.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-12', valor_unitario: 0.81, total: 75.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-14', valor_unitario: 0.81, total: 75.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-14', valor_unitario: 0.81, total: 75.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-12', valor_unitario: 0.81, total: 75.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-15', valor_unitario: 0.81, total: 75.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-13', valor_unitario: 0.84, total: 78.12, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-13', valor_unitario: 0.84, total: 89.88, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-15', valor_unitario: 0.84, total: 89.88, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-15', valor_unitario: 0.84, total: 89.88, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VISC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //RZTR11
            { data: '2024-05-04', valor_unitario: 0.90, total: 90.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-05', valor_unitario: 0.90, total: 90.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-07', valor_unitario: 0.90, total: 90.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-07', valor_unitario: 0.90, total: 90.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-08', valor_unitario: 0.90, total: 90.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-09', valor_unitario: 0.90, total: 90.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-10', valor_unitario: 0.90, total: 90.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-11', valor_unitario: 0.90, total: 107.10, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-12', valor_unitario: 1.15, total: 136.85, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-08', valor_unitario: 1.10, total: 130.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-02', valor_unitario: 1.05, total: 124.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-03', valor_unitario: 1.05, total: 124.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-04', valor_unitario: 1.05, total: 124.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-08', valor_unitario: 1.05, total: 166.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-06', valor_unitario: 1.05, total: 190.05, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-07', valor_unitario: 1.05, total: 190.05, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-08', valor_unitario: 1.00, total: 181.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-09', valor_unitario: 1.00, total: 181.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-10', valor_unitario: 1.00, total: 181.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-11', valor_unitario: 1.00, total: 181.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-12', valor_unitario: 1.00, total: 181.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-08', valor_unitario: 1.00, total: 181.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-06', valor_unitario: 1.00, total: 181.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-06', valor_unitario: 1.00, total: 207.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-08', valor_unitario: 1.00, total: 207.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-08', valor_unitario: 1.00, total: 216.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-08', valor_unitario: 1.00, total: 216.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-07-07', valor_unitario: 0.90, total: 230.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.RZTR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //HSML11
            { data: '2024-04-05', valor_unitario: 0.80, total: 78.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-08', valor_unitario: 0.80, total: 78.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-07', valor_unitario: 0.80, total: 78.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-05', valor_unitario: 0.80, total: 78.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-07', valor_unitario: 0.80, total: 78.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-06', valor_unitario: 0.80, total: 78.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-10-07', valor_unitario: 0.80, total: 78.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-07', valor_unitario: 0.80, total: 92.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-06', valor_unitario: 0.80, total: 92.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-08', valor_unitario: 0.80, total: 92.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-07', valor_unitario: 0.65, total: 75.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-11', valor_unitario: 0.65, total: 75.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-07', valor_unitario: 0.65, total: 75.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-08', valor_unitario: 0.65, total: 75.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-06', valor_unitario: 0.65, total: 99.45, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-07', valor_unitario: 0.65, total: 99.45, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-07', valor_unitario: 0.66, total: 116.82, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-05', valor_unitario: 0.67, total: 118.59, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-07', valor_unitario: 0.68, total: 120.36, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-07', valor_unitario: 0.70, total: 123.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-05', valor_unitario: 0.70, total: 123.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-08', valor_unitario: 0.70, total: 123.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-06', valor_unitario: 0.70, total: 123.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-06', valor_unitario: 0.70, total: 123.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-08', valor_unitario: 0.70, total: 123.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-08', valor_unitario: 0.71, total: 125.67, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-08', valor_unitario: 0.75, total: 132.75, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-07-07', valor_unitario: 0.75, total: 132.75, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.HSML11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //GGRC11
            { data: '2024-04-08', valor_unitario: 0.09, total: 75.96, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-09', valor_unitario: 0.09, total: 75.96, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-10', valor_unitario: 0.09, total: 75.96, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-08', valor_unitario: 0.09, total: 78.49, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-08', valor_unitario: 0.09, total: 76.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-09', valor_unitario: 0.09, total: 76.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-10-08', valor_unitario: 0.10, total: 84.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-08', valor_unitario: 0.10, total: 99.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-09', valor_unitario: 0.10, total: 99.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-09', valor_unitario: 0.10, total: 94.43, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-10', valor_unitario: 0.10, total: 94.43, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-11', valor_unitario: 0.10, total: 99.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-08', valor_unitario: 0.10, total: 99.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-09', valor_unitario: 0.10, total: 134.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-09', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-08', valor_unitario: 0.11, total: 162.12, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-08', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-08', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-07', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-10', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-08', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-09', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-09', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-09', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-09', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-11', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-09', valor_unitario: 0.10, total: 154.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.GGRC11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //BTLG11
            { data: '2024-04-25', valor_unitario: 0.76, total: 69.92, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-24', valor_unitario: 0.76, total: 69.92, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-25', valor_unitario: 0.76, total: 69.92, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-23', valor_unitario: 0.76, total: 69.92, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-23', valor_unitario: 0.76, total: 69.92, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-25', valor_unitario: 0.78, total: 71.76, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-10-25', valor_unitario: 0.78, total: 71.76, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-25', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-23', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-22', valor_unitario: 0.87, total: 93.76, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-25', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-25', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-25', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-23', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-23', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-25', valor_unitario: 0.78, total: 84.25, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-22', valor_unitario: 0.78, total: 84.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-25', valor_unitario: 0.79, total: 85.32, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-24', valor_unitario: 0.79, total: 85.32, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-25', valor_unitario: 0.79, total: 85.32, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-23', valor_unitario: 0.79, total: 85.32, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-23', valor_unitario: 0.79, total: 85.32, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-25', valor_unitario: 0.80, total: 86.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-25', valor_unitario: 0.80, total: 86.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-24', valor_unitario: 0.81, total: 87.48, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-25', valor_unitario: 0.81, total: 87.48, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-25', valor_unitario: 0.81, total: 87.48, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BTLG11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2025-02-13', valor_unitario: 0.17, total: 0.17, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.AAPL, CarteiraId: CARTEIRA.DIVERSAS },

            { data: '2025-04-02', valor_unitario: 0.01, total: 0.03, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.NVDA, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-07-03', valor_unitario: 0.01, total: 0.03, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.NVDA, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-10-02', valor_unitario: 0.01, total: 0.03, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.NVDA, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-12-26', valor_unitario: 0.01, total: 0.03, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.NVDA, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-04-01', valor_unitario: 0.02, total: 0.03, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.NVDA, CarteiraId: CARTEIRA.DIVERSAS },

            { data: '2024-06-21', valor_unitario: 0.16, total: 56.68, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-21', valor_unitario: 0.25, total: 85.72, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-28', valor_unitario: 0.20, total: 59.72, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0.002, total: 0.73, TipoProventoId: 3, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0.004, total: 1.49, TipoProventoId: 3, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0.27, total: 91.96, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0.15, total: 52.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-27', valor_unitario: 0.16, total: 54.57, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-12', valor_unitario: 0.41, total: 209.51, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-27', valor_unitario: 0.15, total: 76.51, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-20', valor_unitario: 0.00, total: 2.90, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-20', valor_unitario: 0.00, total: 2.90, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-20', valor_unitario: 0.15, total: 87.36, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-20', valor_unitario: 0.15, total: 87.36, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-20', valor_unitario: 0.07, total: 40.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-20', valor_unitario: 0.07, total: 40.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-21', valor_unitario: 0.04, total: 25.39, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-21', valor_unitario: 0.04, total: 25.39, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-21', valor_unitario: 0.04, total: 25.39, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-06', valor_unitario: 0.27, total: 216.60, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-11', valor_unitario: 0.01, total: 12.23, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-12', valor_unitario: 0.01, total: 7.79, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-05', valor_unitario: 0.18, total: 35.69, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-05', valor_unitario: 0.00, total: 0.80, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-05', valor_unitario: 0.18, total: 142.76, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-05', valor_unitario: 0.00, total: 3.22, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-11', valor_unitario: 0.07, total: 11.57, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.BBAS3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            
            //BBDC4
            { data: '2024-05-02', valor_unitario: 0.02, total: 10.97, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-03', valor_unitario: 0.02, total: 10.97, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-01', valor_unitario: 0.02, total: 12.58, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-02-09', valor_unitario: 0.02, total: 12.58, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-01-10', valor_unitario: 0.02, total: 12.58, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-01-11', valor_unitario: 0.02, total: 12.58, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-02-11', valor_unitario: 0.02, total: 12.58, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-01', valor_unitario: 0.02, total: 12.58, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-31', valor_unitario: 0.34, total: 261.92, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-02', valor_unitario: 0.02, total: 17.42, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-03', valor_unitario: 0.02, total: 20.64, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-30', valor_unitario: 0.10, total: 130.96, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-05', valor_unitario: 0.02, total: 20.64, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-02', valor_unitario: 0.02, total: 20.64, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-31', valor_unitario: 0.25, total: 269.87, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-31', valor_unitario: 0.19, total: 247.87, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-02', valor_unitario: 0.02, total: 20.97, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-02', valor_unitario: 0.40, total: 515.17, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-02', valor_unitario: 0.02, total: 20.35, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-01', valor_unitario: 0.02, total: 20.35, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-04', valor_unitario: 0.02, total: 20.35, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.BBDC4, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //BBSE3
            { data: '2024-08-30', valor_unitario: 1.39, total: 417.27, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-26', valor_unitario: 1.94, total: 1165.25, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-02', valor_unitario: 2.55, total: 509.99, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-02', valor_unitario: 0.04, total: 8.81, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-02', valor_unitario: 2.55, total: 1529.97, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-02', valor_unitario: 0.04, total: 26.43, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.BBSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //CSMG3
            { data: '2024-05-09', valor_unitario: 0.79, total: 372.64, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-17', valor_unitario: 0.14, total: 68.10, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-17', valor_unitario: 0.31, total: 124.16, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0.42, total: 197.06, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-19', valor_unitario: 0, total: 126.83, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2024-11-28', valor_unitario: 0.55, total: 110.09, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 11, CarteiraId: CARTEIRA.DIVERSAS },

            //CXSE3
            { data: '2024-05-08', valor_unitario: 0.55, total: 320.43, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-08', valor_unitario: 0.02, total: 7.11, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-15', valor_unitario: 0.28, total: 190.96, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-18', valor_unitario: 0.23, total: 253.18, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-17', valor_unitario: 0.31, total: 335.42, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-17', valor_unitario: 0.00, total: 1.42, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-15', valor_unitario: 0.32, total: 346.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-15', valor_unitario: 0.00, total: 0.14, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-15', valor_unitario: 0.40, total: 428.42, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-17', valor_unitario: 0.32, total: 442.24, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-16', valor_unitario: 0.35, total: 273.70, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-16', valor_unitario: 0.00, total: 1.29, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-16', valor_unitario: 0.35, total: 216.30, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-16', valor_unitario: 0.00, total: 1.02, TipoProventoId: TIPO_PROVENTO.RENDIMENTOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-15', valor_unitario: 0.33, total: 258.06, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CXSE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            //CYRE3
            { data: '2024-11-26', valor_unitario: 0.60, total: 238.71, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CYRE3, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2025-01-16', valor_unitario: 1.27, total: 81.28, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.DIRR3, CarteiraId: CARTEIRA.DIVERSAS },

            //ITSA4
            { data: '2024-07-01', valor_unitario: 0.02, total: 20.00, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0, total: 80.41, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0, total: 53.55, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-01-10', valor_unitario: 0.02, total: 20.00, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-01', valor_unitario: 0.02, total: 20.00, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-03', valor_unitario: 0.09, total: 141.79, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-03', valor_unitario: 0.05, total: 51.85, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-03', valor_unitario: 0.04, total: 41.14, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-03', valor_unitario: 0.41, total: 673.44, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-24', valor_unitario: 0.09, total: 152.19, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-01', valor_unitario: 0.02, total: 33.44, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-25', valor_unitario: 0.05, total: 83.99, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-25', valor_unitario: 0.16, total: 264.20, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-19', valor_unitario: 0.78, total: 1705.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-02', valor_unitario: 0.02, total: 44.00, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-06', valor_unitario: 0.02, total: 34.04, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-01', valor_unitario: 0.02, total: 20.00, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ITSA4, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2024-09-20', valor_unitario: 0.07, total: 13.53, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 8, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2024-04-15', valor_unitario: 0.16, total: 141.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-04-15', valor_unitario: 0.27, total: 239.30, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-10', valor_unitario: 0.17, total: 152.78, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-23', valor_unitario: 0.07, total: 67.07, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-28', valor_unitario: 0.08, total: 73.53, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-28', valor_unitario: 0.07, total: 61.19, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-16', valor_unitario: 0.30, total: 386.42, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-16', valor_unitario: 0.11, total: 138.77, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 23, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-15', valor_unitario: 0.08, total: 7.98, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.MILS3, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2024-08-30', valor_unitario: 0.06, total: 6.24, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.MILS3, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2024-08-30', valor_unitario: 0.14, total: 13.79, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.MILS3, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-01-15', valor_unitario: 0.19, total: 19.44, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.MILS3, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2024-08-13', valor_unitario: 0.29, total: 155.42, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-19', valor_unitario: 0.38, total: 209.23, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-26', valor_unitario: 0.20, total: 9.78, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.TOTS3, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2024-12-27', valor_unitario: 0.19, total: 9.35, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.TOTS3, CarteiraId: CARTEIRA.DIVERSAS },

            { data: '2024-04-05', valor_unitario: 0.45, total: 20.77, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-05-07', valor_unitario: 0.43, total: 20.51, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-06-07', valor_unitario: 0.44, total: 20.30, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-07-05', valor_unitario: 0.44, total: 20.26, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-06', valor_unitario: 0.45, total: 20.92, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-09-06', valor_unitario: 0.45, total: 20.54, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-10-04', valor_unitario: 0.45, total: 21.69, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-11-06', valor_unitario: 0.45, total: 20.96, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-05', valor_unitario: 0.37, total: 19.12, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-23', valor_unitario: 0.37, total: 20.89, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-06', valor_unitario: 0.45, total: 18.45, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-06', valor_unitario: 0.45, total: 15.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-04-04', valor_unitario: 0.45, total: 17.57, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-05-06', valor_unitario: 0.45, total: 17.05, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-05', valor_unitario: 0.45, total: 22.00, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-07-07', valor_unitario: 0.27, total: 21.39, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-07', valor_unitario: 0.45, total: 24.45, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-08', valor_unitario: 0.28, total: 24.30, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-10-06', valor_unitario: 0.27, total: 25.82, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-06', valor_unitario: 0.24, total: 22.89, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-04', valor_unitario: 0.24, total: 23.31, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-24', valor_unitario: 0.25, total: 24.07, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-05', valor_unitario: 0.24, total: 26.89, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-05', valor_unitario: 0.21, total: 23.69, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-07', valor_unitario: 0.22, total: 25.52, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-05-06', valor_unitario: 0.23, total: 26.18, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-04', valor_unitario: 0.23, total: 26.38, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-07-07', valor_unitario: 0.23, total: 26.05, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SGOV, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2024-03-27', valor_unitario: 1.54, total: 11.42, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2024-07-02', valor_unitario: 1.25, total: 14.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2024-01-10', valor_unitario: 1.14, total: 13.17, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2025-03-31', valor_unitario: 1.28, total: 16.89, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2025-07-04', valor_unitario: 1.22, total: 16.26, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2025-10-01', valor_unitario: 1.22, total: 16.27, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2025-12-24', valor_unitario: 1.24, total: 16.79, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2026-03-31', valor_unitario: 1.87, total: 25.35, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },
            { data: '2026-06-30', valor_unitario: 1.37, total: 16.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.VOO, CarteiraId: CARTEIRA.MAGAR_USA },

            { data: '2025-06-26', valor_unitario: 0.64, total: 237.30, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-26', valor_unitario: 0.68, total: 272.05, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-26', valor_unitario: 1.96, total: 119.70, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-26', valor_unitario: 1.96, total: 281.73, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAPR11, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2024-06-28', valor_unitario: 0.09, total: 96.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-30', valor_unitario: 0.50, total: 516.21, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-27', valor_unitario: 0.12, total: 96.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-30', valor_unitario: 0.07, total: 80.04, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-30', valor_unitario: 0.06, total: 66.40, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-30', valor_unitario: 0.08, total: 94.87, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-30', valor_unitario: 0.07, total: 59.69, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-06-30', valor_unitario: 0.33, total: 441.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.06, total: 145.87, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.32, total: 441.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.06, total: 66.40, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.14, total: 195.47, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.07, total: 59.69, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.08, total: 94.87, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.07, total: 80.04, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-30', valor_unitario: 0.08, total: 107.70, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-30', valor_unitario: 0.09, total: 120.39, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-30', valor_unitario: 0.08, total: 134.86, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-30', valor_unitario: 0.08, total: 118.80, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-06-30', valor_unitario: 0.08, total: 158.35, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CMIG4, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2025-06-30', valor_unitario: 0.31, total: 219.83, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-13', valor_unitario: 0.17, total: 0.17, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.AAPL, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-05-14', valor_unitario: 0.38, total: 0.38, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.AAPL, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-08-08', valor_unitario: 0.39, total: 211.48, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: 24, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-08-11', valor_unitario: 0.43, total: 303.28, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.CSMG3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-08', valor_unitario: 0.03, total: 52.06, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.KEPL3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-08', valor_unitario: 0.11, total: 183.94, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.KEPL3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-09-08', valor_unitario: 0.07, total: 7.65, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.POMO4, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-09-08', valor_unitario: 0.07, total: 7.50, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.POMO4, CarteiraId: CARTEIRA.DIVERSAS },            

            //SAUD3
            { data: '2024-08-21', valor_unitario: 0.04, total: 26.69, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-08-21', valor_unitario: 0.36, total: 276.32, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-18', valor_unitario: 0.41, total: 313.97, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2024-12-18', valor_unitario: 0.13, total: 101.19, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-01-29', valor_unitario: 0.03, total: 25.50, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-04', valor_unitario: 0.16, total: 118.51, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-04', valor_unitario: 0.23, total: 171.28, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-04', valor_unitario: 0.03, total: 21.68, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-10', valor_unitario: 0.21, total: 202.59, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-10', valor_unitario: 0.22, total: 207.60, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-10', valor_unitario: 0.15, total: 142.50, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-10', valor_unitario: 0.04, total: 40.15, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-10', valor_unitario: 0.04, total: 36.98, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-10', valor_unitario: 0.03, total: 31.94, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-10', valor_unitario: 0.04, total: 38.91, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.SAUD3, CarteiraId: CARTEIRA.MAGAR_BRASIL },


            { data: '2025-03-13', valor_unitario: 0.58, total: 0.58, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.MSFT, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-06-12', valor_unitario: 0.58, total: 0.58, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.MSFT, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-09-12', valor_unitario: 0.58, total: 0.58, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.MSFT, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-12-11', valor_unitario: 0.64, total: 0.64, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.MSFT, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-03-12', valor_unitario: 0.64, total: 1.27, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.MSFT, CarteiraId: CARTEIRA.DIVERSAS },

            //CONY
            { data: '2025-08-25', valor_unitario: 2.41, total: 8.67, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-09-23', valor_unitario: 3.17, total: 11.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-10-17', valor_unitario: 3.11, total: 11.21, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-10-24', valor_unitario: 0.83, total: 3.14, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-10-31', valor_unitario: 1.20, total: 4.52, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-11-07', valor_unitario: 0.79, total: 2.98, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-11-14', valor_unitario: 0.74, total: 2.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-11-21', valor_unitario: 0.56, total: 2.13, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-12-01', valor_unitario: 0.58, total: 2.20, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-12-05', valor_unitario: 1.01, total: 3.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-12-12', valor_unitario: 0.35, total: 1.31, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-12-19', valor_unitario: 0.45, total: 1.71, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2025-12-29', valor_unitario: 0.44, total: 1.66, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-01-05', valor_unitario: 0.39, total: 1.46, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-01-09', valor_unitario: 0.36, total: 1.37, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-01-16', valor_unitario: 0.35, total: 1.33, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-01-23', valor_unitario: 0.20, total: 0.75, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-01-30', valor_unitario: 0.28, total: 1.04, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-02-06', valor_unitario: 0.25, total: 0.95, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-02-13', valor_unitario: 0.23, total: 0.86, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-02-20', valor_unitario: 0.27, total: 1.01, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-02-27', valor_unitario: 0.28, total: 1.07, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-03-06', valor_unitario: 0.28, total: 1.05, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-03-13', valor_unitario: 0.55, total: 2.09, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-03-20', valor_unitario: 0.55, total: 2.06, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-03-27', valor_unitario: 0.68, total: 2.56, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-04-06', valor_unitario: 0.34, total: 1.27, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-04-10', valor_unitario: 0.34, total: 1.27, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-04-17', valor_unitario: 0.34, total: 1.29, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-04-24', valor_unitario: 0.37, total: 1.40, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-05-01', valor_unitario: 0.47, total: 1.78, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-05-08', valor_unitario: 0.40, total: 1.50, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-05-15', valor_unitario: 0.39, total: 1.89, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-05-22', valor_unitario: 0.14, total: 0.67, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-05-22', valor_unitario: 0.10, total: 0.48, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-05-29', valor_unitario: 0.07, total: 0.36, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-06-05', valor_unitario: 0.20, total: 0.94, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-06-11', valor_unitario: 0.26, total: 1.27, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-06-12', valor_unitario: 0.19, total: 0.90, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-06-22', valor_unitario: 0.20, total: 0.96, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-06-26', valor_unitario: 0.18, total: 0.87, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },
            { data: '2026-07-06', valor_unitario: 0.17, total: 0.80, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.CONY, CarteiraId: CARTEIRA.DIVERSAS },

            //ISAE4
            { data: '2025-01-21', valor_unitario: 0.72, total: 257.53, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-02-21', valor_unitario: 0.67, total: 257.43, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-03-21', valor_unitario: 0.67, total: 257.53, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-11-28', valor_unitario: 0.19, total: 73.63, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-12', valor_unitario: 0.19, total: 73.63, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-30', valor_unitario: 0.48, total: 290.40, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-01-28', valor_unitario: 0.60, total: 494.82, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-02-25', valor_unitario: 0.21, total: 127.79, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-03-31', valor_unitario: 0.21, total: 127.79, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-30', valor_unitario: 0.14, total: 84.78, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-30', valor_unitario: 0.14, total: 84.78, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2026-04-30', valor_unitario: 0.14, total: 84.78, TipoProventoId: TIPO_PROVENTO.JCP, TickerId: TICKER.ISAE4, CarteiraId: CARTEIRA.MAGAR_BRASIL },

            { data: '2025-12-17', valor_unitario: 0.14, total: 245.19, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.KEPL3, CarteiraId: CARTEIRA.MAGAR_BRASIL },
            { data: '2025-12-26', valor_unitario: 0.14, total: 245.19, TipoProventoId: TIPO_PROVENTO.DIVIDENDOS, TickerId: TICKER.KEPL3, CarteiraId: CARTEIRA.MAGAR_BRASIL },

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
    DECLARE done INT DEFAULT FALSE;
    DECLARE op_id, op_type INT;
    DECLARE op_qty, op_price, op_taxas DECIMAL(18,4);
    
    -- Variáveis para o cálculo PADRÃO (Preço Médio)
    DECLARE current_pm, current_qty, last_sale_price DECIMAL(18,4) DEFAULT 0;
    DECLARE v_investido_padrao DECIMAL(18,2);

    -- Variáveis para o NOVO cálculo (Lógica da Planilha/Pico)
    DECLARE v_max_qty DECIMAL(18,4) DEFAULT 0; 
    DECLARE v_valor_investido_custom DECIMAL(18,2) DEFAULT 0; 
    DECLARE v_qty_excedente DECIMAL(18,4);
    DECLARE v_taxa_proporcional DECIMAL(18,4);

    -- === NOVAS VARIÁVEIS: Cálculo do PREÇO MÉDIO HISTÓRICO (Só Compras) ===
    DECLARE v_total_qty_compras DECIMAL(18,4) DEFAULT 0;
    DECLARE v_total_fin_compras DECIMAL(18,4) DEFAULT 0;
    DECLARE v_pm_historico DECIMAL(18,4) DEFAULT 0;

    -- Variáveis auxiliares
    DECLARE v_proventos DECIMAL(18,2);
    DECLARE v_lucro_realizado DECIMAL(18,2);

    -- CURSOR ORIGINAL (Sem o JOIN que deu erro)
    DECLARE cur CURSOR FOR 
        SELECT id, TipoOperacaoId, quantidade, valor_unitario, taxas
        FROM operacaos 
        WHERE CarteiraId = carteira_id AND TickerId = ticker_id 
        ORDER BY data, id; 
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Limpa dados antigos do dashboard
    DELETE FROM Dashboards WHERE tickerid = ticker_id AND CarteiraId = carteira_id;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO op_id, op_type, op_qty, op_price, op_taxas;
        IF done THEN LEAVE read_loop; END IF;

        -- =========================================================================
        -- LÓGICA 0: ACUMULADORES PARA PM HISTÓRICO (Só Compras)
        -- =========================================================================
        -- Acumula quantidade e financeiro de todas as entradas
        IF op_type IN (1, 3, 4) THEN
             SET v_total_qty_compras = v_total_qty_compras + op_qty;
             
             IF op_price > 0 OR op_taxas > 0 THEN
                 SET v_total_fin_compras = v_total_fin_compras + (op_qty * op_price + op_taxas);
             END IF;
        END IF;

        -- =========================================================================
        -- LÓGICA 1: CÁLCULO DO "VALOR_INVESTIDO" (Lógica da Planilha)
        -- =========================================================================
        IF op_type IN (1, 3, 4) THEN 
            
            IF (current_qty + op_qty) > v_max_qty THEN
                SET v_qty_excedente = (current_qty + op_qty) - v_max_qty;
                
                IF v_qty_excedente > op_qty THEN 
                    SET v_qty_excedente = op_qty; 
                END IF;

                SET v_taxa_proporcional = 0;
                IF op_qty > 0 THEN
                    SET v_taxa_proporcional = (op_taxas / op_qty) * v_qty_excedente;
                END IF;

                IF op_price > 0 THEN
                     SET v_valor_investido_custom = v_valor_investido_custom + (v_qty_excedente * op_price) + v_taxa_proporcional;
                END IF;

                SET v_max_qty = current_qty + op_qty;
            END IF;
        END IF;

        -- =========================================================================
        -- LÓGICA 2: CÁLCULO PADRÃO (PM Contábil)
        -- =========================================================================
        IF op_type = 2 THEN 
             SET last_sale_price = op_price;
        END IF;
        
        IF op_type IN (1, 3, 4) THEN 
             IF (current_qty + op_qty) > 0 THEN 
                 IF op_price > 0 OR op_taxas > 0 THEN
                    SET current_pm = ((current_qty * current_pm) + (op_qty * op_price + op_taxas)) / (current_qty + op_qty);
                 ELSE 
                    SET current_pm = (current_qty * current_pm) / (current_qty + op_qty);
                 END IF;
             END IF;
             SET current_qty = current_qty + op_qty;
             
        ELSEIF op_type = 2 THEN 
             SET current_qty = current_qty - op_qty;
             IF current_qty <= 0 THEN
                SET current_qty = 0;
                SET current_pm = 0; 
             END IF;
        END IF;
        
    END LOOP;
    CLOSE cur;
    
    -- Ajustes finais
    IF current_qty = 0 AND last_sale_price > 0 THEN SET current_pm = last_sale_price; END IF;
    SET v_investido_padrao = current_qty * current_pm;
    
    -- === CÁLCULO FINAL PM HISTÓRICO ===
    IF v_total_qty_compras > 0 THEN
        SET v_pm_historico = v_total_fin_compras / v_total_qty_compras;
    ELSE
        SET v_pm_historico = 0;
    END IF;
    
    SELECT COALESCE(SUM(total), 0) INTO v_proventos 
    FROM provento WHERE CarteiraId = carteira_id AND TickerId = ticker_id;
    
    SET v_lucro_realizado = 0; 

    -- Inserção Final com a nova coluna
    INSERT INTO Dashboards (
        CarteiraId, tickerid, preco_medio, quantidade, 
        investido, 
        valor_investido, 
        preco_medio_historico, -- <--- Coluna Nova
        proventos, lucro_realizado
    )
    VALUES (
        carteira_id, ticker_id, ROUND(current_pm, 2), current_qty, 
        ROUND(v_investido_padrao, 2), 
        ROUND(v_valor_investido_custom, 2), 
        ROUND(v_pm_historico, 2), -- <--- Valor Novo
        v_proventos, v_lucro_realizado
    );
    
END;

`;
  
await sequelize.query(sql);
}

// // Função para criar procedimentos armazenados
// async function createStoredProcedures() {
//     const sql = `

// CREATE PROCEDURE atualiza_dashboards(carteira_id INT, ticker_id INT)
// BEGIN
//     -- Declarações devem vir todas no início
//     DECLARE done INT DEFAULT FALSE;
//     DECLARE op_id, op_type INT;
//     DECLARE op_qty, op_price, op_taxas DECIMAL(18,4);
//     DECLARE current_pm, current_qty, last_sale_price DECIMAL(18,4) DEFAULT 0;
//     DECLARE ultima_posicao_id INT;
    
//     -- Declaração do cursor deve vir após todas as DECLARE
//     DECLARE cur CURSOR FOR 
//         SELECT 
//             id,
//             TipoOperacaoId,
//             quantidade,
//             valor_unitario,
//             taxas
//         FROM operacaos 
//         WHERE CarteiraId = carteira_id 
//             AND TickerId = ticker_id
//             AND PosicaoAtivoId = ultima_posicao_id
//         ORDER BY data, id;
    
//     -- Handler deve vir após o cursor
//     DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
//     -- Agora sim, o código executável começa aqui
//     -- 1. Encontra a última PosicaoAtivoId para este ativo
//     SELECT MAX(PosicaoAtivoId) INTO ultima_posicao_id
//     FROM operacaos 
//     WHERE CarteiraId = carteira_id 
//         AND TickerId = ticker_id;
    
//     -- Remove dados existentes
//     DELETE FROM Dashboards
//     WHERE tickerid = ticker_id AND CarteiraId = carteira_id;
    
//     OPEN cur;
//     read_loop: LOOP
//         FETCH cur INTO op_id, op_type, op_qty, op_price, op_taxas;
//         IF done THEN
//             LEAVE read_loop;
//         END IF;
        
//         -- Guarda o preço da última venda (apenas da última posição)
//         IF op_type = 2 THEN -- Venda
//             SET last_sale_price = op_price;
//         END IF;
        
//         -- Proteção contra divisão por zero
//         IF (current_qty + op_qty) = 0 AND op_type IN (1, 3, 4) THEN
//             -- Se for uma operação de entrada que resultaria em divisão por zero, usa o preço da operação
//             SET current_pm = op_price + (op_taxas / op_qty);
//             SET current_qty = current_qty + op_qty;
//         ELSE
//             CASE op_type
//                 WHEN 1 THEN -- Compra
//                     SET current_pm = ((current_qty * current_pm) + (op_qty * op_price + op_taxas)) / (current_qty + op_qty);
//                     SET current_qty = current_qty + op_qty;
                    
//                 WHEN 3 THEN -- Bonificação
//                     IF op_price > 0 THEN -- Bonificação COM valor
//                         SET current_pm = ((current_qty * current_pm) + (op_qty * op_price + op_taxas)) / (current_qty + op_qty);
//                     END IF;
//                     SET current_qty = current_qty + op_qty;
                    
//                 WHEN 4 THEN -- Subscrição
//                     IF op_price > 0 THEN -- Subscrição COM valor
//                         SET current_pm = ((current_qty * current_pm) + (op_qty * op_price + op_taxas)) / (current_qty + op_qty);
//                     END IF;
//                     SET current_qty = current_qty + op_qty;
                    
//                 WHEN 2 THEN -- Venda
//                     SET current_qty = current_qty - op_qty;
//             END CASE;
//         END IF;
        
//     END LOOP;
//     CLOSE cur;
    
//     -- Se quantidade for zero, usa o preço da última venda
//     IF current_qty = 0 AND last_sale_price > 0 THEN
//         SET current_pm = last_sale_price;
//     END IF;
    
//     -- Garante que PM não seja NULL
//     IF current_pm IS NULL THEN
//         SET current_pm = 0;
//     END IF;
    
//     -- Calcula o valor investido
//     SET @investido = current_qty * current_pm;
    
//     -- Calcula proventos (considera todos os proventos do ativo)
//     SELECT COALESCE(SUM(total), 0) INTO @proventos 
//     FROM provento 
//     WHERE CarteiraId = carteira_id AND TickerId = ticker_id;
    
//     -- Calcula lucro realizado (apenas da última posição)
//     SET @lucro_realizado = 0;
    
//     -- Insere resultado final
//     INSERT INTO Dashboards (CarteiraId, tickerid, preco_medio, quantidade, investido, proventos, lucro_realizado)
//     VALUES (carteira_id, ticker_id, ROUND(current_pm, 2), current_qty, ROUND(@investido, 2), @proventos, @lucro_realizado);
    
// END;

// `;
  
// await sequelize.query(sql);
// }

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
    
//     -- 0. Captura a última PosicaoAtivoId
//     ultima_posicao AS (
//         SELECT MAX(PosicaoAtivoId) AS PosicaoAtivoId
//         FROM operacaos
//         WHERE CarteiraId = carteira_id
//           AND TickerId = ticker_id
//     ),

//     -- 1. Calcula o saldo atual do ativo para a carteira específica
//     saldo_atual AS (
//         SELECT 
//             CarteiraId,
//             TickerId,
//             (SUM(CASE WHEN TipoOperacaoId = 1 THEN quantidade ELSE 0 END) +  -- Compras
//              SUM(CASE WHEN TipoOperacaoId = 3 THEN quantidade ELSE 0 END) +  -- Bonificações
//              SUM(CASE WHEN TipoOperacaoId = 4 THEN quantidade ELSE 0 END) -  -- Subscrições
//              SUM(CASE WHEN TipoOperacaoId = 2 THEN quantidade ELSE 0 END)) AS saldo  -- Vendas
//         FROM operacaos o, ultima_posicao up
//         WHERE CarteiraId = carteira_id
//             AND TickerId = ticker_id
//             AND o.PosicaoAtivoId = up.PosicaoAtivoId
//         GROUP BY CarteiraId, TickerId
//         HAVING saldo > 0
//     ),
    
//     -- 2. Ordena as operações por data DESC (compras, bonificações e subscrições)
//     -- operacoes_ordenadas AS (
//     --    SELECT 
//     --        o.*
//     --    FROM operacaos o, ultima_posicao up
//     --    WHERE o.TipoOperacaoId IN (1, 3, 4)  -- 1 = compra, 3 = bonificação, 4 = subscrição
//     --    AND 
//     --    o.CarteiraId = carteira_id
//     --    AND o.TickerId = ticker_id
//     --    AND o.PosicaoAtivoId = up.PosicaoAtivoId
//     --    ORDER BY data DESC
//     -- ),
    
//     -- 5. Calcula preço médio e valor investido com base nas última posição do ativo
//     dados_ativos AS (
//         SELECT 
//             p.CarteiraId,
//             p.TickerId,
//             -- Preço médio (considera compras e subscrições, bonificações não entram no cálculo)
//             SUM(p.quantidade * p.valor_unitario + p.taxas) / 
//             SUM(p.quantidade) AS preco_medio,
//             SUM(p.taxas) AS taxas,
//             -- Quantidade atual
//             MAX(s.saldo) AS quantidade,
//             -- Valor investido (incluindo subscrições e bonificações)
//             SUM(p.quantidade * p.valor_unitario + p.taxas) AS investido
//         FROM operacaos p, saldo_atual s, ultima_posicao up
//         WHERE p.quantidade > 0
//         AND p.CarteiraId = carteira_id
//         AND p.TickerId = ticker_id
//         AND p.PosicaoAtivoId = up.PosicaoAtivoId
//         AND p.TipoOperacaoId IN (1, 3, 4)  -- 1 = compra, 3 = bonificação, 4 = subscrição
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
//         ROUND(da.preco_medio * da.quantidade + da.taxas, 2) AS investido,
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
