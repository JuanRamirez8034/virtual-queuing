import { TicketEntity } from "../entities";

export interface TicketStatusResponse {
  status: 'ok' | 'error';
  ticket: TicketEntity;
}