const { Op } = require('sequelize');

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

        // // Recupera as associações definidas no modelo
        // const associations = Model.associations ? Object.values(Model.associations) : [];

        // Incluir dados relacionados
        const items = await Model.findAll({
            where,
            // include: associations
        });

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

module.exports = {
    create,
    getAll,
    update,
    remove
};
