import { createServer } from 'http';
import { envs } from './config';
// import { MainRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './presentation/services/wss.service';


(async()=> {
  await main();
})();


async function main() {

  const server = new Server({
    port: envs.PORT,
  });

  const httpServer = createServer( server.getServerApp );

  /**
   * @swagger
   * components:
   *  schemas:
   *    WebSocketEvent:
   *      type: object
   *      properties:
   *        type: 
   *          type: string
   *          description: Representa el tipo de evento emitido. Puede ser 'on-ticket-count-change' (numero de tickets cambiado), 'on-working-tickets-change' (tickets que se estan trabajando actualmente), 'on-reset-all-change' (la aplicacion ha sido restablecida)
   *        payload:
   *          type: any
   *          description: Objeto que representa la data emitida por el websocket
   */

  /**
   * @swagger
   * /ws/connect:
   *  get:
   *    tags: [Websockets]
   *    summary: conexion hacia los websockets de la aplicacion, este endpoint no se debe llamar luego de las rutas "/api/vx/" ya que esta configurado en la raiz del servidor (aca no funciona la conexion, ya que solo se permite el protocolo http)
   *    responses:
   *      101:
   *        description: Conexion establecida
   *        content:
   *          text/plain:
   *            schema:
   *              type: object
   *              $ref: '#/components/schemas/WebSocketEvent'
   */
  WssService.initialize({ server: httpServer, path: '/ws/connect' });

  /**
   * Estas rutas las importe asi porque al tratarse de clases estaticas, al momento de 
   * llamar las rutas directamente desde la zona de importaciones se llamaba anteriormente al servicio wss
   * lo cual generaba un conflicto ya que se intentaba obtener la instancia del servicio cuando en realidad
   * no existia, esta forma ganrantiza que se llame/contruyan las rutas luego de inicializar el servicio de wss.
   */
  const { MainRoutes } = await import('./presentation/routes');
  server.addRoutes( MainRoutes.get );

  httpServer.listen(envs.PORT, () => {
    console.log(`Server running on\nhttp:localhost:${ envs.PORT }`);
  });

  // await server.start();
}