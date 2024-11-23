const dataService = new DataService()
const notification = new NotificationService()
const resetAllBtn = document.querySelector('#resetAll')


resetAllBtn.addEventListener('click', function resetAll(){
  dataService.resetAll()
  .then( resp => resp.json())
  .then( data => {
    if( data.message ){
      notification.notify(`Programa colas notificacion`, 'Sistema restablecido')
    }
  })
  .catch( error => {
    console.log(error)    
  })
})