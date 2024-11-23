import { Router } from "express";
import { TicketRoutes } from "./ticket/routes";



/**
 * Clase contenedora de las rutas para todas las entidades manejadas
 */
export class MainRoutes {

  private static _router: Router = Router();

  /**
   * Obtener todas las rutas de todas las entidades
   * @returns Router
   */
  public static get get(): Router {
    
   
    this._router.use('/ticket', TicketRoutes.routes);

    return this._router;
  }
}