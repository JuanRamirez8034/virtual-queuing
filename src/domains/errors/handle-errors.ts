import { Response } from "express";
import { CustomError } from "./custom-error";


/**
 * Clase presentadora de resolucion de errores
 */
export class HandleErrors {

  /**
   * Resolver un error y arrojar una respuesta desde el servidor
   * @param res Response
   * @param error unknown
   * @returns void
   */
  public resolve(resp: Response, error: unknown): void {
    // si el error es un error personalizado
    if(error instanceof CustomError){
      resp.status(error.ststusCode).json({ message: error.message });
      return;
    }

    // si el error es un error desconocido
    resp.status(500).json({ message: 'Internal error' });
    // loggear error - loggers
    console.log(`[handle error] ${error}`);
  }
}