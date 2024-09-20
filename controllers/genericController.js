const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/db');
const models = require('../models');
const fs = require('fs');
const csvParser = require('csv-parser');

const importCsv = async (req, res, model) => {
  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => {
        // Verifica e remove o "BOM" da primeira chave (se presente)
        const keys = Object.keys(data);
        if (keys[0].charCodeAt(0) === 65279) {
          const cleanKey = keys[0].replace(/^\uFEFF/, ''); // Remove o BOM
          data[cleanKey] = data[keys[0]]; // Corrige o campo
          delete data[keys[0]]; // Remove o campo incorreto
        }
        
        results.push(data);
    })
    .on('end', async () => {
      try {
        console.log(results);
        // Inserir dados no banco de forma dinâmica com base no modelo recebido
        await model.bulkCreate(results);
        res.json({ message: 'Dados importados com sucesso!' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao importar dados.' });
      } finally {
        fs.unlinkSync(filePath); // Apaga o arquivo após o processamento
      }
    });
};

// Função genérica para obter registros com associação, agregação e filtros dinâmicos via query params
const getAllWithAggregations = (Model, aggregationField, aggregationType, filter) => async (req, res) => {
    try {
        const { ativos } = req.query;  // 'ativos' será uma lista de códigos passada na query string
        const listaAtivos = ativos ? ativos.split(',') : [];  // Converte a lista de ativos em array
        let where = {};
        
        if (listaAtivos.length > 0) {
            where[filter] = {
                [Op.in]: listaAtivos  // Aplica o filtro para múltiplos ativos
            };
        }

        const agregacao = await Model.findAll({
            attributes: [
                filter,
                [fn(aggregationType, col(aggregationField)), `agg_${aggregationField}`]
            ],
            where,
            group: [filter]
        });

        res.json(agregacao);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter agregação' });
    }
};

const getAllwithAssociations = (Model) => async (req, res) => {
    try {
        const query = req.query; // Captura os parâmetros de query da requisição
        let where = {};

        // Para cada campo em query, adicionar uma condição no objeto where
        Object.keys(query).forEach(key => {
            if (Array.isArray(query[key])) {
                // Se o valor for um array, usar o operador 'IN'
                where[key] = { [Op.in]: query[key] };
            } else {
                // Caso contrário, usar o operador 'LIKE' para buscas parciais
                where[key] = { [Op.like]: `%${query[key]}%` };
            }
        });

        // Identificar e incluir associações automaticamente
        const include = [];
        if (Model.associations) {
            // Adiciona as associações ao include
            Object.keys(Model.associations).forEach(association => {
                include.push(Model.associations[association]);
            });
        }

        // Incluir dados relacionados com base nas associações encontradas
        const items = await Model.findAll({ where, include });

        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Função para obter todos os itens relacionados a partir de uma relação N:M
const getAllWithRelated = (Model, RelatedModel, relationName) => async (req, res) => {
    const { id } = req.params;
    try {
        // Encontra o item principal pelo ID e inclui os itens relacionados
        const item = await Model.findByPk(id, {
            include: RelatedModel
        });

        // Encontra todos os itens do modelo relacionado
        const allRelatedItems = await RelatedModel.findAll();

        // Se o item não for encontrado, retorne 404
        if (!item) {
            return res.status(404).send('Item not found');
        }

        // Extraia os IDs dos itens relacionados
        const relatedItemIds = item[relationName].map(related => related.id);

        // Resposta com todos os itens e os IDs relacionados
        res.status(200).json({
            allRelatedItems,
            relatedItemIds
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Função para obter todos os registros com suporte a query params
const getAll = (Model) => async (req, res) => {
    try {
        const query = req.query; // Captura os parâmetros de query da requisição
        let where = {};

        // Para cada campo em query, adicionar uma condição no objeto where
        Object.keys(query).forEach(key => {
            if (Array.isArray(query[key])) {
                // Se o valor for um array, usar o operador 'IN'
                where[key] = { [Op.in]: query[key] };
            } else {
                // Caso contrário, usar o operador 'LIKE' para buscas parciais
                where[key] = { [Op.like]: `%${query[key]}%` };
            }
        });

        // Incluir dados relacionados
        const items = await Model.findAll({ where });

        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create modificado para permitir a inclusão de diversos registros por vez
const create = (Model) => async (req, res) => {
    try {
        let items;

        // Verifique se req.body é um array
        if (Array.isArray(req.body)) {
            // Use bulkCreate para inserir vários itens, ignorando duplicatas
            items = await Model.bulkCreate(req.body, {
                ignoreDuplicates: true // Ignora registros duplicados
            });
        } else {
            // Se for um único item, use create
            items = await Model.create(req.body);
        }

        res.status(201).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Função para atualizar um registro
const update = (Model) => async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Model.update(req.body, { where: { id } });
        if (updated) {
            const updatedItem = await Model.findOne({ where: { id } });
            res.status(200).json(updatedItem);
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Função para remover um registro
const remove = (Model) => async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Model.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Função genérica para atualizar relações N:M
const updateManyToManyRelation = async (req, res) => {
    const { modelName, id, relatedModelName } = req.params;
    const { relatedIds } = req.body; // Array de IDs do modelo relacionado

    const transaction = await sequelize.transaction();

    try {
        // Busca os modelos dinamicamente
        const Model = models[modelName];
        const RelatedModel = models[relatedModelName];

        if (!Model || !RelatedModel) {
            return res.status(404).json({ error: 'Model not found' });
        }

        // Encontra o registro principal pelo ID
        const item = await Model.findByPk(id, { transaction });

        if (!item) {
            return res.status(404).json({ error: `${modelName} not found` });
        }

        // Encontra a associação correspondente
        const relationName = Object.keys(Model.associations).find(assocName =>
            Model.associations[assocName].target === RelatedModel
        );

        if (!relationName) {
            return res.status(400).json({ error: `No association found between ${modelName} and ${relatedModelName}` });
        }

        // Atualiza as associações usando o método gerado dinamicamente
        await item[`set${relationName.charAt(0).toUpperCase() + relationName.slice(1)}`](relatedIds, { transaction });

        // Confirma a transação
        await transaction.commit();

        // Retorna o item atualizado com as novas associações
        const updatedItem = await Model.findByPk(id, {
            include: RelatedModel
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        // Reverte a transação em caso de erro
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    create,
    getAll,
    update,
    remove,
    getAllWithRelated,
    updateManyToManyRelation,
    getAllwithAssociations,
    getAllWithAggregations,
    importCsv,
};
