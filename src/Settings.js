import React, { useState ,useRef,useEffect} from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faEdit, faTrashAlt,faSmile ,faCog, faUserEdit, faKey, faSignOutAlt, faTrash,faCheck,faTimes,faSpinner } from '@fortawesome/free-solid-svg-icons';
import { MdEdit } from 'react-icons/md';
import Picker from '@emoji-mart/react';
import dataXXX from '@emoji-mart/data';
import TextareaAutosize from 'react-textarea-autosize';

function Settings() {
  const [activeTab, setActiveTab] = useState('editProfile');
  
  const [firstName, setFirstName] = useState(sessionStorage.getItem('Name'));
  const [lastName, setLastName] = useState(sessionStorage.getItem('LastName'));
  const [bio, setBio] = useState(sessionStorage.getItem('Bio'));
  const [oldPassword,setOldPassword]=useState('');
  const [newPassword,setNewPassword]=useState('');
  // I don't need messages
  const [errorMessage, setErrorMessage] = useState('');
  const [goodMessage, setgoodMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Access the history object


  const showEditProfileSettings = () => {
    setActiveTab('editProfile');
  };

  const showChangePasswordSettings = () => {
    setActiveTab('changePassword');
  };
  const showDeleteSettings =()=>{
    setActiveTab('Delete');
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
  // For Edit Profile Setting
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  }
  const handleLastNameChange = (e) => {
    setLastName(e.target.value); 
  }
  const handleBioChange = (e) => {
    setBio(e.target.value); 
  }
  const handleLogOut = (e) =>{
     sessionStorage.clear();
     console.log("Session Storage cleared");
     navigate(`/`);
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
// For Password Change
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
/** here for DropDown */
const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleButtonClick = () => {
    setIsOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
  };
  const [searchQueryUser, setSearchQueryUser] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEmojiPickerEDIT,setShowEmojiPickerEDIT] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false); // State for tracking sending status

  
  const emojiPickerRef = useRef(null);
  const settingsRef = useRef(null);
  const modalRef = useRef(null);
  const useOutsideClick = (ref,callback)=>{
    useEffect(() => {
      function handleClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }
  
      document.addEventListener('mousedown', handleClick);
  
      return () => {
        document.removeEventListener('mousedown', handleClick);
      };
    }, [ref, callback]);
  }
  // Sample conversation data for illustration purposes
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setSendingMessage(true); // Set sending state to true when sending a message

      const newMessageObj = { id: Date.now(), content: newMessage, timeStamp: new Date().toLocaleString() };

      // Simulate API call delay
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, newMessageObj]);
        setNewMessage('');
        setSendingMessage(false); // Reset sending state after message is sent
      }, 1000); // Adjust the timeout duration as needed to simulate network delay
    }
  };
/**Now when displaying messages i want the delete and edit button to appear only when i hover above it. and also when a single message is deleted, i want there to be an animation. */
 
const handleEditMessage = (id) => {
  const messageToEdit = messages.find((msg) => msg.id === id);
  setEditMessageId(id);
  setEditMessageContent(messageToEdit.content);
};

  
const handleDeleteMessage = (id) => {
  const messageElement = document.getElementById(`message-${id}`);
  if (messageElement) {
    messageElement.classList.add('message-fade-out');
    setTimeout(() => {
      setMessages(messages.filter(message => message.id !== id));
    }, 500); // Time should match the CSS transition duration
  }
};
const handleDeleteConversation = (id) =>{
    conversations.filter(conv=> conv.id !== id);
};
  
  // Sample conversation data for illustration purposes
  const conversations = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      online: true,
      notifications: 2,
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '12:34PM',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      online: false,
      notifications: 0,
      lastMessage: 'Let\'s meet tomorrow.',
      lastMessageTime: '11:22PM',
    },{
      id: 3,
      firstName: 'John',
      lastName: 'Doe',
      online: true,
      notifications: 2,
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '12:34PM',
    },{
      id: 4,
      firstName: 'John',
      lastName: 'Doe',
      online: true,
      notifications: 2,
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '12:34PM',
    },{
      id: 5,
      firstName: 'John',
      lastName: 'Doe',
      online: true,
      notifications: 2,
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '12:34PM',
    },{
      id: 6,
      firstName: 'John',
      lastName: 'Doe',
      online: true,
      notifications: 2,
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '12:34PM',
    },{
      id: 7,
      firstName: 'John',
      lastName: 'Doe',
      online: true,
      notifications: 2,
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '12:34PM',
    },{
      id: 8,
      firstName: 'John',
      lastName: 'Doe',
      online: true,
      notifications: 2,
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '12:34PM',
    }
    // Add more sample conversations as needed
  ];
  const users = [
    { id: 1, email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe' },
    { id: 2, email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith' },
    { id: 3, email: 'alice.jones@example.com', firstName: 'Alice', lastName: 'Jones' },
    // Add more mock users as needed
  ];
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQueryUser(query);
    if (query) {
      const filtered = users.filter(user => user.email.toLowerCase().includes(query.toLowerCase()));
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleUserSelect = (user) => {
    console.log("Selected user:", user);
    // Perform actions when a user is selected (e.g., start a conversation)
    setSearchQueryUser(user.email);
    setFilteredUsers([]);
  };
  const openModal = (content) => {
    setModalContent(content);
  };
  const closeModal = () => {
    setModalContent(null);
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)  && !modalContent) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef,modalContent]);
  const openUserModal = (user) => {
    setModalContent(
      <div className="p-4">
        <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> {user.bio}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <button onClick={() => setModalContent(null)} className="mt-4 text-blue-500">Close</button>
      </div>
    );
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      setNewMessage(prev => prev + '\n');
    } else if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSaveEditedMessage = () => {
    setMessages(messages.map((msg) => (msg.id === editMessageId ? { ...msg, content: editMessageContent } : msg)));
    setEditMessageId(null);
    setEditMessageContent('');
  };
  //useOutsideClick(emojiPickerRef, () => setShowEmojiPicker(false));
  useOutsideClick(emojiPickerRef,() => setShowEmojiPickerEDIT(false));
    return (
      <div className="flex h-screen relative">
        {modalContent && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div 
          ref={modalRef}
            className="bg-white p-4 rounded-lg shadow-lg w-1/3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">X</button>
            {modalContent}
          </div>
        </div>
      )}
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-100 border-r border-gray-300 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 flex items-center relative">
          <input
            type="text"
            placeholder="Search Users by Email"
            value={searchQueryUser}
            onChange={handleSearch}
            className="input input-bordered w-full p-2 rounded-md"
          />
          <FontAwesomeIcon 
            icon={faCog} 
            className="ml-2 cursor-pointer text-gray-600 hover:text-gray-800" 
            onClick={() => setShowSettings(!showSettings)} 
          />
          {showSettings && (
            <div ref={settingsRef} className="absolute top-full mt-1 right-0 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
               
              <div className="p-2 hover:bg-gray-200 cursor-pointer flex items-center" onClick={() => openModal('Edit Profile')}>
                <FontAwesomeIcon icon={faUserEdit} className="mr-2" /> Edit Profile
              </div>
              <div className="p-2 hover:bg-gray-200 cursor-pointer flex items-center" onClick={() => openModal('Change Password')}>
                <FontAwesomeIcon icon={faKey} className="mr-2" /> Change Password
              </div>
              <div className="p-2 hover:bg-gray-200 cursor-pointer flex items-center" onClick={() => openModal('Delete Account')}>
                <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete Account
              </div>
              <div className="p-2 hover:bg-gray-200 cursor-pointer flex items-center" onClick={() => openModal('Logout')}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
              </div>
            </div>
          )}
          {filteredUsers.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  {user.email}
                </div>
              ))}
            </div>
          )}
        </div>
          {/* Conversations List */}
        <div className="overflow-y-auto flex-grow p-2">
          {conversations.map((conv) => (
            <div 
              key={conv.id}   
              className={` group p-4 flex items-start cursor-pointer  ${selectedConversation && selectedConversation.id === conv.id ? 'bg-gray-300' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <button
                className="relative right-3 text-red-500  hidden group-hover:block"
                onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.id); }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
              
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
                {conv.firstName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold">
                      {conv.firstName} {conv.lastName}
                      <span className={`ml-2 inline-block w-3 h-3 rounded-full ${conv.online ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    </div>
                    <div className="text-sm text-gray-500">{conv.lastMessage}</div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    <div>{conv.lastMessageTime}</div>
                    {conv.notifications > 0 && (
                      <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {conv.notifications}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Right Content */}
        <div className="flex flex-col w-3/4">
          {/* Conversation Info */}
          
          {selectedConversation ? (
            <div className="p-4 bg-gray-200 border-b border-gray-300">
            <div onClick={() => openUserModal(selectedConversation)}  className="cursor-pointer">
              <h2 className="text-lg font-semibold">
                {selectedConversation.firstName} {selectedConversation.lastName}
              </h2> 
              <div className="text-sm text-gray-500">
                {selectedConversation.online ? 'Online' : `Last seen: ${selectedConversation.lastMessageTime}`}
              </div>
            </div>
            </div>
          ) : (
            <div></div>
          )}
       
  
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
          {selectedConversation ? (
            messages.length ? (
              messages.map((message) => (
                <div key={message.id} id={`message-${message.id}`} className="mb-4">
                <div className=''>
                    <div className="chat chat-end">
                      {editMessageId === message.id ? (
                        <div className="group chat-bubble bg-blue-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words">
                      <form key={message.id} onSubmit={handleEditMessage}>
                        <TextareaAutosize
                          type="text"
                          value={editMessageContent}
                          onChange={(e) => setEditMessageContent(e.target.value)}
                          required
                          className=''
                        /> 
                            <button type="submit" className="ml-2 text-gray-600">
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button type="button" onClick={() => setEditMessageId(null)} className="ml-2 text-red-600">
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                            
                      </form>
                        <div className="flex items-center justify-between mt-1">
                          
                          <button
                            onClick={() => setShowEmojiPickerEDIT(!showEmojiPickerEDIT)} ref={emojiPickerRef}
                            className="btn btn-secondary ml-2 size-0"
                          >
                            <FontAwesomeIcon icon={faSmile} size='sm' />
                          </button>
                          {showEmojiPickerEDIT && (
                            <div className="absolute top-10 right-5 z-25">
                              <Picker dataXX={dataXXX} 
                                onEmojiSelect={(e) => { 
                                  setEditMessageContent(editMessageContent + e.native);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      ):(
                        <div className="group chat-bubble bg-blue-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words">
                        {message.content}
                        <div className="flex items-center justify-between mt-1">
                      <button
                        className="ml-2 text-gray-600 hidden group-hover:block"
                        onClick={() => handleEditMessage(message.id)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="ml-2 text-red-600 hidden group-hover:block"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                      </div>
                      )}
                      
                      <div className="chat-footer opacity-50">
                        2:03PM
                      </div>
                      
                    </div>
                    
                    
                  </div>
                  </div>

            ))
            ) : (
            <div className="text-center text-gray-600">No messages</div>
              )
            ) : (
              <div className="text-center text-gray-600">
                <p>Welcome Mr.Harry Kane </p>
               <p>Select a conversation to view messages</p> 
                
              </div>
            )}
          </div>
  
          {/* Input Field */}
        {selectedConversation && (
          <div className="p-4 bg-gray-200 border-t border-gray-300 flex items-center">
            
          <TextareaAutosize  
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="textarea textarea-bordered flex-1 p-2 resize-none rounded-md overflow-hidden"
          onKeyDown={handleKeyDown}
          minRows={1}
          
         
        />
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="btn btn-secondary ml-2"
            >
              <FontAwesomeIcon icon={faSmile} />
            </button>
            <button onClick={handleSendMessage} disabled={sendingMessage}>
          {sendingMessage ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
        </button>
          </div>
        )}
      </div>
        {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-10 z-50">
          <Picker dataXX={dataXXX} 
            onEmojiSelect={(e) => { 
              setNewMessage(newMessage + e.native);
            }}
          />
        </div>
      )}
      </div>  
  );
}

export default Settings;
