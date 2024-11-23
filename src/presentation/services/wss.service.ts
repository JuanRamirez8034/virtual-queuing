import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

export interface WssServerConfig {
  server: Server;
  path: string | undefined;
}

/**
 * Servicio con configuracion de Web socket server
 */
export class WssService {

  private static _instance : WssService | null = null;
  private _isListening : boolean = false;
  private readonly _wss: WebSocketServer;

  private constructor(config: WssServerConfig){
    this._wss = new WebSocketServer({ server: config.server, path: config.path });
    this.start();
  }

  /**
   * Crear instancia del servidor
   * @param config WssServerConfig
   */
  public static initialize( { server, path = '/ws' }: WssServerConfig ): void {
    if( WssService._instance ) throw 'wss server is already initialized, only one instance is allowed';
    WssService._instance = new WssService( { server, path } );
  }


  /**
   * Obtener la instancia activa del servidor wss
   */
  public static get instanceWssServer(): WssService {
    if( !WssService._instance ) throw 'wss server is not initialized';
    return WssService._instance;
  }

  /**
   * Inicializar escucha en el servidor de websockets
   * @returns booelan
   */
  public start(): boolean {
    if( this._isListening ) throw 'wss server is already listening, only one listening is allowed';

    this._wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      ws.on('close', () => console.log('Client disconnected') )
    });

    this._isListening = true;
    return this._isListening;
  }

  /**
   * Enviar un mensaje al cliente
   * @param type string
   * @param payload Object
   */
  public send(type: string, payload: Object){
    const body = JSON.stringify({ type, payload });
    this._wss.clients
    .forEach((client: WebSocket) =>{
      if(client.OPEN === client.readyState) client.send( body );
    });
  }

}