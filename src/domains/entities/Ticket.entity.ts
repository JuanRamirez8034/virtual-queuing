abstract class TicketModel {
  abstract completedAt?: Date;
  abstract createdAt  ?: Date;
  abstract done       ?: boolean;
  abstract handleDesk ?: string;
  abstract id          : string;
  abstract number      : number;
}

export interface TicketConfig extends TicketModel {}

/**
 * Entidad de un ticket
 */
export class TicketEntity implements TicketModel {
  public completedAt?: Date | undefined;
  public createdAt  ?: Date | undefined;
  public done       ?: boolean | undefined;
  public handleDesk ?: string | undefined;
  public id          : string;
  public number      : number;

  /**
   * Inicializar una entidad de ticket
   * @param inValues TicketConfig
   */
  constructor(inValues: TicketConfig){
    this.completedAt = inValues.completedAt;
    this.createdAt   = inValues.createdAt;
    this.done        = !!inValues.done;
    this.handleDesk  = inValues.handleDesk;
    this.id          = inValues.id;
    this.number      = inValues.number;
  }

}