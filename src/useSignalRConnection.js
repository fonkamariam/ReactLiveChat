import { useEffect, useState } from 'react';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

const useSignalRConnection = (handleConnectionLost, processEvents,messageQueue, userProfileQueue, conversationQueue, userStatusQueue) => {
  const [connection, setConnection] = useState(null);
  
  useEffect(() => {
    const createConnection = () => {
      const connection = new HubConnectionBuilder()
        .withUrl('https://livechatbackend-xwgx.onrender.com/messagesHub', {
          accessTokenFactory: () => sessionStorage.getItem('Token'),
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();

      connection.start()
        .then(() => {
          console.log('Connected Initial! Start');

          connection.on('ReceiveMessage', message => {
            messageQueue.current.push({ type: 'ReceiveMessage', payload: message });
            processEvents();
          });

          connection.on('Receive UserProfile', userPayLoad => {
            console.log('Receive UserProfile');        
            userProfileQueue.current.push({ type: 'ReceiveUserProfile', payload: userPayLoad });
            processEvents();
          });

          connection.on('Receive Conversation', convPayLoad => {
            console.log('ReceiveConversation');        
            conversationQueue.current.push({ type: 'ReceiveConversation', payload: convPayLoad });
            processEvents();
          });

          connection.on('UserStatusChanged', (userId, isOnline, lastSeen) => {
            console.log('UserStatusChange');
            userStatusQueue.current.push({ type: 'UserStatusChanged', payload: { userId, isOnline,lastSeen } });
            processEvents();
          });
          /**
          connection.on('Typing', (typer, valueBool) => {
            console.log('Typing');
            if (selectedRecpientIdPara !== null && selectedRecpientIdPara === typer) {
              console.log('Typing Selected');
              setSelectedTyping(valueBool);
            }
             
          });
*/
          connection.onclose(() => {
            console.log('Initial Connection Closed');
            handleConnectionLost();
          });
        })
        .catch(error => {
          console.error('Connection Failed', error);
          handleConnectionLost();
        });

      setConnection(connection);
    };

    if (!connection) {
      createConnection();
    }

    return () => {
      if (connection) {
        connection.stop()
          .then(() => console.log('Initial Connection Stopped'))
          .catch(error => console.error('Error stopping connection', error));
      }
    };
  }, [connection,handleConnectionLost, processEvents,messageQueue, userProfileQueue, conversationQueue, userStatusQueue]);

  return connection;
};

export default useSignalRConnection;
