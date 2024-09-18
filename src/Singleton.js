// signalRConnection.js
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

let connection = null;

const createConnection = () => {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl('https://livechatbackend-xwgx.onrender.com/messagesHub', {
        accessTokenFactory: () => sessionStorage.getItem('Token'),
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();
  }
  return connection;
};

export { createConnection };
