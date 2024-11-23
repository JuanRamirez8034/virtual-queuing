


class NotificationService {
  constructor(){
    this.#requetsNotification();
  }

  #requetsNotification(){
    const permission = this.#permission();
    if( permission === 'granted' ) return;
    window.Notification.requestPermission()
    .then(  data => {
      this.notify('Cola notification', 'Notificaciones habilitadas');
    })
    .catch( e => {
      console.log('Notificaciones no hailitadas');      
    })
  }

  #permission(){
    return window.Notification.permission
  }

  notify(title='title', text='message'){
    this.#requetsNotification();
    const notification = new Notification(`${title}`, {
      body: `${ text }`,
      icon: '../img/cola.jpg',
    })
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        // La pestaña es ahora visible, así que cierro/elimino la notificación obsoleta.
        notification.close()
        document.removeEventListener("visibilitychange", ()=>{})
      }
    });
  }

}