import userEvent from '@testing-library/user-event';
import React, { useState ,useEffect,useRef } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";                   
import * as signalR from '@microsoft/signalr';

function Chats() {
  const [connection, setConnection] = useState(null);  
  const [newMessagesCount, setNewMessagesCount] = useState({});
  const [conversations, setConversations] = useState([]);
  const [contacts , setContacts] = useState([]);
  const [messages, setMessages] = useState([]); // State for the array of messages
  const [messageWs,setMessagesWs] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null); // State for the selected conversation
  const [selectedWsConv, setSelectedWsConv] = useState(null);
  const [selectedWsMid, setSelectedWsMid] = useState(null);
  const [selectedRecpientId, setSelectedRecpientId] = useState(null);//for sending a message by id
  const [selectedName,setSelectedName]=useState(null);
  const [selectedLastName,setSelectedLastName]=useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const navigate = useNavigate(); // Access the history object
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryUser, setSearchQueryUser] = useState('');
  
  const [addContact,setAddContact] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultUser, setSearchResultUser] = useState([]);
  
  const [sendMessage, setSendMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [goodMessage, setgoodMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [varOnce, setVarOnce] = useState(false);
  
  const fetchConvDataOnline = async () => {
    const keys = Object.keys(sessionStorage); 
    
    keys.forEach(key => {
      // Check if the key is an integer 
      if (/^\d+$/.test(key)) {
        sessionStorage.removeItem(key);
        console.log(key);  
      }  
    });
  
      try {
        const response = await fetch('http://localhost:5206/api/Message/GetAllConversationDirect', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
          } 
        }); 
        if (response.ok) {
          const data = await response.json();  
          setConversations(data);  // Update Converstaion data state 
          console.log("Got All Conversation");
          
          
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error
      }
    };
  /** UseEffects Start MessageWs */
  useEffect(() => {
    if (messageWs) { // Ensure messageWs is not null
      console.log("NOTFICATION Fix");
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conversation => {
          if (conversation.convId === selectedWsConv && conversation.messageId === selectedWsMid) {
            console.log(`NotificationCount: ${conversation.notificationCount}`);
            
            let prevCount = conversation.notificationCount;
            if(Number(prevCount) !== 0){
              prevCount = prevCount -1;
            }
            return { ...conversation, message: messageWs.at(-1).content, updatedTime: messageWs.at(-1).timeStamp, messageId: messageWs.at(-1).id ,notificationCount:prevCount};
          }
          return conversation; 
        });

        // Sort the updated conversations by updatedTime
        return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
      });
      

      setMessagesWs(null); // Reset messageWs if needed
      setSelectedWsConv(null);
    }
    
  }, [messageWs, selectedWsConv,selectedWsMid]); // Add convId and messIdPara as dependencies if they come from the component's state/props

  /** UseEffects End MessaeWs */
  /** UseEffects Start ws Connection*/
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5206/messagesHub',{
          accessTokenFactory: () =>sessionStorage.getItem('Token'),
          skipNegotiation:true,
          transport:HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();
    
      setConnection(newConnection); 
    
}, []); 
useEffect(() => {
  if (connection) {
      connection.start()
          .then(result => {
              console.log('Connected!');
              connection.on('ReceiveMessage', async message => {
              if (message.type === 'INSERT') { 
                //set Conversation state
                const existingConversation1 = conversationsRef.current.some( 
                  conversation => conversation.convId === message.record.convId
                );
                
                if (conversationsRef.current.length === 0 || existingConversation1 === false ) {
                  console.log("New Conv");
                  console.log(conversationsRef.current.length);
                  console.log(message.record.convId);

                  setConversations(prevConversations => {
                    // Create a new array that includes the previous conversations and the new one
                    const updatedConversations12 = [
                      ...prevConversations,
                      {
                        convId: message.record.convId,
                        message: message.record.content,
                        updatedTime: message.record.timeStamp,
                        messageId : message.record.id,
                        userId : message.record.senderId,
                        userName: message.record.status, 
                        lastName:message.record.messageType,
                        notificationCount: 1 
                      }
                    ];
                  
                    // Sort the updated conversations array by updatedTime
                    updatedConversations12.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                  
                    // Return the sorted array to update the state
                    return updatedConversations12;
                  });
                }else{
                    console.log("Alread Conv ale");
                    if (selectedConversationRef.current === message.record.convId) {
                      setConversations(prevConversations =>{ 
                        const updatedConversations = prevConversations.map(conversation => {
                          if (conversation.convId === message.record.convId) { 
                            // Update the message and timeStamp for the matching conversation
                            return { ...conversation, message: message.record.content, updatedTime: message.record.timeStamp,messageId:message.record.id,notificationCount: 0};
                          } 
                          return conversation;
                        });
                        // Sort the updated conversations by updatedTime
                        return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                    });
                    console.log("About to call zero function");
                    zeroNotification(message.record.convId);
                    console.log("passed zeroNotfication");
                    }else{
                      setConversations(prevConversations =>{ 
                        const updatedConversations = prevConversations.map(conversation => {
                          if (conversation.convId === message.record.convId) { 
                            let prevCount = conversation.notificationCount + 1;
                            // Update the message and timeStamp for the matching conversation
                            return { ...conversation, message: message.record.content, updatedTime: message.record.timeStamp,messageId:message.record.id,notificationCount: prevCount};
                          }
                          return conversation;
                        }); 
                        // Sort the updated conversations by updatedTime
                        return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                    })
                    };
                    
                }
                  
                // setMessages state insert
                
                    if (selectedConversationRef.current === null && selectedRecpIdRef.current === message.record.senderId){
                      
                      setSelectedConversation(message.record.convId);
                      console.log("both MessState and Ss");
                      
                      const newMessage = {
                        content: message.record.content,
                        convId: message.record.convId,
                        deleted: message.record.deleted,
                        id: message.record.id,
                        messageType: message.record.messageType,
                        recpientId: message.record.recpientId,
                        senderId: message.record.senderId,
                        status:message.record.status,
                        timeStamp: message.record.timeStamp,
                        notificationCount: 0
                        };
                      
                      insertMessage(newMessage);
                      const ParsedMessage = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                      if (ParsedMessage!== null) {
                      ParsedMessage.push(newMessage);
                      sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(ParsedMessage))
                      }

                    }
                    if ( selectedConversationRef.current === message.record.convId && sessionStorage.getItem(`${message.record.convId}`)) {
                      // update both message state and Ss 
                      console.log("both MessState and Ss");
                      
                      const newMessage = {
                        content: message.record.content,
                        convId: message.record.convId,
                        deleted: message.record.deleted,
                        id: message.record.id,
                        messageType: message.record.messageType,
                        recpientId: message.record.recpientId,
                        senderId: message.record.senderId,
                        status:message.record.status,
                        timeStamp: message.record.timeStamp
                        };
                      
                      insertMessage(newMessage);
                      const ParsedMessage = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                      if (ParsedMessage!== null) {
                      ParsedMessage.push(newMessage);
                      sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(ParsedMessage))
                      }

                    }else if (selectedConversationRef.current === message.record.convId && !sessionStorage.getItem(`${message.record.convId}`)){
                      console.log("both MessState and Ss");
                      
                      const newMessage = {
                        content: message.record.content,
                        convId: message.record.convId,
                        deleted: message.record.deleted,
                        id: message.record.id,
                        messageType: message.record.messageType,
                        recpientId: message.record.recpientId,
                        senderId: message.record.senderId,
                        status:message.record.status,
                        timeStamp: message.record.timeStamp
                        };
                      
                      insertMessage(newMessage);
                      const ParsedMessage = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                      if (ParsedMessage!== null) {
                      ParsedMessage.push(newMessage);
                      sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(ParsedMessage))
                      }

                    }else if ( message.record.convId !== selectedConversationRef.current && sessionStorage.getItem(`${message.record.convId}`)) {
                      console.log("Only Session Storage,Not SelectedConversation");
                      const newMessage = {
                        content: message.record.content,
                        convId: message.record.convId,
                        deleted: message.record.deleted,
                        id: message.record.id,
                        messageType: message.record.messageType,
                        recpientId: message.record.recpientId,
                        senderId: message.record.senderId,
                        status:message.record.status,
                        timeStamp: message.record.timeStamp
                        };
                      
                      
                      const ParsedMessage = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                      if (ParsedMessage!== null) {
                      ParsedMessage.push(newMessage);
                      sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(ParsedMessage))
                      }
                                          
                    }else if( message.record.convId !== selectedConversationRef.current && !sessionStorage.getItem(`${message.record.convId}`)){
                      console.log("Don't do anything");
                    }else{
                      console.log("Problem Inserting Message for Reciever in signalR");
                    }
                        

                
              }else if(message.type === 'UPDATE' && message.record.deleted === false){
                
                //set Conversation state
                
                
                setConversations(prevConversations => {
                  const updatedConversations = prevConversations.map(conversation => {
                    if (conversation.convId === message.record.convId && conversation.messageId === message.record.id) {
                      return { ...conversation, message: message.record.content, updatedTime: message.record.timeStamp,messageId:message.record.id };
                    } 
                    return conversation; 
                  });
              
                  // Sort the updated conversations by updatedTime
                  return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                });
                //set Message state update
                if ( selectedConversationRef.current===message.record.convId && sessionStorage.getItem(`${message.record.convId}`)) {
                  // update both message state and Ss 
                  console.log("both MessState and Ss");
                  console.log()
                  setMessages(prevMessages => {
                    const updatedMessages = prevMessages.map(messagePara => {
                      if (messagePara.id === message.record.id) {
                        return { ...messagePara, content: message.record.content,edited:true};
                      }
                      return messagePara;
                    });
                
                    // Sort the updated conversations by updatedTime
                    return updatedMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
                  });
                  const xy = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                  if (xy!== null) {
                    for (let index = 0; index < xy.length; index++) {
                      if ( xy[index].id === message.record.id) {
                          xy[index].content = message.record.content;
                          xy[index].edited = true;
                          break; 
                      } 
                  }
                  sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(xy))
                  }                    
                  
                }else if (selectedConversationRef.current===message.record.convId && !sessionStorage.getItem(`${message.record.convId}`)){
                  console.log(" MessState and !Ss");
                  
                  setMessages(prevMessages => {
                    const updatedMessages = prevMessages.map(messagePara => {
                      if (messagePara.id === message.record.id) {
                        return { ...messagePara, content: message.record.content,edited:true};
                      }
                      return messagePara;
                    });
                
                    // Sort the updated conversations by updatedTime
                    return updatedMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
                  });
                  const xy = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                  if (xy!== null) {
                    for (let index = 0; index < xy.length; index++) {
                      if ( xy[index].id === message.record.id) {
                          xy[index].content = message.record.content;
                          xy[index].edited = true;
                          break; 
                      } 
                  }
                  sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(xy))
                  }                    
                  
                }else if ( message.record.convId !== selectedConversationRef.current && sessionStorage.getItem(`${message.record.convId}`)) {
                  console.log("Only Session Storage,Not Message State");
                  
                  const xy = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                  if (xy !== null) {
                    for (let index = 0; index < xy.length; index++) {
                      if ( xy[index].id === message.record.id) { 
                          xy[index].content = message.record.content;
                          xy[index].edited = true;
                          break; 
                      } 
                  }
                  sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(xy))
                  }                    
                }else if( message.record.convId !== selectedConversationRef.current && !sessionStorage.getItem(`${message.record.convId}`)){
                  console.log("Don't do anything");
                }else{
                  console.log("Problem Updating Message for Reciever in signalR");
                } 
              }else if (message.type === 'UPDATE' && message.record.deleted === true ){
                  console.log("FOR ME, there is a deleted message and it concerns me");
                  console.log(`DeleteMessageId: ${message.record.id},${message.record.content}`); 
                  console.log(selectedConversationRef.current);
                  if ( message.record.convId === selectedConversationRef.current) {
                        console.log("Selected Conv and delete");
                        // for Message State
                          console.log("About to delete from Message state");
                          if (messagesRef.current.length === 1 ) {
                            console.log("Message length = One");
                            setMessages([]);
                            sessionStorage.removeItem(`${message.record.convId}`);
                            console.log("One Text Only");
                            
                            setConversations(prevConversations => {
                              const updatedConversations1 = prevConversations
                                .filter(conversation => conversation.convId !== selectedConversationRef.current) // Exclude the conversation with the specified convId
                                .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
                            return updatedConversations1;
                            });
                            setSelectedConversation(null);
                            
                          }else{
                            console.log("selected Conversation and more than one text in Message ");
                            if(selectedConversationRef.current === message.record.convId){
                              console.log("Captain Holt");
                            
                            setConversations(prevConversations =>{
                              const updatedConversations = prevConversations.map(conversation => {
                                if (conversation.messageId === message.record.id) {
                                  
                                  return { 
                                    ...conversation, 
                                    message: messagesRef.current.at(-2).content, 
                                    updatedTime: messagesRef.current.at(-2).timeStamp,
                                    messageId: messagesRef.current.at(-2).id
                                  };
                                } 
                                return conversation;
                              });
                              updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                              return updatedConversations; // Return the updated conversations array
                            });  
                          }
                            let varMessageArray = messagesRef.current;
                            const filteredMessages = varMessageArray.filter(messagePara => {
                              return messagePara.id !== message.record.id;
                          });
                      
                         
                            // Update the state with the filtered messages
                            setMessages(filteredMessages);
                            console.log(`ConversationID: ${message.record.convId} for fetching sessionStorage`);
                            const xy = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                            if (xy!== null) {
                              for (let index = 0; index < xy.length; index++) {
                                if ( xy[index].id === message.record.id) {
                                  xy.splice(index,1);  
                                  break; 
                                } 
                              }
                            sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(xy))
                            console.log("Setted Session Storage");
                            }
                            
                          } 
                      
                  }else if ( selectedConversationRef.current !== message.record.convId && sessionStorage.getItem(`${message.record.convId}`)){                    
                    console.log("Should be Here");    
                    console.log("Not Seclected Conv but sessionStorage");
                        const xy = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                            if (xy!== null) {
                              for (let index = 0; index < xy.length; index++) {
                                if ( xy[index].id === message.record.id) {
                                  xy.splice(index,1);  
                                  break; 
                                } 
                            }
                            sessionStorage.setItem(`${message.record.convId}`,JSON.stringify(xy))
                            console.log("Setted Session Storage");
                          } 
                        
                        setConversations(prevConversations => {
                          const updatedConversations = prevConversations.map(conversation => {
                            if (conversation.convId === message.record.convId && conversation.messageId === message.record.id) {
                              let prevCount = conversation.notificationCount;                              
                              if(Number(prevCount) !== 0){
                                prevCount = prevCount - 1;
                              }                              
                              const Parsed = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                              return { ...conversation, message: Parsed.at(-1).content, updatedTime: Parsed.at(-1).timeStamp, messageId:Parsed.at(-1).id,notificationCount:prevCount};
                            }
                            return conversation; 
                          });
                      
                          // Sort the updated conversations by updatedTime
                          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                        });
                        // Checking Notification Count
                                 
                        setConversations(prevConversations => {
                          const updatedConversations = prevConversations.map(conversation => {
                            if (conversation.convId === message.record.convId) {
                              let prevCount = Number(conversation.notificationCount);  
                              if (prevCount !== 0) {
                                for (let index = -1; index < -prevCount-1; index--) {
                                  if (Parsed.at(index).id === message.record.id) {
                                    prevCount = prevCount-1;
                                  }
                                }          
                              }            
                              const Parsed = JSON.parse(sessionStorage.getItem(`${message.record.convId}`));
                              return { ...conversation, notificationCount:prevCount};
                            }
                            return conversation; 
                          });
                      
                          // Sort the updated conversations by updatedTime
                          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                        });
                  
                        //setted message state
                        

                  }else if (selectedConversationRef.current !== message.record.convId  && !sessionStorage.getItem(`${message.record.convId}`)){
                        console.log("No Sc and No Ss");
                        setSelectedWsConv(message.record.convId);
                        setSelectedWsMid(message.record.id);
                        const check = await handleConversationClickWs(message.record.convId);
                        
                  }else{
                    console.log("problem at deleting message for conversation");
                  }
                
              }else{
                console.log("Problem Message not upd,del,ins");
              }
                
          });
              
            connection.on('Receive UserProfile', userPayLoad => { 
                
                setConversations(prevConversations => {
                  const updatedConversations = prevConversations.map(conversation => {
                    if (conversation.userId === userPayLoad.record.userId) {
                      return { ...conversation,userName:userPayLoad.record.name,lastName:userPayLoad.record.lastName };
                    } 
                    return conversation; 
                  });
              
                  // Sort the updated conversations by updatedTime
                  return updatedConversations;
                });
                if (selectedConversationRef.current !== null && selectedRecpIdRef.current === userPayLoad.record.userId){
                  setSelectedName(userPayLoad.record.name);
                  setSelectedLastName(userPayLoad.record.lastName);
                }
                 
              });

            connection.on('Receive Conversation', convPayLoad => { 
               console.log("PAYLOAD CONV")
            
               console.log("SETTED CONVERSATION")
               console.log(selectedConversationRef.current);
               console.log(convPayLoad.old_record.convId);
                if (selectedConversationRef.current === convPayLoad.old_record.convId ){
                 console.log("yesss");
                 console.log("SETTED CONVERSATION");
                 setMessages([]);
                 setConversations(prevConversations =>{
                  const updatedConversations1 = prevConversations
                  .filter(conversation => conversation.convId !== convPayLoad.old_record.convId) // Exclude the conversation with the specified convId
                  .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
                  return updatedConversations1;
                  });
                  
                  setSelectedConversation(null);
                  

                }else{
                  console.log("Else weste negene");
                  setConversations(prevConversations =>{
                    const updatedConversations1 = prevConversations
                    .filter(conversation => conversation.convId !== convPayLoad.old_record.convId) // Exclude the conversation with the specified convId
                    .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
                    return updatedConversations1;
                    });
                }
                 
              });
              
           connection.on('UserStatusChanged', (userId, isOnline) => {
           console.log("About to execute SetConversation");
              
            setConversations(prevConversations => {
              const updatedConversations = prevConversations.map(conversation => {
                
                if (Number(conversation.userId) === Number(userId)) {
                  console.log("Yess");
                  let time = new Date();
                  
                  return { ...conversation,status: String(isOnline) ,lastSeen: time };
                } 
                return conversation; 
              });
          
              // Sort the updated conversations by updatedTime
              return updatedConversations;
              
            });
            
            console.log(`UserId(${userId}): ${isOnline}`);
           });
          }).catch(e => console.log('Connection failed: ', e));
  }
}, [connection]);   

// JavaScript visibility change
const handleVisibilityChange = async () => {
  if (document.hidden) {
    // If the document is hidden, stop the SignalR connection
    if (connection) {
      connection.stop().then(() => console.log('Disconnected due to tab change or minimization'));
      virtualLogOut();
    }
  } else {
    // If the document is visible again, start the SignalR connection
    if (connection) {
      await fetchConvDataOnline();
      connection.start().then(() => console.log('Reconnected after tab change or restoration'));
      virtualLogin();
      
    }
  }
};
useEffect(() => {
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log('Connection started.');
          await fetchConvDataOnline();
          virtualLogin();
      
        } catch (error) {
          console.error('Error starting connection:', error);
        }
      } else {
        console.log('Connection is already in progress or connected.');
      }
    } else {
      if (connection.state === signalR.HubConnectionState.Connected) {
        try {
          await connection.stop();
          console.log('Connection stopped.');
          virtualLogOut();
        } catch (error) {
          console.error('Error stopping connection:', error);
        }
      } else {
        console.log('Connection is already disconnected.');
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [connection]);


// JavaScript visiblity Change
  /** UseEffects End ws Connection*/
  const selectedConversationRef = useRef(selectedConversation);
  const messagesRef = useRef(messages);
  const conversationsRef = useRef(conversations);
  const selectedRecpIdRef = useRef(selectedRecpientId);
  useEffect(()=>{conversationsRef.current = conversations;},[conversations]);
  useEffect(() => {selectedConversationRef.current = selectedConversation;}, [selectedConversation]);
  useEffect(() => {messagesRef.current = messages;}, [messages]);
  useEffect(() => {selectedRecpIdRef.current = selectedRecpientId;},[selectedRecpientId]);
  
 /** Fetching Conversations Start */
useEffect(() => async ()=>{
  // Fetch Conversations
  const fetchConvData = async () => {
  const keys = Object.keys(sessionStorage); 
  
  keys.forEach(key => {
    // Check if the key is an integer 
    if (/^\d+$/.test(key)) {
      sessionStorage.removeItem(key);
    }  
  });

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5206/api/Message/GetAllConversationDirect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
        } 
      }); 
      if (response.ok) {
        const data = await response.json();  
        setIsLoading(false);
        setConversations(data);  // Update Converstaion data state 
        console.log("Got All Conversation");
        
        
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error
    }
  };
  // Fetch Contacts
  const fecthContact = async () => {
    try { 
      const response = await fetch('http://localhost:5206/api/Contact/GetContacts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);  // Update Converstaion data state
        console.log("Contacts Fetched");
        
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error
    }
  };
  const fetchMessages = async ()=>{
    
  };
  const fc = await fetchConvData(); // Call fetchData function when component mounts
  //fecthContact(); // fetching Contacts
  fetchMessages();
}, []);
/** Fetching Conversation End */
  // For Shade code Start
  const [EpIsOverlayVisible, EpSetIsOverlayVisible] = useState(false);
  const [FpIsOverlayVisible, FpSetIsOverlayVisible] = useState(false);
  const [DaIsOverlayVisible, DaSetIsOverlayVisible] = useState(false);
  const [ContactIsOverlayVisible, ContactSetIsOverlayVisible] = useState(false);
 
  const EphandleButtonClick = () => {
    EpSetIsOverlayVisible(true);
  };
  const FphandleButtonClick = () => {
    FpSetIsOverlayVisible(true);
  };
  const DahandleButtonClick = () => {
    DaSetIsOverlayVisible(true);
  };
  const ContacthandleButtonClick = () => {
    ContactSetIsOverlayVisible(true);
  };
  const handleCloseOverlay = () => {
    EpSetIsOverlayVisible(false);
    FpSetIsOverlayVisible(false);
    DaSetIsOverlayVisible(false);
    ContactSetIsOverlayVisible(false);

  };
// For Shade code End

  // For DropDown code Start
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleButtonClick1 = () => {
    setIsDropdownVisible(prevState => !prevState);
    
        EpSetIsOverlayVisible(false);
        FpSetIsOverlayVisible(false);
        DaSetIsOverlayVisible(false);
        ContactSetIsOverlayVisible(false);
  };
 
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
        EpSetIsOverlayVisible(false);
        FpSetIsOverlayVisible(false);
        DaSetIsOverlayVisible(false);
        ContactSetIsOverlayVisible(false);
        
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, buttonRef]);
// For DropDown code End

// For Settings code Start
  const [firstName, setFirstName] = useState(sessionStorage.getItem('Name'));
  const [lastName, setLastName] = useState(sessionStorage.getItem('LastName'));
  const [bio, setBio] = useState(sessionStorage.getItem('Bio'));
  const [oldPassword,setOldPassword]=useState('');
  const [newPassword,setNewPassword]=useState(''); 
  const [isLoadingMessage, setIsLoadingMessage] =useState(false);
  const [forSearchUser, setForSearchUser] = useState(false); 
// for searching user by email
useEffect(() => {
  if (searchQueryUser.length > 0) {
    const fetchSearchResultUser = async () => {
      try {
        const response = await fetch(`http://localhost:5206/api/Users/SearchUser?query=${searchQueryUser}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSearchResultUser(data);
        } else {
          throw new Error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        // Handle error
      }
    };

    fetchSearchResultUser();
  } else {
    setSearchResultUser([]);
  }
}, [searchQueryUser]);
const handleLogOut = (e) =>{
  
  const logoutToken = sessionStorage.getItem('Token');
  navigate(`/`);

  try {
    const response = fetch(`http://localhost:5206/api/Users/logout`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${logoutToken}`
      }
    });
    if (response.ok) {
      console.log("Logged Out");
     
    } else {
      console.log("Failed to Logout");
      throw new Error('Failed to Logout Backend');
    }
  } catch (error) {
    console.error('Error Loggin Out Frontend');
    
  }
    sessionStorage.clear();
    console.log("Session Storage cleared");
    if (connection) {
      connection.stop().then(() => console.log('Disconnected due to tab change or minimization'));
    }
    

};
const virtualLogOut = async (e) =>{
  
  const logoutToken = sessionStorage.getItem('Token');
  

  try {
    const response = await fetch(`http://localhost:5206/api/Users/logout`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${logoutToken}`
      }
    });
    if (response.ok) {
      console.log("VIRTUAL LOG OUT SUCCESS");
     
    } else {
      console.log("LOGOUT VIRTUAL to Logout BACKEND");
      throw new Error('Failed VIRTUAL LOGOUT BACKEND');
    }
  } catch (error) {
    console.error('VIRTUAL LOG OUT Frontend');
    
  }
    
    

};
const virtualLogin = async (e) =>{
  
  try {
    const response = await fetch(`http://localhost:5206/api/Users/virtualLogin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      console.log("VIRTUAL LOG in SUCCESS");
     
    } else {
      console.log("Failed to Logout");
      throw new Error('FAIL: VIRTUAL LOG IN');
    }
  } catch (error) {
    console.error('FAIL: VIRTUAL LOG IN');
    
  }
    
    

};

const handleMessage = (e) =>{
  setSendMessage(e.target.value);
};
const insertMessage = (newMessage) => {
  setMessages(prevMessages => {
    const updatedMessages = [...prevMessages, newMessage]; // Add the new message to the existing array

    // Sort the updated messages by timeStamp
    return updatedMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
  });
};
const handleSendMessage = async (e) => {
  e.preventDefault();
  setIsLoadingMessage(true);
  setVarOnce(true);
  try {
    const messagesResponse1 = await fetch('http://localhost:5206/api/Message/SendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      },  
      body: JSON.stringify({
        content: sendMessage, // Use the email from the authData context
        recpientId: selectedRecpientId, // Use the password from the authData context
        messageType: "text"
      })  
    });
    if (messagesResponse1.ok) {
      const data = await messagesResponse1.json();
      if (selectedConversation === null) { 
        setConversations(prevConversations => {
          // Create a new array that includes the previous conversations and the new one
          const updatedConversations12 = [
            ...prevConversations,
            {
              convId: data.convId,
              message: sendMessage,
              updatedTime: data.timeStamp,
              messageId: data.id,
              userId: data.recpientId,
              userName: selectedName,
              lastName: selectedLastName
            }
          ];
        
          // Sort the updated conversations array by updatedTime
          updatedConversations12.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        
          // Return the sorted array to update the state
          return updatedConversations12;
        });
        setSelectedConversation(data.convId);
        
        
      }else{
        setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conversation => {
          
          if (conversation.convId === selectedConversation) {
            
            return { ...conversation, message: sendMessage, updatedTime:data.timeStamp ,messageId: data.id}; 
          }
          return conversation; 
        });
    
        // Sort the updated conversations by updatedTime
        return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
      });}
      
      const newMessage = {
        content: data.content,
        convId: data.convId,
        deleted: data.deleted,
        id: data.id,
        messageType: data.messageType,
        recpientId: data.recpientId,
        senderId: data.senderId,
        status:data.status,
        timeStamp: data.timeStamp
       };
      
      insertMessage(newMessage);
      const ParsedMessage = JSON.parse(sessionStorage.getItem(`${selectedConversation}`));
      if (ParsedMessage!== null) {
      ParsedMessage.push(newMessage);
      sessionStorage.setItem(`${selectedConversation}`,JSON.stringify(ParsedMessage))
      }
      setIsLoadingMessage(false); 
      setSendMessage('');
    } else {
      throw new Error('Failed to fetch messages');
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};
const handleConversationClick = async (convId,recpientId,Name,LastName) => {
  setForSearchUser(false);
  setMessages([]);
  setSelectedConversation(convId); // Set the selected conversation 
  setSelectedRecpientId(recpientId);
  setSelectedName(Name);
  setSelectedLastName(LastName);
  
  
  const storedMessages = sessionStorage.getItem(`${convId}`);
  if (storedMessages !== null) {
    const rMd = JSON.parse(storedMessages);
    setMessages(rMd);
    return;
  } 
  try {
    const messagesResponse = await fetch(`http://localhost:5206/api/Message/GetConversationMessage?query=${convId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (messagesResponse.ok) {
      const messagesData = await messagesResponse.json();
      sessionStorage.setItem(`${convId}`,JSON.stringify(messagesData));
      setMessages(messagesData); // Update messages state with the fetched messages
      setConversations(prevConversations =>{ 
        const updatedConversations = prevConversations.map(conversation => {
          if (conversation.convId === convId) { 
            
            // Update the message and timeStamp for the matching conversation
            return { ...conversation, notificationCount: 0};
          } 
          return conversation;
        });
    
        // Sort the updated conversations by updatedTime
        return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
    }); 
     
    } else {
      throw new Error('Failed to fetch messages');
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Handle error
  }
};
const handleConversationClickWs = async (convId) => {
  
  try {
    const messagesResponse = await fetch(`http://localhost:5206/api/Message/GetConversationMessage?query=${convId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (messagesResponse.ok) {
      const messagesData = await messagesResponse.json();
      console.log("GOT IN HERE");
      console.log(`ConvIDPara: ${convId}`);
      if (sessionStorage.getItem(convId)){
          console.log("REMOVED FIRST");
          sessionStorage.removeItem(convId);
      }  
    
        sessionStorage.setItem(`${convId}`,JSON.stringify(messagesData));
      
      setMessagesWs(messagesData); // Update messages state with the fetched messages
      return; 
    } else {
      throw new Error('Failed to fetch messages');
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Handle error
  }
};

const handleNewUserClick =  (RecpientId,Name,LastName)=>{ 
  setSearchResultUser([]);
  setSearchQueryUser('');
  setSelectedRecpientId(RecpientId); 
  setSelectedName(Name); 
  setSelectedLastName(LastName); 
  console.log(`Handle New User Click Recpient Id: ${RecpientId}`);
  const existingConversation = conversations.find( 
    conversation => conversation.userId === RecpientId
  );
  if (existingConversation !== undefined) {
    // Fetch messages for the existing conversation
    console.log("Exisiting conv");
    const storedMessages = sessionStorage.getItem(`${existingConversation.convId}`);
  if (storedMessages !== null) {
    console.log("Exisisting Conversation and SessionStorage");
    
  setMessages([]);
  setSelectedConversation(existingConversation.convId); // Set the selected conversation 
  setSelectedRecpientId(RecpientId);
  setSelectedName(Name);
  setSelectedLastName(LastName); 
  const rMd = JSON.parse(storedMessages);
  setMessages(rMd);

  return;
  } 
  console.log(existingConversation.convId);
    handleConversationClick(existingConversation.convId, existingConversation.userId, existingConversation.userName, existingConversation.lastName);
  } else {
    console.log("Else New User Click");
    // Set messages to "No Message" 

  setMessages([]);
  setSelectedRecpientId(RecpientId);
  setSelectedName(Name);
  setSelectedLastName(LastName);
  setSelectedConversation(null);
  console.log("Setted everything in else");
  setForSearchUser(true); 
  } 


};
const handleDeleteMessage = async (messageId) => {
  try {
    const response = await fetch(`http://localhost:5206/api/Message/DeleteMessage?deleteMessage=${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      console.log("Ok Deleted");
      /** From Deleter Perspective.
      1) Is the messageId being deleted the recent messageId in the conversation, Update the Conversation
          Is the messageId being deleted the last messageId in the conversation, Delete the Conversation  
      2) Delete the message from the MessagesState and Sort
      3) Delete the message from the SessionStorage.
      4) Create a variable and update the variable with the message Id, so that when it comes from the Ws, it is igonred.
     */
      if (messages.at(-2)) {
        setConversations(prevConversations => {
                      
          const updatedConversations = prevConversations.map(conversation => {
            if (conversation.convId === selectedConversationRef.current && conversation.messageId === messageId) {
              return { ...conversation, message: messages.at(-2).content, updatedTime:messages.at(-2).timeStamp,messageId:messages.at(-2).id};
            }
            return conversation;
          });
      
          // Sort the updated conversations by updatedTime
          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        });
      }else{
        setConversations(prevConversations => {

          const updatedConversations1 = prevConversations
            .filter(conversation => conversation.convId !== selectedConversation) // Exclude the conversation with the specified convId
            .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
        return updatedConversations1;
        });
        setSelectedConversation(null);
      }    
      
      setMessages(messages.filter(message => message.id !== messageId));
      const xy = JSON.parse(sessionStorage.getItem(`${selectedConversation}`));
      if (xy!== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === messageId) {
            xy.splice(index,1);  
            break; 
          } 
      }
      sessionStorage.setItem(`${selectedConversation}`,JSON.stringify(xy))
      } 
      
    } else {
      throw new Error('Failed to delete message');
    }
  } catch (error) {
    console.error('Error deleting message:Error');
    
  }
};
const handleDeleteConversation = async (convIdPara) => {
  
  try {
    const response = await fetch(`http://localhost:5206/api/Message/DeleteConversation?deleteConv=${convIdPara}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      console.log("Ok Deleted");

      /**
      if (selectedConversationRef.current === convIdPara ){
        console.log("yesss");
        setMessages([]);
        setSelectedConversation(null);
       }
        
      setConversations(prevConversations =>{
        const updatedConversations1 = prevConversations
        .filter(conversation => conversation.convId !== convIdPara) // Exclude the conversation with the specified convId
        .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
        setSelectedConversation(null);
        return updatedConversations1;
        });
      
       */
    } else {
      throw new Error('Failed to delete message');
    }
  } catch (error) {
    console.error('Error deleting message:Error');
    
  }
};
const zeroNotification = async (convId) => {
  try {
    const response = await fetch(`http://localhost:5206/api/Message/zeroNotification?convIdPara=${convId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      console.log("Zeroed Notification b/c it is in selectedConv");
      return;
    } else {
      throw new Error('Failed to zero Notification');
    }
  } catch (error) {
    console.error('Error zeroing Notification');
  }
};
const handleEditSubmit = async (e) => {
  e.preventDefault();
  if (!editMessageContent.trim()) {
   
    return;
  }

  try {
    const response = await fetch(`http://localhost:5206/api/Message/EditMessage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      },
      body: JSON.stringify({ 
        content: editMessageContent,
        MessageId: editMessageId 
      }) 
    });
    if (response.ok) {
      const updatedMessage = await response.json();
      setMessages(messages.map(message => message.id === editMessageId ? updatedMessage : message));
      
      setEditMessageContent('');
      setConversations(prevConversations => {
        
        const updatedConversations = prevConversations.map(conversation => {
          
          if (conversation.convId === selectedConversation && conversation.messageId === editMessageId) {
            
          
            return { ...conversation, message: editMessageContent  };
          }
          return conversation;
        });
    
        // Sort the updated conversations by updatedTime
        return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
      });
      const xy = JSON.parse(sessionStorage.getItem(`${selectedConversation}`));
      if (xy!== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === editMessageId) {
              xy[index].content = editMessageContent;
              xy[index].edited = true;
              break; 
          } 
      }
      sessionStorage.setItem(`${selectedConversation}`,JSON.stringify(xy))
      }
      setEditMessageId(null);
      
     
    } else {
      throw new Error('Failed to edit message');
    }
  } catch (error) {
    console.error('Error editing message:', error);
    setErrorMessage('Failed to edit message.');
  }
};
const handleEditMessage = (message) => {
  setEditMessageId(message.id);
  setEditMessageContent(message.content);
};
const deleteAccount = () => {
  if (window.confirm('Are you sure you want to delete this item?')) {
    setIsLoading(true); // Set loading state to true before making the API call
fetch('http://localhost:5206/api/Users/DeleteAccount', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
  } 
}).then(response => {
  if (response.ok) {
    console.log('OK,Updated');
    setIsLoading(false);
    setgoodMessage('Deleted');
    clearErrorMessageAfterDelay();
    setTimeout(() => {
      handleLogOut();
      navigate(`/`); // Redirect the user after displaying the error message
    }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
  }else if (response.status === 10) { 
    // Handle bad request
    setIsLoading(false);
    setErrorMessage('Invalid Token'); 
    clearErrorMessageAfterDelay();
    setTimeout(() => {
      navigate(`/`); // Redirect the user after displaying the error message
    }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
  }else {
    setIsLoading(false);
    setErrorMessage('Connection Problem. Please try again.Backend');
    clearErrorMessageAfterDelay(); // Set error message for the user
    }
}).catch(error => {
  setIsLoading(false);
  setErrorMessage('Connection Problem. Fetch Error.');
  clearErrorMessageAfterDelay(); // Set error message for the user
});
  }else{
    return;
  }
  
};
const clearErrorMessageAfterDelay = () => {
  setTimeout(() => {
    setErrorMessage('');
    setgoodMessage('');
  }, 2000); // Clear error message after 3 seconds (3000 milliseconds)
};
const handleFirstNameChange = (e) => {
  setFirstName(e.target.value);
}
const handleLastNameChange = (e) => {
  setLastName(e.target.value); 
}
const handleBioChange = (e) => {
  setBio(e.target.value); 
}

const handleSubmitProfile = (e) => {
  e.preventDefault();
  
  setIsLoading(true); // Set loading state to true before making the API call
  fetch('http://localhost:5206/api/UserProfile/UpdatUserProfile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
    }, 
    body: JSON.stringify({
      name: firstName,
      bio: bio,
      lastName: lastName
    })
  }) 
  .then(response => {
    if (response.ok) {
      setIsLoading(false);
      console.log('OK,Updated');
      sessionStorage.setItem('firstName', firstName);
      sessionStorage.setItem('lastName', lastName);
      sessionStorage.setItem('bio', bio);
      setgoodMessage('Successfully Updated');  
      clearErrorMessageAfterDelay();  
  
    }else if (response.status === 15) { 
      // Handle bad request
      setIsLoading(false);
      setErrorMessage('Token Expired'); 
      clearErrorMessageAfterDelay(); 
      handleLogOut();
      
    }else if (response.status === 10) {
      // Handle bad request
      setIsLoading(false);
      setErrorMessage('Internal Server Error,Try again');
      clearErrorMessageAfterDelay(); // Set error message for the user
      
    }else if( response.status === 401){
      setIsLoading(false);
      setErrorMessage('Invalid token');
      clearErrorMessageAfterDelay(); // Set error message for the user
      handleLogOut();
    }else if( response.status === 30){
      setIsLoading(false);
      setErrorMessage('DataBase connection problem');
      clearErrorMessageAfterDelay(); // Set error message for the user
      
    } else {
      setIsLoading(false);
      setErrorMessage('Connection Problem. Please try again.');
      clearErrorMessageAfterDelay(); // Set error message for the user
      }
  }).catch(error => {
    setIsLoading(false);
    setErrorMessage('Connection Problem. Fetch Error.');
    clearErrorMessageAfterDelay(); // Set error message for the user
  });
}
const handleNewPasswordChange = (e) => {
setNewPassword(e.target.value);
}
const handleOldPasswordChange = (e) => {
setOldPassword(e.target.value);
}
const handleSubmitPassword = (e) => {
e.preventDefault();

if (newPassword.length < 5) {
  setErrorMessage('Password must be at least 5 characters long.');
  clearErrorMessageAfterDelay();
  return; // Stop form submission if password is invalid
}
setIsLoading(true); // Set loading state to true before making the API call
fetch('http://localhost:5206/api/Users/ChangePassword', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
  }, 
  body: JSON.stringify({
    OldPassword: oldPassword, // Use the email from the authData context
    NewPassword: newPassword
  })
}) 
.then(response => {
  if (response.ok) {
    console.log('OK,Updated');
    setIsLoading(false);
    setgoodMessage('Successfully updated Password');
    setNewPassword('');
    setOldPassword('');
    clearErrorMessageAfterDelay();
    
  }else if (response.status === 10) { 
    // Handle bad request
    setIsLoading(false);
    setErrorMessage('Invalid Token'); 
    clearErrorMessageAfterDelay();
    handleLogOut();
  }else if (response.status === 20) {
    // Handle bad request
    setIsLoading(false);
    setErrorMessage('Wrong Password');
    clearErrorMessageAfterDelay(); // Set error message for the user
    
  } else {
    setIsLoading(false);
    setErrorMessage('Connection Problem. Please try again.');
    clearErrorMessageAfterDelay(); // Set error message for the user
    }
}).catch(error => {
  setIsLoading(false);
  setErrorMessage('Connection Problem. Fetch Error.');
  clearErrorMessageAfterDelay(); // Set error message for the user
});
}
function formatDateTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = (date.getDate() === now.getDate() &&
                   date.getMonth() === now.getMonth() &&
                   date.getFullYear() === now.getFullYear());

  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffDays = Math.round(Math.abs((now - date) / oneDay));

  if (isToday) {
    // If the date is today, show time in 12-hour format
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes; // adding leading zero if needed
    return `${hours}:${minutesStr}${ampm}`;
  } else if (diffDays <= 7) {
    // If the date is within the past 7 days, show the day of the week
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    return daysOfWeek[date.getDay()];
  } else {
    // If the date is older than 7 days, show date and month
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month}/${day}`;
  }
}

// For Settings code End

/**
<div className="singleConvInfo">
                <span><button onClick={()=>handleDeleteConversation(conversation.convId)}> Delete Conv</button></span>
                <span className='Name'>{conversation.userName} {conversation.lastName}</span>
                <div className='lastMessageContainer'><p className='lastMessage'> {conversation.message}</p>
                <p className='lastUpdatedTime'> {formatDateTime(conversation.updatedTime)}</p>
                <p className='newMessage'>{conversation.notificationCount}</p>
                {conversation.status === "true" ?(<p>Online</p>):(<p>{formatDateTime(conversation.lastSeen)}</p>)}

                
             </div>
            </div> 
*/    
  return(
  <div className='wrapper'>
   <div className='container'>
      <div className='left'>
          <div className='top'>
          <span className='chatLogo'>Fonkagram</span>
          
          <label className="SB">
          <input type="text"
          placeholder="Search By Email" 
          value={searchQueryUser} 
          onChange={(e) => setSearchQueryUser(e.target.value)} />
          </label>
      <div className="SearchUser"> 
          
        {searchResultUser.length > 0 && ( 
        <div className="SearchResultUser"> 
              {searchResultUser.map(result => (
                <div key={result.id}>
                  <button onClick={()=>handleNewUserClick(result.id,result.name,result.lastName)}>Name: {result.name} {result.lastName} <br /> Email:{result.email}</button>
                </div>
              ))} 
        </div>
       )}
          </div>
          <div className="App1">
          <div className='ProfilePicClass'>
             <button onClick={handleButtonClick1} ref={buttonRef} className='profilePicButton'>
          <img className='profilePic' src="https://cdn-icons-png.flaticon.com/256/3524/3524659.png" alt="Profile" /></button>
          </div>
          {isDropdownVisible && (
            <div className="dropdown2" ref={dropdownRef}>
              <ul className='oneUl'>
          {/*Edit Profile(DropDown,Shade) code Start */} 
            <li className='oneLi' >
              <div className="App">
                <div className={`content ${EpIsOverlayVisible ? 'faded' : ''}`}>
                  <button className='buttonSignUpNew' onClick={EphandleButtonClick}>Edit Profile</button>
                </div>

                {EpIsOverlayVisible && (
                  <div className="mineEp">
  
                    <form className='formSignUp' onSubmit={handleSubmitProfile}>
                    <span className='logo'>Fonkagram</span>
                    <span className='title'>Edit Profile</span>
                      <label >Name</label>
                      <input 
                      className='emailInput'
                        type="text"
                        placeholder='Name' 
                        required 
                        value={firstName} 
                        onChange={handleFirstNameChange} 
                        disabled={isLoading}
                      />  
                      <label >Last Name</label>
                      
                      <input 
                      className='emailInput'
                      placeholder='LastName'
                        type="text"  
                        value={lastName} 
                        onChange={handleLastNameChange} 
                        disabled={isLoading}
                      /> 
                      <label>Bio  </label>
                      <input 
                      className='emailInput'
                        type="text"  
                        value={bio} 
                        onChange={handleBioChange} 
                        disabled={isLoading}
                      />
                      <button className='buttonSignUp' disabled={isLoading}>Set</button>
                      
                      {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
                    {goodMessage && <p className='goodMessage'>{goodMessage}</p>}
                    {isLoading && <p className='isLoading'>Loading...</p>}
                    </form>
                      <button className='mineClose' onClick={handleCloseOverlay}>Close</button>
                    </div>
                  
                )}
              </div>  
           
            </li>
          {/*Edit Profile (Drop Down,Shade) code End */}

          {/*Change Password Start*/}
            <li className='oneLi'>
            <div>
            <div className="App">
            <div className={`content ${FpIsOverlayVisible ? 'faded' : ''}`}>
            <button className='buttonSignUpNew' onClick={FphandleButtonClick}>Change Password</button>
            </div>

            {FpIsOverlayVisible && (
            <div className="mineEp">
  
            <form className='formSignUp' onSubmit={handleSubmitPassword} >
            <span className='logo'>Fonkagram</span>
            <span className='title'>Change Password</span>
            <input 
              className='emailInput'
              placeholder='Old Password'
              type="current-password" 
              
              required 
              value={oldPassword}
              onChange={handleOldPasswordChange}
              disabled={isLoading} // Disable input field while loading
            />

            <input 
            className='emailInput'
            placeholder='New Password'
              type="current-password" 
              required 
              value={newPassword}
              onChange={handleNewPasswordChange}
              disabled={isLoading} // Disable input field while loading
            /> 
            <button className='buttonSignUp' disabled={isLoading} >Submit</button>

            {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
            {goodMessage && <p className='goodMessage'>{goodMessage}</p>}
            {isLoading && <p className='isLoading'>Loading...</p>}
            
            </form>

            <button className='mineClose' onClick={handleCloseOverlay}>Close</button>
            </div>
            
            )}
            </div>  
            </div>
            </li>
          {/*Change Password End*/}
          {/*Delete Account Start*/}
          <li className='oneLi'>
          {/*Delete Account(DropDown,Shade) code Start */}
          <div className="App">
          <div className={`content ${DaIsOverlayVisible ? 'faded' : ''}`}>
            <button className='buttonSignUpNew' onClick={DahandleButtonClick}>Delete Account</button>
          </div>

          {DaIsOverlayVisible && (
            <div className="mineEp">
  
              <form className='formSignUp' onSubmit={handleSubmitPassword}>
              <span className='logo'>Fonkagram</span>
              <span className='title'>Danger Zone</span>
                  Are you sure you want to delete this account?
                <button className='buttonTabDelete' onClick={deleteAccount}  disabled={isLoading} >Delete</button>
                
              {isLoading && <p className='isLoading'>Loading...</p>}
                  
              </form>
              
            
                <button className='mineClose' onClick={handleCloseOverlay}>Close</button>
              </div>
            
          )}
        </div>  
        {/*Delete Account (Drop Down,Shade) code End */}

              </li>
          {/*Delete Account End*/}

          {/*Log Out*/}
                <li className='oneLi'>
                <div className="App">
            <button className='buttonSignUpNew' onClick={handleLogOut}>Logout</button>
      
          </div>
              
                
                </li>
          {/*Log Out*/}
              </ul>
            </div>
          )}
          </div>
      </div>
            
          
          {isLoading && <p className='isLoadingConv'>Loading Conversations...</p>}
          
          {conversations.length > 0 ?
          (
          <ul className="people">
           {conversations.map(conversation =>(
              <li key={conversation.convId} className='person' onClick={() => handleConversationClick(conversation.convId,conversation.userId,conversation.userName,conversation.lastName)}>
              <img className='avatar' src="https://cdn4.iconfinder.com/data/icons/button-apps/2000/button_green__user-512.png" alt="" />
              <span className='name'>{conversation.userName} {conversation.lastName}</span>
              <span className='time'>{formatDateTime(conversation.updatedTime)}</span>
              <span className='preview'>{conversation.message}</span>
              </li>
           ))}
          
          </ul>
          ):( 
           <div>{!isLoading && <p className='isLoadingConv'>No Conversations...</p>}
           </div> 
          )}
         </div>


        <div className='right'>
        
        {messages.length > 0 || forSearchUser === true ? (
          <div className='top'>
          
          <span className='name'>{selectedName} {selectedLastName}</span> <br />
          <span className='time'>Last seen recently</span>
         
         </div>
        ):(
          <div></div>
        )}
        

        <div className='ForMessages'>
          {messages.length > 0 || forSearchUser === true ? (
          messages.map(message=>( 
            <div key={message.id}>
           
            {message.senderId !== Number(sessionStorage.getItem('userId'))?(
              <div key={message.id} className="MessageContent">
                {editMessageId !== message.id ?(
                <p className='SingleMessage'>
                {message.content}
                <span className='timeStamp'>{formatDateTime(message.timeStamp)}</span>
                <span className='timeStamp'>{message.edited === true ?("edited"):("")}</span>
                
                <button onClick={() => handleDeleteMessage(message.id)}>Delete</button> 
                </p>
            ):( 
              <form key={message.id} onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editMessageContent}
                onChange={(e) => setEditMessageContent(e.target.value)}
                required
              /> 
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setEditMessageId(null)}>Cancel</button>
            </form>
            )} 
              
            </div>
            ):( 
            <div key={message.id} className="MessageContentR">
              {editMessageId !== message.id ?(
                 <p className='SingleMessageR'>
                 {message.content} 
               <span className='timeStampR'>{formatDateTime(message.timeStamp)}</span>
               <span className='timeStamp'>{message.edited === true ?("edited"):("")}</span>
               <button onClick={() => handleEditMessage(message)}>Edit</button>
              <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
              </p> 
            ):(
              <form key={message.id} onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editMessageContent}
                onChange={(e) => setEditMessageContent(e.target.value)}
                required
              />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setEditMessageId(null)}>Cancel</button>
            </form>
            )} 
              
              
            </div>
            )}
           </div>
           
            
          ))
        ):(
          <p className='isLoadingMessage'>Select a chat to start messaging</p>
        )}
        </div>
        
       {(messages.length > 0 || forSearchUser === true) ? (
          <div className='write'>
         
          <form key= 'unique' onSubmit={handleSendMessage}>
          <input 
        
          type="text" 
          placeholder='Type here...'
          required
          value={sendMessage}
          onChange={handleMessage}
          disabled={isLoadingMessage}
          />
          
         
          </form> 
          
          
          <button onClick={handleSendMessage} disabled={sendMessage.length===0}>
          {isLoadingMessage ? "Sending..." : errorMessage ? "Failed to Send" : "Send"}
          </button>
          </div>
        ):(
         <div></div>
        )}
        </div>
        
         
         
      </div>

     

    </div>

  )
}
export default Chats;