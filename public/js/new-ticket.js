
const domTicketNumber = document.querySelector('#lbl-new-ticket');
const domButtonAddTicket = document.querySelector('.btn.btn-secondary.btn-lg');
const dataService = new DataService()
const notification = new NotificationService()

domButtonAddTicket.addEventListener('click', addTicket)

function addTicket(e){
  dataService.addTicket()
  .then( resp => resp.json() )
  .then( tecketData => {
    notification.notify('Cola', 'Nuevo ticket agregado #' + tecketData.number)
    domTicketNumber.textContent = `${ tecketData.number }`
  })
  .catch( error => {
    console.log(error);
    notification.notify('Cola', 'Error al agregar ticket')
  } )
}

function getAndDisplayLastNumber(){
  dataService.getLastNumber()
  .then( resp => resp.json())
  .then(  numb => {
    domTicketNumber.textContent = `${ numb }`
  })
  .catch( error => {
    console.log(error);
    notification.notify('Cola', 'Error obtener el numero de los tickets')
  })
}

window.onload = () => {
  getAndDisplayLastNumber()  
}