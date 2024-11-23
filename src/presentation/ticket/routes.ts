import { Router } from "express";
import { HandleErrors } from "../../domains/errors";
import { TicketController } from "./controller";
import { WssService } from "../services/wss.service";
import { TicketService } from "../services/ticket.service";


export class TicketRoutes {

  private static readonly _controller : TicketController = new TicketController( 
    new TicketService(WssService.instanceWssServer),
    new HandleErrors(),
  );

  /**
   * Obtener las rutas
   */
  public static get routes(): Router {
    const router: Router = Router();

    /**
     * @swagger
     * components:
     *  schemas:
     *    Ticket:
     *      type: object
     *      properties:
     *        id:
     *          type: string
     *          description: identificador unico del ticket
     *        number:
     *          type: number
     *          description: Numero identificador del ticket
     *        done:
     *          type: boolean
     *          nullable: true
     *          description: El ticket fue atendido
     *        handleDesk:
     *          type: string
     *          description: Nombre de la mesa donde está/fue atendido el ticket
     *        createdAt:
     *          type: string
     *          nullable: true
     *          description: Fecha de creación
     *        completedAt:
     *          type: string
     *          nullable: true
     *          description: Fecha de culminación del ticket
     * 
     *    InfoStatus:
     *     type: object
     *     properties:
     *       message:
     *         type: string
     *         description: Mensaje informativo sobre lo ocurrido
     * 
     *    TicketStatus:
     *      type: object
     *      properties:
     *        status:
     *          type: string
     *          description: palabra que indica si todo fue exitoso. Opciones ['ok', 'error']
     *        ticket:
     *          $ref: '#/components/schemas/Ticket'
     * 
     *  parameters:
     *    deskName:
     *      in: path
     *      name: desk
     *      required: true
     *      schema:
     *        type: string
     *      description: Nombre de la mesa a la cual será movido el ticket
     *    ticketId:
     *      in: path
     *      name: ticketId
     *      required: true
     *      schema:
     *        type: string
     *      description: Identificador de un ticket
     */

    /**
     * @swagger
     * /ticket/reset-all:
     *  put:
     *    tags: [Ticket]
     *    summary: Restablece todos los procesos del servidor a un estado inicial, eliminando los tickets en cola, pendientes, completados y las mesas
     *    responses:
     *      200:
     *        description: La aplicación fue restablecida a la forma inicial
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *                  description: Mensaje informativo sobre lo ocurrido
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.put('/reset-all', (req, res) => this._controller.resetAll(req, res));

    /**
     * @swagger
     * /ticket:
     *  get:
     *    tags: [Ticket]
     *    summary: Obtener todos los tickets disponibles, completados y no completados
     *    responses:
     *      200:
     *        description: Respuesta exitosa
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items: 
     *                type: object
     *                $ref: '#/components/schemas/Ticket'
     *      404:
     *        description: No hay tickets disponibles
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.get('/', (req, res) => this._controller.getTickets(req, res) );

    /**
     * @swagger
     * /ticket/lastNumber:
     *  get:
     *    tags: [Ticket]
     *    summary: Obtener el ultimo numero de los tickets disponibles
     *    responses:
     *      200:
     *        description: Respuesta exitosa
     *        content:
     *          application/json:
     *            schema:
     *              type: number
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.get('/lastNumber', (req, res) => this._controller.getLastTicketNumber(req, res) );

    /**
     * @swagger
     * /ticket/pending:
     *  get:
     *    tags: [Ticket]
     *    summary: Obtener arreglo de los ultimos tickets pendientes
     *    responses:
     *      200:
     *        description: Respuesta exitosa - Tickets pendientes obtenidos con exito
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: '#/components/schemas/Ticket'
     *      404:
     *        description: No hay tickets pendientes disponibles
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.get('/pending', (req, res) => this._controller.pendingTickets(req, res) );

    /**
     * @swagger
     * /ticket/working-on:
     *  get:
     *    tags: [Ticket]
     *    summary: Obtener arreglo de los tickets que estan siendo atendidos actualmente
     *    responses:
     *      200:
     *        description: Respuesta exitosa - Tickets siendo atendidos obtenidos con exito
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: '#/components/schemas/Ticket'
     *      404:
     *        description: No hay tickets siendos atendidos disponibles
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.get('/working-on', (req, res) => this._controller.workingOn(req, res) );

    /**
     * @swagger
     * /ticket/draw/{desk}:
     *  put:
     *    tags: [Ticket]
     *    summary: Mover un ticket a una mesa de trabajo para ser atendido
     *    parameters:
     *      - $ref: '#/components/parameters/deskName'
     *    responses:
     *      200:
     *        description: El ticket fue movido a una mesa con exito
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/TicketStatus'
     *      400:
     *        description: Error en la solicitud, nombre de escritorio requerido
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     *      404:
     *        description: No se encontraron tickets disponibles para mover
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.put('/draw/:desk', (req, res) => this._controller.drawTicket(req, res) );

    /**
     * @swagger
     * /ticket/done/{ticketId}':
     *  put:
     *    tags: [Ticket]
     *    summary: Marcar un ticket como culminado
     *    parameters:
     *      - $ref: '#/components/parameters/ticketId'
     *    responses:
     *      200:
     *        description: El ticket fue marcado como completado
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/TicketStatus'
     *      400:
     *        description: Error en la solicitud, id del ticket requerido o no encontrado
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.put('/done/:ticketId', (req, res) => this._controller.ticketFinished(req, res) );
    
    /**
     * @swagger
     * /ticket:
     *  post:
     *    tags: [Ticket]
     *    summary: Crear un nuevo ticket
     *    requestBody:
     *      required: false
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *    responses:
     *      201:
     *          description: El ticket fue creado con exito
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Ticket'
     *      500:
     *        description: Ocurrio un error en la ejecución de la solicitud
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              $ref: '#/components/schemas/InfoStatus'
     */
    router.post('/', (req, res) => this._controller.createTicket(req, res) );


    return router;
  }

}