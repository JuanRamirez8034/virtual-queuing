

class WebSocketService {

  #socket = null
  #url = null
  #actionOn = (e)=>{console.log(e)}

  constructor(url = '/ws/connect'){
    this.#url = url
  }
  
  on(action = (e)=>{console.log(e)}){
    this.#actionOn = action;
    this.#initialize();
  }

  #initialize(){
    this.#socket = new WebSocket( this.#url );
    
    this.#socket.onclose = ( event ) => {
      console.log( 'Connection closed' );
      setTimeout( () => {
        console.log( 'retrying to connect' );
        this.#initialize()
      }, 1500 );
  
    };
  
    this.#socket.onopen = ( event ) => {
      console.log( 'Connected' );
    };
    
    this.#socket.onmessage = this.#actionOn
  }

}

// function connectToWebSockets() {

//   const socket = new WebSocket('ws://localhost:3000/ws');

//   socket.onmessage = ( event ) => {
//     console.log(event.data);
//   };

//   socket.onclose = ( event ) => {
//     console.log( 'Connection closed' );
//     setTimeout( () => {
//       console.log( 'retrying to connect' );
//       connectToWebSockets();
//     }, 1500 );

//   };

//   socket.onopen = ( event ) => {
//     console.log( 'Connected' );
//   };

//   return socket.onmessage;

// }

// connectToWebSockets() ;

