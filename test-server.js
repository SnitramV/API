const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3001; // Usando uma porta diferente para não haver conflitos

// --- Configuração do Swagger ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Teste',
      version: '1.0.0',
      description: 'Um teste mínimo para o Swagger',
    },
  },
  // IMPORTANTE: Vamos especificar o ficheiro diretamente
  apis: [__filename], // Isto diz para ler as anotações deste próprio ficheiro
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// --- Rota da Documentação ---
app.use('/api-docs-test', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /test:
 * get:
 * summary: Retorna uma mensagem de teste
 * description: Endpoint para verificar se a documentação funciona.
 * responses:
 * '200':
 * description: Sucesso
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "O Swagger está a funcionar!"
 */
app.get('/test', (req, res) => {
  res.json({ message: 'O Swagger está a funcionar!' });
});

app.listen(port, () => {
  console.log(`Servidor de teste a correr em http://localhost:${port}`);
  console.log(`Documentação de teste disponível em http://localhost:${port}/api-docs-test`);
});