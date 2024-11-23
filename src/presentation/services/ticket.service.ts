import { UUID } from "../../config";
import { TicketConfig, TicketEntity } from "../../domains/entities";
import { CustomError } from "../../domains/errors";
import { TicketStatusResponse } from "../../domains/interfaces";
import { WssService } from "./wss.service";



export class TicketService {
  // arreglo de tickets disponibles
  private _tickets: Array<TicketEntity> = 
  Array.from({ length: 6 }, () => 1)
  .map( (e, i) => new TicketEntity({ id: UUID.generateId(), number: i + 1, createdAt: new Date(), }) );
  // tickets que se encuentran activos o en mesas de trabajo
  private _onWorkingTickets: Array<TicketEntity> = [];




  constructor(
    private readonly wss: WssService,
  ){ }

  /**
   * Obtener todos los tickets
   * @returns `TicketEntity[]`
   */
  public async allTickets():Promise<Array<TicketEntity>>{
    const tickets = [...this._tickets];
    if( tickets.length <= 0 ) throw CustomError.notFound('unavailable tickets');
    return tickets;
  }

  /**
   * Obtener todos los tickets pendientes
   * @returns `TicketEntity[]`
   */
  public async pendingTickets(): Promise<Array<TicketEntity>>{    
    const tickets = [...this._tickets.filter( t => !t.handleDesk )];
    console.log(tickets.length);
    
    if( tickets.length <= 0 ) throw CustomError.notFound('unavailable pending tickets');
    return tickets;
  }

  /**
   * Obtener los tickets trabajando actualmente
   * @param omitEmtyError boolean = false
   * @returns `Promise<TicketEntity[]>`
   */
  public async lastWorkingOnTickets(omitEmtyError: boolean = false): Promise<Array<TicketEntity>>{
    const tickets = [...this._onWorkingTickets];
    if( !omitEmtyError && tickets.length <= 0 ) throw CustomError.notFound('unavailable on working tickets');
    return tickets;
  }

  /**
   * Obtener el numero del ultimo ticket
   * @returns `Promise<number>`
   */
  public async lastTicketNumber(): Promise<number>{
    const length = this._tickets.length;
    return ( length > 0 ) 
    ? this._tickets[length - 1].number 
    : 0;
  }

  /**
   * Agregar un nuevo ticket
   * @returns `Promise<TicketEntity>`
   */
  public async createTicket(): Promise<TicketEntity> {
    const newTicket : TicketEntity = new TicketEntity({
      id: UUID.generateId(),
      number: await this.lastTicketNumber() + 1,
      createdAt: new Date(),
    });
    this._tickets.push( newTicket );
    await this._notifyOnticketNumberChanged()
    return newTicket;
  }

  /**
   * Asignar un ticket a una mesa / escritorio
   * @param desk string
   * @returns `Promise<TicketEntity>`
   */
  public async drawTicket(desk: string): Promise<TicketStatusResponse>{
    const ticket : undefined | TicketEntity = this._tickets.find( t => !t.handleDesk );
    if( !ticket ) throw CustomError.notFound('No pending tickets');

    ticket.handleDesk = desk;
    ticket.createdAt = new Date();

    // moviendo el ticket a los tickets trabajando
    this._addOnWorkingTickets({...ticket}, 4);
    // notificando el numero activo en pendiente
    await this._notifyOnticketNumberChanged();
    // notificando los tickets activos en mesa
    await this._notifyOnWorkingTickets();
    return {ticket, status: 'ok'};
  }

  /**
   * Maracr un ticket como completado
   * @param id string
   * @returns `Promise<TicketStatusResponse>`
   */
  public async onFinishedTicket( id: string ): Promise<TicketStatusResponse>{
    let ticket : undefined | TicketEntity = this._tickets.find( t => t.id === id );
    if( !ticket ) throw CustomError.badRequest('Ticket not found');

    this._tickets = this._tickets
    .map( t => {
      if( t.id === id ){ 
        t.done = true;
        t.completedAt = new Date();
        ticket = t;
      }
      return t;
    });
    
    await this._notifyOnticketNumberChanged();
    
    return { ticket, status: 'ok' };
  }

  /**
   * Restablecer el numero de tickets y todo a 0
   * @returns Promise<boolean>
   */
  public async resetAll(): Promise<boolean>{
    this._tickets = [];
    this._onWorkingTickets = [];
    await this._notifyResetAll();
    return true;
  }

  /**
   * Agregar un nuevo ticket a los tickets activamente trabajando
   * @param ticketData TicketConfig
   * @param maxLenghtSize number
   */
  private _addOnWorkingTickets(ticketData: TicketConfig, maxLenghtSize: number): void {
    const newTicket = new TicketEntity( ticketData );
    this._onWorkingTickets.unshift( newTicket );
    // removiendo el ticket final si la longitud es mayor a la especificada
    if( this._onWorkingTickets.length > maxLenghtSize ) this._onWorkingTickets.pop();
  }

  /**
   * Notificar del numero de tickets disponibles a traves de wss
   */
  private async _notifyOnticketNumberChanged(): Promise<void>{
    const length = [...this._tickets.filter( t => !t.handleDesk )].length;    
    this.wss.send('on-ticket-count-change', length);
  }

  /**
   * Notificar los tickets disponibles en mesa a traves de wss
   */
  private async _notifyOnWorkingTickets(): Promise<void>{
    const tickets = await this.lastWorkingOnTickets(true);
    this.wss.send('on-working-tickets-change', tickets);
  }

  /**
   * Notificar los tickets disponibles en mesa a traves de wss
   */
  private async _notifyResetAll(): Promise<void>{
    this.wss.send('on-reset-all-change', {});
  }

}