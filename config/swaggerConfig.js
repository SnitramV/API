const swaggerJsdoc = require('swagger-jsdoc');

// Esta função RECEBE a documentação e não importa nenhum ficheiro de rotas.
const generateSwaggerSpec = (paths) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API da Atlética Tubarão',
        version: '1.0.0',
        description: 'Documentação completa da API para a gestão da aplicação da Atlética.',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}/api`,
          description: 'Servidor de Desenvolvimento',
        },
      ],
      // Usa os caminhos que foram passados como argumento
      paths: paths,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    // Deixamos 'apis' vazio para não procurar por comentários
    apis: [],
  };

  return swaggerJsdoc(options);
};

module.exports = generateSwaggerSpec;