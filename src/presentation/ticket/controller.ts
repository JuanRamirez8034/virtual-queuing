import type { Request, Response } from "express";
import { HandleErrors } from "../../domains/errors";
import { WssService } from "../services/wss.service";
import { TicketService } from "../services/ticket.service";



export class TicketController {

  constructor(
    private readonly ticketService: TicketService,
    private readonly handleErrors: HandleErrors,
  ){ }


  /**
   * Obtener todos los tikets
   * @param req Request
   * @param res Response
   */
  public async getTickets(req: Request, res: Response ): Promise<void>{
    
    this.ticketService.allTickets()
    .then( tickets => res.json(tickets))
    .catch( error => this.handleErrors.resolve(res, error));
    
  }

  /**
   * Obtener el numero del ultimo ticket
   * @param req Request
   * @param res Response
   */
  public async getLastTicketNumber(req: Request, res: Response ): Promise<void>{
    
    this.ticketService.lastTicketNumber()
    .then( lastTicketNumber => res.json(lastTicketNumber))
    .catch( error => this.handleErrors.resolve(res, error));

  }

  /**
   * Obtener tickets pendientes
   * @param req Request
   * @param res Response
   */
  public async pendingTickets(req: Request, res: Response ): Promise<void>{
    
    this.ticketService.pendingTickets()
    .then( tickets => res.json(tickets))
    .catch( error => this.handleErrors.resolve(res, error));

  }

  /**
   * Crear / Registrar un numero ticket
   * @param req Request
   * @param res Response
   */
  public async createTicket(req: Request, res: Response ): Promise<void>{
    
    this.ticketService.createTicket()
    .then( ticket => res.status(201).json(ticket))
    .catch( error => this.handleErrors.resolve(res, error));

  }

  /**
   * Mover un ticket
   * @param req Request
   * @param res Response
   */
  public async drawTicket(req: Request, res: Response ): Promise<void>{
    const desk: string = req.params.desk;

    if( !desk || typeof desk !== 'string' ){
      res.status(400).json({ message: 'Invalid desk' });
      return;
    }

    this.ticketService.drawTicket( desk )
    .then( ticketStatusResp => res.json(ticketStatusResp))
    .catch( error => this.handleErrors.resolve(res, error));

  }

  /**
   * Finalizar ticket
   * @param req Request
   * @param res Response
   */
  public async ticketFinished(req: Request, res: Response ): Promise<void>{
    const ticketId: string = req.params.ticketId;

    if( !ticketId || typeof ticketId !== 'string' ){
      res.status(400).json({ message: 'Invalid ticketId' });
      return;
    }
    
    this.ticketService.onFinishedTicket( ticketId )
    .then( ticketStatusResp => res.json(ticketStatusResp))
    .catch( error => this.handleErrors.resolve(res, error));

  }

  /**
   * Ticket trabajando actualmente en una mesa o escritorio
   * @param req Request
   * @param res Response
   */
  public async workingOn(req: Request, res: Response ): Promise<void>{
    
    this.ticketService.lastWorkingOnTickets()
    .then( tickets => res.json(tickets))
    .catch( error => this.handleErrors.resolve(res, error));
    
  }

  /**
   * Restablecer todo el sistema
   * @param req Request
   * @param res Response
   */
  public async resetAll(req: Request, res: Response ): Promise<void>{
    
    this.ticketService.resetAll()
    .then( success => res.json({ message: 'success reset' }))
    .catch( error => this.handleErrors.resolve(res, error));
    
  }




}