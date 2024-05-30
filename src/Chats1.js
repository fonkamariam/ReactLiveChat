import userEvent from '@testing-library/user-event';
import React, { useState ,useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";                   

function Chats1() {
  const [connection, setConnection] = useState(null);  
  const [newMessagesCount, setNewMessagesCount] = useState({});
  const [conversations, setConversations] = useState([]);
  const [contacts , setContacts] = useState([]);
  const [messages, setMessages] = useState([]); // State for the array of messages
  const [selectedConversation, setSelectedConversation] = useState(null); // State for the selected conversation
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

              connection.on('ReceiveMessage', message => {
                console.log(message);
                console.log(message.record.convId);
                setMessages(prevMessages => {
                  // Check if the conversation is active
                  if (selectedConversation === message.record.convId) {
                    console.log("conversationId == message.conversationid");
                
                    // If active, append the new message to existing messages and sort
                    return [...prevMessages, message].sort((a, b) => new Date(b.record.timeStamp) - new Date(a.record.timeStamp));
                  } else {
                    console.log("else weste");
                
                    // If not active, update the conversation list with new message count
                    setNewMessagesCount(prevNewMessagesCount => ({
                      ...prevNewMessagesCount,
                      [message.conversationId]: (prevNewMessagesCount[message.record.convId] || 0) + 1
                    }));
                  }
                }); 
                console.log("About to go to Set Conversation");
            setConversations(prevConversations => {
              const updatedConversations = prevConversations.map(conversation => {
                if (conversation.convId === message.conversationId) {
                  return { ...conversation, updatedTime: message.updatedTime };
                }
                return conversation;
              });
              return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
            });
          
          });
              
              connection.on('ReceiveConversation', conversation => {
                setConversations(prevConversations => {
                  const updatedConversations = [...prevConversations.filter(conv => conv.convId !== conversation.convId), conversation];
                  return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                });
                console.log("New conversation received:", conversation);
              });
              
          }).catch(e => console.log('Connection failed: ', e));
  }
}, [connection,selectedConversation]);

  
  // for fetching Conversations
  useEffect(() => {
    // Fetch user data from API
    const fetchConvData = async () => {
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
    // for fetching Contacts
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
    fetchConvData(); // Call fetchData function when component mounts
    fecthContact(); // fetching Contacts
  }, []);
  // for searching Contacts
  useEffect(() => {
    if (searchQuery.length > 0) {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`http://localhost:5206/api/Contact/SearchContacts?query=${searchQuery}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
          } else {
            throw new Error('Failed to fetch search results');
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          // Handle error
        }
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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
    sessionStorage.clear();
    console.log("Session Storage cleared");
    navigate(`/`);
 }
 const handleMessage = (e) =>{
  setSendMessage(e.target.value);
}
const handleSendMessage = (e) => {
  e.preventDefault();
  console.log (selectedRecpientId);
  console.log(selectedConversation);
  fetch('http://localhost:5206/api/Message/SendMessage', {
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
    }).then(response => {
      if (response.ok) {
        console.log('Message Sent');
        return;
      }else { 
        console.log("Backend Problem");
      } 
    }).catch(error => {
      console.log("Fetch Error")
    }); 
}

const handleAddContact = (e) => {
  /** 
  useEffect(() => {
    // Fetch user data from API
    const fetchAddContact = async () => {
      try {
        const response = await fetch('http://localhost:5206/api/Contact/AddContact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
          },body: addContact
        });
        if (response.ok) {
          // No data
          console.log("Got All Conversation");
          
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error
      }
    };
    fetchAddContact(); // Call fetchData function when component mounts
    
  }, []);
  */
}
const handleConversationClick = async (convId,recpientId,Name,LastName) => {
  setSelectedConversation(convId); // Set the selected conversation
  setSelectedRecpientId(recpientId);
  setSelectedName(Name);
  setSelectedLastName(LastName);
  setNewMessagesCount(prevNewMessagesCount => ({
    ...prevNewMessagesCount,
    [convId]: 0
  }));
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
      setMessages(messagesData); // Update messages state with the fetched messages
       } else {
      throw new Error('Failed to fetch messages');
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Handle error 
  }
};
const handleNewUserClick =  (RecpientId,Name,LastName)=>{ 
  setSelectedRecpientId(RecpientId); 
  setSelectedName(Name);
  setSelectedLastName(LastName);
  const existingConversation = conversations.find( 
    conversation => conversation.userId === RecpientId
  );

  if (existingConversation) {
    // Fetch messages for the existing conversation
    handleConversationClick(existingConversation.convId, existingConversation.userId, existingConversation.userName, existingConversation.lastName);
  } else {
    // Set messages to "No message"
    setMessages([{ content: "No message" }]);
    setSelectedConversation(null);
  }


}
const handleDeleteMessage = async (messageId) => {
  console.log(messageId);
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
      setMessages(messages.filter(message => message.id !== messageId));
      
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
      setConversations(conversations.filter(conversation => conversation.convId !== convIdPara));
      
      setSelectedConversation(null);
      
    } else {
      throw new Error('Failed to delete message');
    }
  } catch (error) {
    console.error('Error deleting message:Error');
    
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
      setEditMessageId(null);
      setEditMessageContent('');
     
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


  return (
   
    <div className="container">
      <h2>Logged In</h2>
      <div className="Search User">
          <input
            type="text"
            placeholder="Search Users by Email"
            value={searchQueryUser}
            onChange={(e) => setSearchQueryUser(e.target.value)}
          />
          
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
      {conversations ? 
      ( // Render HTML element only when userData is available
      <div className="Conversation">
      {conversations.map(conversation => (
        <div key={conversation.convId}> 
          <button onClick={() => handleConversationClick(conversation.convId,conversation.userId,conversation.userName,conversation.lastName)}>
            Name: {conversation.userName} {conversation.lastName} <br /> ID: {conversation.convId} <br />
            LastMessage: {conversation.message} <br /> 
            Time: {conversation.updatedTime}  <br /> UserId {conversation.userId}
            {newMessagesCount[conversation.convId] ? `${newMessagesCount[conversation.convId]} new message(s)` : ''}
                
          </button> 
        </div>
      ))}
      <div className="Message">
          <h3>Message</h3>
          {selectedConversation || selectedRecpientId ? (
            <div> 

              <h2>{selectedName} {selectedLastName}</h2> <br />
              
              
              {messages.length > 0 ? (
                messages.map(message => (
                  
                  <div key={message.id}>
                  {editMessageId === message.id ? (
                        <form onSubmit={handleEditSubmit}>
                          <input
                            type="text"
                            value={editMessageContent}
                            onChange={(e) => setEditMessageContent(e.target.value)}
                            required
                          />
                          <button type="submit">Submit</button>
                          <button type="button" onClick={() => setEditMessageId(null)}>Cancel</button>
                        </form>
                      ):(
                        <div>
                          <p>{message.content} {message.timeStamp}</p>
                          <button onClick={() => handleEditMessage(message)}>Edit</button>
                          <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                <p>No messages found.</p>
              )}
              <div>
              <div>
              <form onSubmit={handleSendMessage}> 
                
                <br /><br />
                
                <input
                  type="text"
                  required
                  onChange={handleMessage} 
                  disabled={isLoading}
                />
                <button disabled={isLoading}>Send</button>
              </form></div>
              </div>
            </div>
          ) : (
            <p>Select a conversation to see messages.</p>
          )}
        </div>
        <br /><br /><br />
        <div className='Contact'>
            <h3>Contacts</h3>
            <div className="Conversation">
          <input
            type="text"
            placeholder="Search Contacts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {searchResults.length > 0 && (
            <div className="SearchResults">
              {searchResults.map(result => (
                <div key={result.id}>
                  Name :{result.name} <br />
                  Email: {result.email}<br />
                </div>
              ))}
            </div>
          )}
          </div>
            {contacts.map(contact => (
        <div key={contact.id}>
          <button onClick={() => console.log("I am clicked")}>
            Name: {contact.name} <br /> LastName: {contact.lastName} <br />
            Bio: {contact.bio} <br /> 
            
          </button>
        </div>
      ))}
        </div>
         <br /><br /> <br />
    </div>
      ) : (
        <p>Loading...</p>
      )}
      
      <div className="AllChats">

      <div className="Conversation">
      
      </div>
        
        
      </div>
      
      <p>
          {isLoading && <p>Loading...</p>}
          {goodMessage && <p style={{color: 'green'}}>{goodMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button onClick={handleLogOut}>Logout</button>
      </p>
      <p>
        <br></br>
        <Link to="/settings">Setting</Link>
        
        <br/><br/>
      </p>
    </div>
  );
}
export default Chats1;