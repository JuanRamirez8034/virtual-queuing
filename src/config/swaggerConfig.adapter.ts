import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import { envs } from './envs.adapter';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Colas websockets',
      version: '1.0.0',
      description: 'Aplicacion de colas con websockets'
    },
    servers: [
      { url: `http://localhost:${ envs.PORT }/api/v1` },
      { url: `ws://localhost:${ envs.PORT }` },
    ]
  },
  apis: ['./src/presentation/**/*.ts', './src/app.ts'],
};

export const swaggerSetupOptions = swaggerJsdoc(options);