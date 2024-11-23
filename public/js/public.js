const wss = new WebSocketService()
const dataService = new DataService()
const desks = [...document.querySelectorAll('.desk-display')]

window.deskssss = desks

/**
 * Escuchabdo los eventos provenientes de los websockets
 */
wss.on((event)=>{
  const data = JSON.parse(event.data)
  
  if( data.type === 'on-working-tickets-change' && Array.isArray(data.payload) ){
    showDataInDesksFromArray( data.payload )
    return
  }

  if( data.type === 'on-reset-all-change' ){
    resetDisplayDesk();
  }
})

/**
 * Mostrar los datos iniciales de la pantalla correspodiente a los escritorios
 */
function resetDisplayDesk(){
  const deskInitialData = [
    { number: "Ticket W", handleDesk: "Escritorio W", },
    { number: "Ticket X", handleDesk: "Escritorio X", },
    { number: "Ticket Y", handleDesk: "Escritorio Y", },
    { number: "Ticket Z", handleDesk: "Escritorio Z", }
  ]
  showDataInDesksFromArray( deskInitialData )
}

/**
 * Obtener los primeros tickets activos en mesas y mostrarlos en pantalla
 */
function getFirstTicketsLine(){
  dataService.getOnWorkingTickets()
  .then( resp => resp.json())
  .then( tickets => {
    if(Array.isArray(tickets)) showDataInDesksFromArray( tickets )    
  })
  .catch( error => {
    console.log(error);    
  })
}

/**
 * Pintar los datos provenientes de un arreglo en cada fragamento de pantalla correspondiente a un escritorio
 * @param {*} arrDesks Array
 */
function showDataInDesksFromArray(arrDesks =[]){
  arrDesks.map((ticket, index) => {
    showDataInDesk(index, ticket)
  })
}

/**
 * Agregar la informacion a un fragmento de pantalla correspondiente a un escritorio
 * @param {*} index number
 * @param {*} data Object
 * @returns void | null
 */
function showDataInDesk(index=0, data={}){
  if( !desks[index] || !data ) return null

  const spans = [...desks[index].querySelectorAll('span')]

  spans[0].textContent = `Ticket #${ data.number }`
  spans[1].textContent = `${ data.handleDesk }`
}


window.onload = () => {  
  getFirstTicketsLine()
}