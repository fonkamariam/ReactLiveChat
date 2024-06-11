import React, { useState ,useRef,useEffect} from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPause, faTrashAlt,faSmile ,faCog, faUserEdit, faKey, faSignOutAlt, faTrash,faCheck,faTimes,faSpinner,faPaperclip,faMicrophone, faStop, faPlay,faTimesCircle,faDownload} from '@fortawesome/free-solid-svg-icons';
import { MdEdit } from 'react-icons/md';
import Picker from '@emoji-mart/react';
import dataXXX from '@emoji-mart/data';
import TextareaAutosize from 'react-textarea-autosize';
import RecordRTC from 'recordrtc';
import WaveSurfer from 'wavesurfer.js';
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingMessageId, setUploadingMessageId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingMessageId, setDownloadingMessageId] = useState(null);
// Live wave form


  // Voice Message
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);

  const [currentAudioId, setCurrentAudioId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioURL, setCurrentAudioURL] = useState(null);
  
  const [recordingDuration, setRecordingDuration] = useState(0);

  const waveformRecordingRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const [elapsedTimes, setElapsedTimes] = useState({});
  const [playbackPositions, setPlaybackPositions] = useState({});

  const audioRef = useRef(null);
  const durationsRef = useRef({});
  const waveformRefs = useRef({});
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const settingsRef = useRef(null);
  const modalRef = useRef(null);

  // for voice message
  const stopCurrentAudio = () => {
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsPlaying(false);
    setCurrentAudioId(null);
    setElapsedTimes({});
  };
  useEffect(() => {
    stopCurrentAudio();
  }, [selectedConversation]);


  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new RecordRTC(stream, { type: 'audio' });
      recorderRef.current.startRecording();

      setIsRecording(true);
      setRecordingDuration(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prevDuration => prevDuration + 1);
      }, 1000);

      // Setup waveform for recording
      if (waveformRecordingRef.current === null) {
        waveformRecordingRef.current = WaveSurfer.create({
          container: '#waveform-recording',
          waveColor: '#ddd',
          progressColor: '#4a90e2',
          cursorWidth: 0,
          height: 20,
          barWidth: 2,
        });
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };


  const handleStopRecordingOld = () => {
    recorderRef.current.stopRecording(() => {
      const audioURL = URL.createObjectURL(recorderRef.current.getBlob());
      setAudioURL(audioURL);
      const newMessageObj = { id: Date.now(), content: audioURL, timeStamp: new Date().toLocaleString(), isAudio: true };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
    });
    setIsRecording(false);
  };

const handleStopRecording = () => {
  recorderRef.current.stopRecording(async () => {
    const blob = recorderRef.current.getBlob();
    const audioURL = URL.createObjectURL(blob);
    const messageId = Date.now();

    // Add a temporary message with a loading icon
    const newMessageObj = { id: messageId, content: audioURL, timeStamp: new Date().toLocaleString(), isAudio: true, isUploading: true };
    setMessages(prevMessages => [...prevMessages, newMessageObj]);
    setUploadingMessageId(messageId);
    setIsUploading(true);

    // Upload to Firebase Storage
    const storageRef = ref(storage, `audioMessages/${messageId}.webm`);
    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Update the message with the final URL
      setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, content: downloadURL, isUploading: false };
        }
        return msg;
      }));
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading audio:', error);
      // Remove the message if upload fails
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      setIsUploading(false);
    }
  });

  setIsRecording(false);
  clearInterval(recordingIntervalRef.current);
};

  
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };
  
  const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
  };
  
const handlePlayAudio = async (audioURL, messageId) => {
  if (currentAudioId === messageId) {
    if (isPlaying) {
      // Pause the audio
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        setPlaybackPositions(prev => ({ ...prev, [messageId]: currentTime }));
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Resume the audio
      const storedAudio = localStorage.getItem(`audioBlob_${messageId}`);
      if (storedAudio) {
        const blob = base64ToBlob(storedAudio, 'audio/webm');
        const audio = new Audio(URL.createObjectURL(blob));

        audioRef.current = audio;

        // Set the currentTime to the last saved position
        const currentTime = playbackPositions[messageId] || 0;
        audio.currentTime = currentTime;

        audio.addEventListener('timeupdate', () => {
          setElapsedTimes(prev => ({ ...prev, [messageId]: audio.currentTime }));
        });

        audio.addEventListener('ended', () => {
          stopCurrentAudio();
        });

        audio.play().then(() => {
          setIsPlaying(true);
          setCurrentAudioId(messageId);
        }).catch(error => {
          console.error('Playback failed:', error);
        });
      }
    }
  } else {
    // Play new audio
    stopCurrentAudio();

    const storedAudio = localStorage.getItem(`audioBlob_${messageId}`);
    if (storedAudio) {
      const blob = base64ToBlob(storedAudio, 'audio/webm');
      const audio = new Audio(URL.createObjectURL(blob));

      audioRef.current = audio;

      audio.addEventListener('timeupdate', () => {
        setElapsedTimes(prev => ({ ...prev, [messageId]: audio.currentTime }));
      });

      audio.addEventListener('ended', () => {
        stopCurrentAudio();
      });

      audio.play().then(() => {
        setIsPlaying(true);
        setCurrentAudioId(messageId);
      }).catch(error => {
        console.error('Playback failed:', error);
      });
    } else {
      handleDownloadAudio(audioURL, messageId);
    }
  }
};


  
  const handleDownloadAudio = async (audioURL, messageId) => {
  try {
    setIsDownloading(true);
    setDownloadingMessageId(messageId);

    const response = await fetch(audioURL);
    const blob = await response.blob();

    const base64 = await blobToBase64(blob);
    localStorage.setItem(`audioBlob_${messageId}`, base64);

    setIsDownloading(false);
    handlePlayAudio(URL.createObjectURL(blob), messageId);
  } catch (error) {
    console.error('Error downloading audio:', error);
    setIsDownloading(false);
  }
};
const handleConversationChange = (conversationId) => {
  setSelectedConversation(conversationId);
  stopCurrentAudio();
};
  
  useEffect(() => {
    messages.forEach(message => {
      if (message.isAudio && !waveformRefs.current[message.id]) {
        const container = document.getElementById(`waveform-${message.id}`);
        if (container) {
          const waveform = WaveSurfer.create({
            container: `#waveform-${message.id}`,
            waveColor: '#ddd',
            progressColor: '#4a90e2',
            cursorColor: '#4a90e2',
            height: 20,
          });
  
          waveform.on('ready', () => {
            const duration = waveform.getDuration();
            durationsRef.current[message.id] = duration;
            container.style.width = `${Math.min(duration, 60) * 10}px`; // Scale 10px per second, max 600px
            const durationSpan = container.querySelector('.duration');
            if (durationSpan) {
              durationSpan.innerText = `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;
            }
          });
  
          const audioBlobURL = localStorage.getItem(message.content);
          if (audioBlobURL) {
            waveform.load(audioBlobURL);
          } else {
            waveform.load(message.content);
          }
  
          waveform.on('play', () => {
            setCurrentAudioId(message.id);
            setIsPlaying(true);
          });
          waveform.on('pause', () => {
            setIsPlaying(false);
          });
          waveform.on('finish', () => {
            setIsPlaying(false);
            setCurrentAudioId(null);
          });
  
          waveformRefs.current[message.id] = waveform;
        }
      }
    });
  
    return () => {
      // Cleanup WaveSurfer instances on unmount
      Object.values(waveformRefs.current).forEach(waveform => waveform.destroy());
    };
  }, [messages]);
  const handlePauseAudio = () => {
    if (currentAudioId !== null) {
      const waveform = waveformRefs.current[currentAudioId];
      if (waveform && isPlaying) {
        waveform.pause();
      }
    }
  };

  const handleCloseAudio = () => {
    if (currentAudioId !== null) {
      const waveform = waveformRefs.current[currentAudioId];
      if (waveform) {
        waveform.stop();
      }
      setIsPlaying(false);
      setCurrentAudioId(null);
    }
  };
  const OldHandlePlayPauseAudio = (id) => {
    console.log("waveformRef's",waveformRefs.current);
    const waveform = waveformRefs.current[id];
    console.log("waveform",waveform);
    if (waveform) {
      if (isPlaying && currentAudioId === id) {
        waveform.pause();
      } else {
        if (currentAudioId !== null && waveformRefs.current[currentAudioId]) {
          waveformRefs.current[currentAudioId].pause();
        }
        waveform.play();
      }
    }
  };
  const handlePlayPauseAudio = async (audioURL, messageId) => {
    let audioBlobURL = localStorage.getItem(audioURL);
  
    if (!audioBlobURL) {
      try {
        const response = await fetch(audioURL);
        const blob = await response.blob();
        audioBlobURL = URL.createObjectURL(blob);
        localStorage.setItem(audioURL, audioBlobURL);
      } catch (error) {
        console.error('Error fetching audio from URL:', error);
        return;
      }
    }
  
    const waveform = waveformRefs.current[messageId];
  
    if (waveform) {
      if (isPlaying && currentAudioId === messageId) {
        waveform.pause();
      } else {
        if (currentAudioId !== null && waveformRefs.current[currentAudioId]) {
          waveformRefs.current[currentAudioId].pause();
        }
        waveform.load(audioBlobURL);
        waveform.play();
      }
      setCurrentAudioId(messageId);
      setIsPlaying(!isPlaying);
    }
  };
  

  const handleImageClick = (src) => {
    setFullscreenImage(src);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };
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

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessageObj = { id: Date.now(), content: reader.result, timeStamp: new Date().toLocaleString(), isImage: true };
      setMessages([...messages, newMessageObj]);
    };
    reader.readAsDataURL(file);
  }
};
const handleDeleteMessage = (id) => {
  const messageElement = document.getElementById(`message-${id}`);
  if (messageElement) {
    messageElement.classList.add('message-fade-out');
    setTimeout(() => {
    if (currentAudioId === id) {
    stopCurrentAudio();
  }
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
  useOutsideClick(emojiPickerRef,() => setShowEmojiPicker(false));
  
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
              onClick={() => handleConversationChange(conv)}
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
       {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeFullscreenImage}>
          <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-full" />
        </div>
      )}
       <div className="flex justify-center mt-2"> 
        </div>
  
          {/* Messages */}
          
        <div className="flex-1 overflow-y-auto p-4">
        {selectedConversation ? (
          messages.length ? ( 
            messages.map((message) => (
            <div key={message.id} id={`message-${message.id}`} className="mb-4">
            {currentAudioId !== null && message.isAudio && (
              <div className="flex justify-between mt-2">
              <button onClick={() => handlePlayPauseAudio(message.content,message.id)}> 
              <FontAwesomeIcon icon={isPlaying && currentAudioId === message.id ? faPause : faPlay} />
              </button> 
            <button onClick={handleCloseAudio} className="text-red-500">
              <FontAwesomeIcon icon={faStop} />  
            </button> 
          </div> 
           )} 
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
                        {message.isImage ? (
                          <div>
                          <img src={message.content} alt="attachment" className="rounded-lg max-w-full cursor-pointer" 
                          onClick={() => handleImageClick(message.content)}
                          />
                          <div className="flex items-center justify-between mt-1" >
          
                      <button
                        className="ml-2 text-red-600 hidden group-hover:block"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                          </div>
                        ) : message.isAudio?(
                        <div>
                            {isUploading && uploadingMessageId === message.id && (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            )}
                            {!isUploading && (
                              <>
                                {isDownloading && downloadingMessageId === message.id ? (
                                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                ) : (
                                  <button onClick={() => handlePlayAudio(message.content, message.id)} className="mr-2">
                                    <FontAwesomeIcon icon={isPlaying && currentAudioId === message.id ? faPause : faPlay} />
                                  </button>
                                )}
                              </>
                            )}
                          <div id={`waveform-${message.id}`} className="rounded-lg max-w-full">
                          <span className="duration" 
                            id='{`duration-${message.id}`}'>
                            
                            {isPlaying && currentAudioId === message.id
                          ? `${Math.floor((elapsedTimes[message.id] || 0) / 60)}:${Math.floor((elapsedTimes[message.id] || 0) % 60).toString().padStart(2, '0')}`
                          : durationsRef.current[message.id]
                            ? `${Math.floor(durationsRef.current[message.id] / 60)}:${Math.floor(durationsRef.current[message.id] % 60).toString().padStart(2, '0')}`
                            : '0:00'}
                            
                            </span>
                        </div>
                          
                        
                        
                            <div className="flex items-center justify-between mt-1" >
              
                            <button
                              className="ml-2 text-red-600 hidden group-hover:block"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                            </div>
                          
                      </div>
                      ): (
                          
                          <div>
                          {message.content}
                          <div className="flex items-center justify-between mt-1" >
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
          {isRecording ?(
          <div className="flex items-center w-full justify-between">
            <span className="mr-2">{Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}</span>
            <div id="waveform-recording" className="flex-1"></div>
            <button onClick={handleStopRecording} className="ml-2 text-red-600 text-lg">
              <FontAwesomeIcon icon={faStop} size="lg" />
            </button>
          </div>
          ):(
          <div className='flex items-center w-full'>
          <input 
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn btn-secondary ml-2"
          >
            <FontAwesomeIcon icon={faPaperclip} />
          </button>
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
            <button onClick={isRecording ? handleStopRecording : handleStartRecording} className="btn ml-2">
          <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
        </button> 
            <button onClick={handleSendMessage} disabled={sendingMessage}>
          {sendingMessage ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
        </button> 
          </div>
          )}
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
