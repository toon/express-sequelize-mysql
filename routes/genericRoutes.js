const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');
const models = require('../models'); // Importa todos os modelos automaticamente
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/:modelName/import-csv', upload.single('file'), async (req, res) => {
  console.log(req.file); // Verifica se o arquivo foi carregado
  
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi carregado');
  }

  const { modelName } = req.params;

  // Verifica se o modelo existe
  const model = models[modelName];
  if (!model) {
    return res.status(404).json({ error: 'Modelo não encontrado' });
  }

  // Chama o controller genérico para importação
  await genericController.importCsv(req, res, model);
});

// Função para gerar rotas CRUD genéricas
Object.keys(models).forEach((key) => {

  const model = models[key];

  // Define rotas CRUD genéricas
  router.post(`/${key}`, genericController.create(model));
  router.get(`/${key}`, genericController.getAll(model));
  router.get(`/${key}s`, genericController.getAllwithAssociations(model));
  router.put(`/${key}/:id`, genericController.update(model));
  router.delete(`/${key}/:id`, genericController.remove(model));

});

// Rota genérica para atualizar relações N para M
// Exemplo: Atualizar as moedas associadas à estratégia 1
// Rota: /relation/Estrategia/1/ParMoeda
router.put('/putmanytomany/:modelName/:id/:relatedModelName', async (req, res) => {

  await genericController.updateManyToManyRelation(req, res);

});

// Rota genérica para associações N para M
// Exemplo para listar todas as moedas e uma lista de id's das moedas cuja estratégia 1 esteja relacionada
// /getmanytomany/Estrategia/1/ParMoeda/
router.get('/getmanytomany/:modelName/:id/:relatedModelName', async (req, res) => {

  const { modelName, id, relatedModelName } = req.params;

  // Obtém os modelos principal e relacionado com base nos parâmetros da URL
  const Model = models[modelName];
  const RelatedModel = models[relatedModelName];

  if (!Model || !RelatedModel) {
    return res.status(404).json({ error: 'Model not found' });
  }

  try {
    // Encontra a associação correspondente
    const relationName = Object.keys(Model.associations).find(assocName =>
      Model.associations[assocName].target === RelatedModel
    );

    if (!relationName) {
      return res.status(400).json({ error: 'No association found between these models' });
    }

    // Chama a função getAllWithRelated do controlador genérico
    await genericController.getAllWithRelated(Model, RelatedModel, relationName)(req, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  
});

// Rota genérica para agregrações
// Exemplo:
// /getaggregation/Estrategia/1/ParMoeda/
// Model, aggregationField, aggregationType, filter, filterValue
router.get('/aggregation/:ModelName/:aggregationField/:aggregationType/:filter', async (req, res) => {

  const { ModelName, aggregationField, aggregationType, filter } = req.params;

  // Obtém os modelos principal e relacionado com base nos parâmetros da URL
  const Model = models[ModelName];

  if (!Model) {
    return res.status(404).json({ error: 'Model not found' });
  }

  try {
    // Chama a função getAllWithRelated do controlador genérico
    await genericController.getAllWithAggregations(Model, aggregationField, aggregationType, filter)(req, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  
});

module.exports = router;
