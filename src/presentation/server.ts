import { Server as ServerType } from 'http';
import { join } from 'path';
import express from 'express';
import type {Express, NextFunction, Request, Router} from 'express';
import morgan from 'morgan';
import SwaggerUI from 'swagger-ui-express';
import { swaggerSetupOptions } from '../config';

export interface ServerConfig {
  port:number;
  publicDirFiles?: string;
  // routes: Router;
}

/**
 * Clase del servidor implementado con express
 */
export class Server {

  private          _serverListen : undefined | ServerType;
  private readonly _serverApp : Express = express();
  private readonly _port : number;
  private readonly _publicDir : string;
  // private readonly _routes: Router;

  constructor(config:ServerConfig){
    this._port = config.port;
    this._publicDir = config.publicDirFiles ?? 'public';
    // this._routes = config.routes;
    this._initializeConfiguration();
  }

  /**
   * Iniciar configuracion del servidor
   */
  private _initializeConfiguration(): void {
    // middleware
    // this._serverApp.use(this._logRequestPathMiddleWare);
    this._serverApp.disable('x-powered-by');
    this._serverApp.use(morgan('dev'));
    this._serverApp.use(express.json());
    this._serverApp.use(express.urlencoded({extended:true}));

    // ruta para la documentacion con swagger
    this._serverApp.use('/api/v1/docs', SwaggerUI.serve, SwaggerUI.setup( swaggerSetupOptions ));

    // rutas del servidor
    // this._serverApp.use('/api/v1', this._routes);
    
    // sirviendo archivos estaticos de la apicacion
    this._serverApp.use(express.static(this._publicDir));

    // resolviendo conflicto al cargar la aplicacion desde cualquier ruta de la misma
    this._serverApp.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = join(__dirname, '../../', this._publicDir, 'index.html');
      res.statusCode = 200;
      res.sendFile(indexPath);     
    });
  }

  /**
   * Inicializar las rutas del servidor
   * @param routes Router
   */
  public addRoutes(routes: Router){
    this._serverApp.use('/api/v1', routes);
  }

  /**
   * Levantar el servidor
   */
  public async start(): Promise<void>{
    console.log(`Server running on`);

    // activando la escucha del servidor
    this._serverListen = this._serverApp.listen(this._port, () => {
      console.log(`> http://localhost:${this._port}`);      
    });
  }

  /**
   * Obtener la instancia del servidor
   */
  public get getServerApp(): Express{
    return this._serverApp;
  }

  /**
   * Terminar la ejecucion del servidor
   */
  public closeServer():void {
    this._serverListen?.close();
  }

  private _logRequestPathMiddleWare(req:Request, _:unknown, next:NextFunction){
    console.log(`${req.method.toUpperCase()} ${req.url}`);
    next();
  }

}