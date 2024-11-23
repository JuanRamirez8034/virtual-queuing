

class DataService {

    #apiurl = '/api/v1';

    constructor(apiurl='/api/v1'){
      this.#apiurl = apiurl;
    }

    /**
     * Obtener el numero del ultimo ticket
     * @returns Promsesa que retorna un numero
     */
    async getLastNumber(){
      return this.#fetch(`${this.#apiurl}/ticket/lastNumber`)
    }

    /**
     * Obtener los tickets que se encuentran disponibles en mesa o activos
     * @returns Promsesa que retorna arreglo de tickets
     */
    async getOnWorkingTickets(){
      return this.#fetch(`${this.#apiurl}/ticket/working-on`)
    }

    /**
     * Restablecer todo el sistema
     * @returns Promsesa que retorna un booleano
     */
    async resetAll(){
      return this.#fetch(`${this.#apiurl}/ticket/reset-all`, 'PUT')
    }

    /**
     * Agregar un nuevo ticket
     * @returns Promsesa que devuelve un ticket
     */
    async addTicket(){
      return this.#fetch(`${ this.#apiurl }/ticket`, 'POST')
    }

    /**
     * Obtener tickets pendientes
     * @returns Promsesa que devuelve un arreglo de tickets
     */
    async getPendingTickets(){
      return this.#fetch(`${ this.#apiurl }/ticket/pending`)
    }

    /**
     * Mover el ticket a una mesa
     * @param {*} deskName string
     * @returns Promsesa que devuelve un ticket asignado a una mesa
     */
    async drawDeskTicket(deskName = ''){
      return this.#fetch(`${ this.#apiurl }/ticket/draw/${ deskName }`, 'PUT')
    }

    /**
     * Marcar un ticket como terminado
     * @param {*} ticketId string
     * @returns Promsesa que devuelve un ticket asignado a una mesa
     */
    async finalizedTicket(ticketId = ''){
      return this.#fetch(`${ this.#apiurl }/ticket/done/${ ticketId }`, 'PUT')
    }

    #fetch(url='', method='GET'){
      return fetch(url, { 
        method,
        headers: { 'Contet-Type': 'application/json' }
      });
    }
}