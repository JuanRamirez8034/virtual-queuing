const wss = new WebSocketService()
const dataService = new DataService()
const notification = new NotificationService()
const nextHandleButton = document.querySelector('.btn.btn-primary.mt-5')
const onWorkingTicketNumber = document.querySelector('small.text-primary')
const availableActions = ['Siguiente', 'Terminar']
let deskName = null
let availableOnWorkingTicket = null
let availablePendingTickets = 0

// LISTENNERS

/**
 * Escuchando el websocket
 */
wss.on((event) => {
  const data = JSON.parse(event.data)
  if( data.type === 'on-ticket-count-change' ){
    changeDisplayPendingNumber(data.payload)
    return
  }
  if( data.type === 'on-reset-all-change' ){
    changeDisplayPendingNumber(0)
    nextHandleButton.innerHTML = `${ availableActions[0] }`
    availablePendingTickets = null
    onWorkingTicketNumber.textContent = 'Nadie'
  }
})

nextHandleButton.addEventListener('click', handleNextAction)


// FUNCTIONS

/**
 * Cambiar en el DOM el numero de ticket pendientes
 * @param {*} number 
 */
function changeDisplayPendingNumber(number=0){
  availablePendingTickets = number
  const countDisplay = document.querySelector('#lbl-pending')
  const countDisplayEmpty = document.querySelector('.alert.alert-info.mt-2')
  
  if( number <= 0 ){
    countDisplay.style.display = 'none'
    countDisplayEmpty.style.display = ''
  } else {
    countDisplayEmpty.style.display = 'none'
    countDisplay.style.display = ''
    countDisplay.textContent = `${ number }`

  }
}

/**
 * Obtener el numero de tickets pendientes y cargarlo en la pantalla
 */
function getPendingTicketsAndShow(){
  dataService.getPendingTickets()
  .then( resp => resp.json())
  .then( pendingTickets => {
    const length = Array.isArray(pendingTickets) ? pendingTickets.length : 0
    availablePendingTickets = length
    changeDisplayPendingNumber( length )
  })
  .catch( error => {
    console.log(error)    
  })
}

/**
 * Cambiar el nombre en el DOM correspondiente a la mesa
 */
function setDisplayDeskName(){
  const urlParams = new URLSearchParams(window.location.search)
  deskName = urlParams.get('deskName')
  if(!deskName){ 
    window.location.href = './index.html'
    throw 'Error desk name'
  }
  document.querySelector('h1.mt-5')
  .textContent = `${ deskName }`
}

/**
 * Resolver las acciones del boton de siguiente y terminar
 * @param {*} e mouseEvent
 * @returns void
 */
function handleNextAction(e){
  // if( availablePendingTickets <= 0 ) return notification.notify(`${ deskName } Notificacion`, 'No hay ticktes disponibles');
  const textAction = e.target.textContent.trim().toLowerCase();
    
  // si es igual a siguiente
  if(textAction === availableActions[0].toLowerCase()){
    dataService.drawDeskTicket( deskName )
    .then(  resp => resp.json())
    .then( data => {
      console.log(data);
      if(data.message){
        onWorkingTicketNumber.textContent = 'Nadie'
        notification.notify(`${ deskName } Notificacion`, 'No hay ticktes disponibles')
        return 
      }
      onWorkingTicketNumber.textContent = (data.ticket) ? `${ data.ticket.number }` : 'Nadie'
      availableOnWorkingTicket = (data.ticket) ? data.ticket : availableOnWorkingTicket
      e.target.textContent =availableActions[1]
    })
    .catch( error => {
      console.log(error);      
    })
    return;
  }

  // si es igual a terminar
  if(textAction === availableActions[1].toLowerCase()){
    dataService.finalizedTicket( availableOnWorkingTicket.id )
    .then(  resp => resp.json())
    .then( data => {
      console.log(data);
      if( data.message ){
        notification.notify(`${ deskName } Notificacion`, 'No se pudo actualizar el estado del finalizado')
      }
      onWorkingTicketNumber.textContent = 'Nadie'
      e.target.textContent =availableActions[0]
    })
    .catch( error => {
      console.log(error);      
    })
    return;
  }
  
}

window.onload = () => {
  setDisplayDeskName()
  getPendingTicketsAndShow()
}