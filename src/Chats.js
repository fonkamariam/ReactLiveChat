/* eslint-disable react-hooks/exhaustive-deps */

// https://fonkagram.netlify.app/
import React, { useState ,useEffect,useRef,useMemo } from 'react';
import { useNavigate} from 'react-router-dom';
//import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";   
import { createConnection } from './Singleton';
//import * as signalR from '@microsoft/signalr';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from 'react';
import 'react-chat-elements/dist/main.css';
import { MessageBox } from 'react-chat-elements';
//import CustomContextMenu, { useMessageContextMenu } from './CustomContextMenu';
//import './MessageList.css'; // Custom CSS for additional styling
//import useSignalRConnection from './useSignalRConnection';
// Intergration
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faReply,faCheckDouble,faEllipsisV,faSun,faMoon,faPaperPlane, faCloudDownload, faPause, faTrashAlt,faSmile ,faCog, faUserEdit, faKey, faSignOutAlt, faTrash,faCheck,faTimes,faSpinner,faPaperclip,faMicrophone, faStop, faPlay,faBookmark,faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
//import { MdEdit } from 'react-icons/md';
import Picker from '@emoji-mart/react';
import dataXXX from '@emoji-mart/data';
import TextareaAutosize from 'react-textarea-autosize';
import RecordRTC from 'recordrtc';
import WaveSurfer from 'wavesurfer.js';
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ContextMenu from './ContextMenu'; // Import the ContextMenu component
import ContextMenu2 from './ContextMenu2';

// Integration end
function Chats() {
  const [contextMenu, setContextMenu] = useState(null);
  const [contextMenu2,setContextMenu2] = useState(null);
  const sendMessageQueue = useRef([]);
  const editMessageQueue= useRef([]);
  const deleteMessageQueue= useRef([]);
  const isProcessing = useRef(false);
  let tempDark = sessionStorage.getItem('Dark');
  let valueDark = false;
  if (tempDark && tempDark==='true'){valueDark = true}
  const [isDarkMode, setIsDarkMode] = useState(valueDark);
  //const [connection, setConnection] = useState(null);
  const connectionRef = useRef(null); // Use ref instead of state
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]); // State for the array of messages

  //const [messageWs,setMessagesWs] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null); // State for the selected conversation
  const [selectedRecpientId, setSelectedRecpientId] = useState(null);//for sending a message by id
  const [selectedName,setSelectedName]=useState(null);
  const [selecteDeleted,setSelectedDeleted]= useState(false);
  const [selectedTyping,setSelectedTyping] = useState(false);
  const [selectedLastName,setSelectedLastName]=useState(null);
  //const [editMessageId, setEditMessageId] = useState(null);
  //const [editMessageContent, setEditMessageContent] = useState('');
  const navigate = useNavigate(); // Access the history object
  const [searchQueryUser, setSearchQueryUser] = useState('');
  const [searchResultUser, setSearchResultUser] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [goodMessage, setgoodMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isDeletingConv, setIsDeletingConv] = useState(false);
  const [isDeletingMessageId,setIsDeletingMessageId] = useState(null);
  const [isDeletingConvId,setIsDeletingConvId] = useState(null);
  const [isLoadingModal,setIsLoadingModal] = useState(false);
  const [selectedOnlineStatus,setSelectedOnlineStatus] = useState(null);
  const [selectedLastSeen,setSelectedLastSeen] = useState(null);
  const [selectedBio,setSelectedBio] = useState(null);
  const [selectedEmail,setSelectedEmail] = useState(null);
  const [selectedProfilePic,setSelectedProfilePic] = useState([]);
  const typingTimeoutRef = useRef(null);

  // Variable Integration start
  //const [searchQueryUser, setSearchQueryUser] = useState('');
  //const [selectedConversation, setSelectedConversation] = useState(null);
  //const [messages, setMessages] = useState([]);
  //const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  //const [showEmojiPickerEDIT,setShowEmojiPickerEDIT] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullImagePicture,setFullImagePicture]= useState(null);
  const [fullImageOTHER,setFullImageOTHER] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingMessageId, setUploadingMessageId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingMessageId, setDownloadingMessageId] = useState(null);

  const storedProfilePictures = sessionStorage.getItem('ProfilePic');
  const profilePicturesArray = useMemo(() => {
  return storedProfilePictures !== null ? JSON.parse(storedProfilePictures) : [];
  }, [storedProfilePictures]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingNewPic, setIsSettingNewPic] = useState(false);
  const [isDeletingProfilePic,setIsDeletingProfilePic] = useState(false);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768); // Mobile view state

  // For Settings code Start
  const [firstName, setFirstName] = useState(sessionStorage.getItem('Name'));
  const [lastName, setLastName] = useState(sessionStorage.getItem('LastName'));
  const [bio, setBio] = useState(sessionStorage.getItem('Bio'));
  
  
  const [editProfileModal,setEditProfileModal] = useState(false);
  const [changePasswordModal,setChangePasswordModal]= useState(false);
  const [deleteAccountModal,setDeleteAccountModal] = useState(false);
  const [viewUserModal,setViewUserModal] = useState(false);

  const [oldPassword,setOldPassword]=useState('');
  const [newPassword,setNewPassword]=useState(''); 
  const [isLoadingMessage, setIsLoadingMessage] =useState(false);
  const [forSearchUser, setForSearchUser] = useState(false); 

  const [isOffline, setIsOffline] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);

  const [currentAudioId, setCurrentAudioId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [recordingDuration, setRecordingDuration] = useState(0);

  const waveformRecordingRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const [elapsedTimes, setElapsedTimes] = useState({});
  const [playbackPositions, setPlaybackPositions] = useState({});
  const [replyMessage, setReplyMessage] = useState(null);
  const [replyMessageId,setReplyMessageId]=useState(0);
  const [editMessageModal,setEditMessageModal] = useState(null);
  const [editMessageModalId,setEditMessageModalId]= useState(0);
  const audioRef = useRef(null);
  const durationsRef = useRef({});
  const waveformRefs = useRef({});
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const settingsRef = useRef(null);
  const modalRef = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  
  //const eventQueue = useRef([]);
  //const isProcessingEvent = useRef(false);
  const userProfileQueue = useRef([]);
  const conversationQueue = useRef([]);
  const userStatusQueue = useRef([]);
  const seenUnseenQueue= useRef([]);
  const deletedAccnountQueue = useRef([]);

  
  const handleUserProfileQueue = useCallback(async (userProfileString) => {
    // Handle the user profile payload
    const userProfile = JSON.parse(userProfileString);
    
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conversation => {
        if (conversation.userId === Number(userProfile.userId)) {
          let array = JSON.parse(userProfile.profilePic);
          if (array !== null){array = array.reverse();}
          
          return {
            ...conversation,
            userName: userProfile.name,
            lastName: userProfile.lastName,
            bio: userProfile.bio,
            profilePicConv: array
          };
        }
        return conversation;
      });
      return updatedConversations;
    });
  
    if (selectedConversationRef.current !== null && selectedRecpIdRef.current === userProfile.userId) {
      setSelectedName(userProfile.name);
      setSelectedLastName(userProfile.lastName);
      setSelectedBio(userProfile.bio);
      setSelectedDeleted(userProfile.deleted);

    }
  },[]);
  
  const handleConversationQueue = useCallback( async (conversation) => {
    // Handle the conversation payload
    if (selectedConversationRef.current === conversation.convId) {
      setConversations(prevConversations => {
        const updatedConversations1 = prevConversations
          .filter(Xconversation => Xconversation.convId !== conversation.convId)
          .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        return updatedConversations1;
      });
  
        setForSearchUser(false);
        setSelectedConversation(null);
        setSelectedRecpientId(null);
        setMessages([]);
        setSelectedName(null);
        setSelectedLastName(null);
        setSelectedOnlineStatus(null);
        setSelectedLastSeen(null);
        setSelectedBio(null);
        setSelectedEmail(null);
        setSelectedProfilePic([]);

    } else {
      setConversations(prevConversations => {
        const updatedConversations1 = prevConversations
          .filter(Xconversation => Xconversation.convId !== conversation.convId)
          .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        return updatedConversations1;
      });
      sessionStorage.removeItem(conversation.convId);
    }
  },[]);
  
  const handleUserStatusQueue = useCallback( async (userStatusPara) => {
    // Handle the user status payload
    let userStatus=userStatusPara.objStatus;
    console.log("userStatus",userStatus);
    
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conversation => {
        if (conversation.userId === Number(userStatus.userId)) {
          return { ...conversation, status: String(userStatus.isOnline), lastSeen: userStatus.lastSeen };
        }
        return conversation;
      });
      return updatedConversations;
    });
    if (selectedConversationRef.current !== null && selectedRecpIdRef.current === userStatus.userId) {
      setSelectedOnlineStatus(String(userStatus.isOnline));
      setSelectedLastSeen(userStatus.lastSeen);

    }
  },[]);

  const hanldeSendMessageQueue = useCallback(async (message) =>{
     
      //set Conversation state
      let contentRefined = message.content;
      let refinedAudioStatus = false;
      let refinedImageStatus = false;
      if (message.isAudio === true){
        contentRefined = 'Voice Message';
        refinedAudioStatus = true;
      }
      if(message.isImage === true){
        contentRefined = 'Photo';
        refinedImageStatus= true;
      }
  
      const existingConversation1 = conversations.find( 
        conversation => conversation.convId === message.convId
      );
     
    
      if (existingConversation1 === undefined ) {
        // Calling GetSingleConversation(convId) API
        try {
          const messagesResponse = await fetch(`http://localhost:5206/api/Message/GetSingleConversation?query=${message.convId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
            }
          });
          if (messagesResponse.ok) {
            const convData = await messagesResponse.json();
            // Inside or Outside conv, Only for making Seen or Unseen

            if(selectedRecpIdRef.current === message.senderId){
              setConversations(prevConversations => {
                // Create a new array that includes the previous conversations and the new one
                
                const updatedConversations12 = [
                  ...prevConversations,
                  {
                    convId: convData.convId,
                    message: contentRefined,
                    updatedTime: convData.timeStamp,
                    messageId: convData.id,
                    userId: selectedRecpientId,
                    userName: convData.userName,
                    lastName: convData.lastName,
                    bio: convData.bio,
                    email:convData.email,
                    notificationCount: 0,
                    isAudio: convData.isAudio,
                    isImage: convData.isImage,
                    profilePicConv:convData.profilePicConv,
                    status:convData.status,
                    lastSeen: convData.lastSeen,
                    seen:convData.seen,
                    messageSender:convData.messageSender,
                    deleted: convData.deleted  
                  }
                ];
              
                // Sort the updated conversations array by updatedTime
                updatedConversations12.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
              
                // Return the sorted array to update the state
                return updatedConversations12;
              });
              handleConversationClick(convData.convId, convData.userId, convData.userName, convData.lastName,convData.status,convData.lastSeen,convData.bio,convData.email,convData.ProfilePicConv,convData.deleted);
              zeroNotification(message.id); // sets to false
              return;
            }else{
              // Made NotiCount 1
              setConversations(prevConversations => {
                // Create a new array that includes the previous conversations and the new one
                
                const updatedConversations12 = [
                  ...prevConversations,
                  {
                    convId: convData.convId,
                    message: contentRefined,
                    updatedTime: convData.timeStamp,
                    messageId: convData.id,
                    userId: selectedRecpientId,
                    userName: convData.userName,
                    lastName: convData.lastName,
                    bio: convData.bio,
                    email:convData.email,
                    notificationCount: 1,
                    isAudio: convData.isAudio,
                    isImage: convData.isImage,
                    profilePicConv:convData.profilePicConv,
                    status:convData.status,
                    lastSeen: convData.lastSeen,
                    seen:convData.seen,
                    messageSender:convData.messageSender,
                    deleted: convData.deleted  
                  }
                ];
              
                // Sort the updated conversations array by updatedTime
                updatedConversations12.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
              
                // Return the sorted array to update the state
                return updatedConversations12;
              });
              // No setting zero Notification
              return;
            } 
          } else {
            throw new Error('Failed to fetch messages');
          }
        } catch (error) {
          window.location.reload();
          console.error('Error fetching messages:', error);
          // Handle error
        }
        
      }else{
          //console.log("Alread Conv ale")?
          if (selectedConversationRef.current === message.convId) {
            setConversations(prevConversations =>{ 
              const updatedConversations = prevConversations.map(conversation => {
                if (conversation.convId === message.convId) { 
                  // Update the message and timeStamp for the matching conversation
                  return { ...conversation, message: contentRefined,seen:false, updatedTime: message.timeStamp,messageId:message.id,notificationCount: 0,isAudio:refinedAudioStatus,isImage:refinedImageStatus,messageSender:message.senderId};
                } 
                return conversation;
              });
              // Sort the updated conversations by updatedTime
              return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
          });
          zeroNotification(message.id); // sets to false
          // Define a retry limit
      const maxRetries = 5; // Limit the retries to 5 times
      let retryCount = 0;
      async function tryInvoke() {
        try {
          await connectionRef.current.invoke('HanldeSeenUnseenTask',message.recpientId,message.id,message.convId);
        } catch (error) {
          console.error('Error sending message:', error);
          retryCount += 1;
          if (retryCount < maxRetries) {
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            
            setTimeout(() => {
              tryInvoke(); 
            }, 2000);
          } else {
            console.error(`Failed to send message after ${maxRetries} attempts.`);
          }
        }
      }
      tryInvoke();
          }else{ 
            
            setConversations(prevConversations =>{ 
              const updatedConversations = prevConversations.map(conversation => {
                if (conversation.convId === message.convId) { 
                  let prevCount = conversation.notificationCount + 1;
                  // Update the message and timeStamp for the matching conversation
                  return { ...conversation, message: contentRefined, seen: message.seen, updatedTime: message.timeStamp,messageId:message.id,notificationCount: prevCount,isAudio:refinedAudioStatus,isImage:refinedImageStatus,messageSender:message.senderId};
                }
                return conversation;
              }); 
              // Sort the updated conversations by updatedTime
              return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
          })
          };
            
      }
        
        // setMessages state insert
      
          
          if ( selectedConversationRef.current === message.convId && sessionStorage.getItem(`${message.convId}`)) {
            // update both message state and Ss 
            console.log("both MessState and Ss");
            
            const newMessage = {
              content: message.content,
              convId: message.convId,
              deleted: message.deleted,
              id: message.id,
              messageType: message.messageType,
              recpientId: message.recpientId,
              senderId: message.senderId,
              status:message.status,
              timeStamp: message.timeStamp,
              isAudio: message.isAudio,
              isImage: message.isImage,
              reply: message.reply
              };
            
            insertMessage(newMessage);
            const ParsedMessage = JSON.parse(sessionStorage.getItem(`${message.convId}`));
            if (ParsedMessage!== null) {
            ParsedMessage.push(newMessage);
            sessionStorage.setItem(`${message.convId}`,JSON.stringify(ParsedMessage))
            }
  
          }else if (selectedConversationRef.current === message.convId && !sessionStorage.getItem(`${message.convId}`)){
            console.log("both MessState and Ss");
            
            const newMessage = {
              content: message.content,
              convId: message.convId,
              deleted: message.deleted,
              id: message.id,
              messageType: message.messageType,
              recpientId: message.recpientId,
              senderId: message.senderId,
              status:message.status,
              timeStamp: message.timeStamp,
              isAudio: message.isAudio,
              isImage: message.isImage,
              reply: message.reply
              };
            
            insertMessage(newMessage);
            const ParsedMessage = JSON.parse(sessionStorage.getItem(`${message.convId}`));
            if (ParsedMessage!== null) {
            ParsedMessage.push(newMessage);
            sessionStorage.setItem(`${message.convId}`,JSON.stringify(ParsedMessage))
            }
  
          }else if ( message.convId !== selectedConversationRef.current && sessionStorage.getItem(`${message.convId}`)) {
            console.log("Only Session Storage,Not SelectedConversation");
            const newMessage = {
              content: message.content,
              convId: message.convId,
              deleted: message.deleted,
              id: message.id,
              messageType: message.messageType,
              recpientId: message.recpientId,
              senderId: message.senderId,
              status:message.status,
              timeStamp: message.timeStamp,
              isAudio: message.isAudio,
              isImage: message.isImage,
              reply: message.reply
              };
            
            
            const ParsedMessage = JSON.parse(sessionStorage.getItem(`${message.convId}`));
            if (ParsedMessage!== null) {
            ParsedMessage.push(newMessage);
            sessionStorage.setItem(`${message.convId}`,JSON.stringify(ParsedMessage))
            }
                                
          }else if( message.convId !== selectedConversationRef.current && !sessionStorage.getItem(`${message.convId}`)){
            console.log("Don't do anything");
          }else{
            console.log("Problem Inserting Message for Reciever in signalR");
          }
    
  },[]);
  const hanldeEditMessageQueue = useCallback(async (message) =>{
     // Edit Messsage Conversation laye yalwne
     setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conversation => {
        if (conversation.convId === message.convId && conversation.messageId === message.id && message.new === true) {
          return { ...conversation, message: message.content, updatedTime: message.timeStamp,messageId:message.id };
        } 
        return conversation; 
      });
  
      // Sort the updated conversations by updatedTime
      return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
    });
    //set Message state update
    if ( selectedConversationRef.current===message.convId && sessionStorage.getItem(`${message.convId}`)) {
      // update both message state and Ss 
      console.log("both MessState and Ss");
      
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(messagePara => {
          if (messagePara.id === message.id) {
            return { ...messagePara, content: message.content,edited:message.edited, new:message.new};
          }
          return messagePara;
        });
    
        // Sort the updated conversations by updatedTime
        return updatedMessages;
      });
      const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
      if (xy!== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === message.id) {
              xy[index].content = message.content;
              xy[index].edited = message.edited;
              xy[index].new = message.new;
              break; 
          } 
      }
      sessionStorage.setItem(`${message.convId}`,JSON.stringify(xy))
      }                    
      
    }else if (selectedConversationRef.current===message.convId && !sessionStorage.getItem(`${message.convId}`)){
      console.log(" MessState and !Ss");
      
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(messagePara => {
          if (messagePara.id === message.id) {
            return { ...messagePara, content: message.content,edited:message.edited,new:message.new};
          }
          return messagePara;
        });
    
        // Sort the updated conversations by updatedTime
        return updatedMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
      });
      const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
      if (xy!== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === message.id) {
              xy[index].content = message.content;
              xy[index].edited = message.edited;
              xy[index].new = message.new;
              break; 
          } 
      }
      sessionStorage.setItem(`${message.convId}`,JSON.stringify(xy))
      }                    
      
    }else if ( message.convId !== selectedConversationRef.current && sessionStorage.getItem(`${message.convId}`)) {
      console.log("Only Session Storage,Not Message State");
      
      const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
      if (xy !== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === message.id) { 
              xy[index].content = message.content;
              xy[index].edited = message.edited;
              xy[index].new = message.new;
              break; 
          } 
      }
      sessionStorage.setItem(`${message.convId}`,JSON.stringify(xy))
      }                    
    }else if( message.convId !== selectedConversationRef.current && !sessionStorage.getItem(`${message.convId}`)){
      
      console.log("Don't do anything");
    }else{
      console.log("Problem Updating Message for Reciever in signalR");
    } 
    
}, []);
  const hanldeDeleteMessageQueue = useCallback(async (message) =>{
    

  if ( message.convId === selectedConversationRef.current) {
              
    // for Message State
          console.log("About to delete from Message state DELETE");
          if (messagesRef.current.length === 1 ) {
            console.log("Message length = One");
            setMessages([]);
            sessionStorage.removeItem(`${message.convId}`);
            console.log("One Text Only");
            
            setConversations(prevConversations => {
              const updatedConversations1 = prevConversations
                .filter(conversation => conversation.convId !== selectedConversationRef.current) // Exclude the conversation with the specified convId
                .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
            return updatedConversations1;
            });
            setSelectedConversation(null);
            setForSearchUser(false);
            setSelectedRecpientId(null);
            
          }else{
            console.log("selected Conversation and more than one text in Message ");
                             
            setConversations(prevConversations =>{
              const updatedConversations = prevConversations.map(conversation => {
                if (conversation.messageId === message.id) {
                  let refinedContent = messagesRef.current.at(-2).content;
                  let refinedAudioStatus = false;
                  let refinedImageStatus = false;
                  if (messagesRef.current.at(-2).isAudio === true){
                       refinedContent = 'Voice Message';
                       refinedAudioStatus=true;
                  }
                  if (messagesRef.current.at(-2).isImage === true){
                      refinedContent = 'Photo';
                      refinedImageStatus=true;
                  }
                  return { 
                    ...conversation, 
                    message: refinedContent, 
                    updatedTime: messagesRef.current.at(-2).timeStamp,
                    messageId: messagesRef.current.at(-2).id,
                    isAudio:refinedAudioStatus,
                    isImage:refinedImageStatus,
                    seen: messagesRef.current.at(-2).new
                  };
                } 
                return conversation;
              });
              updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
              return updatedConversations; // Return the updated conversations array
            });  
          
            let varMessageArray = messagesRef.current;
            const filteredMessages = varMessageArray.filter(messagePara => {
              return messagePara.id !== message.id;
          });
      
           
            // Update the state with the filtered messages
            setMessages(filteredMessages);
            //console.log(`ConversationID: ${message.convId} for fetching sessionStorage`);
            const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
            if (xy!== null) {
              for (let index = 0; index < xy.length; index++) {
                if ( xy[index].id === message.id) {
                  xy.splice(index,1);  
                  break; 
                } 
              }
            sessionStorage.setItem(`${message.convId}`,JSON.stringify(xy))
            console.log("Setted Session Storage");
            }
            //zeroNotification(message.id);
            
          } 
      
  }else if ( selectedConversationRef.current !== message.convId && sessionStorage.getItem(`${message.convId}`)){                    
    console.log("No sc but SS DELETE");  
        //console.log(message);        
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conversation => {
            if (conversation.convId === message.convId && conversation.messageId === message.id) {
              let prevCount = conversation.notificationCount;                              
              if(Number(prevCount) !== 0){
                prevCount = prevCount - 1;
              }
                                            
              const Parsed = JSON.parse(sessionStorage.getItem(`${message.convId}`));
              let refinedContent = Parsed.at(-1).content;
              console.log("RefinedContent:",refinedContent);
              let refinedAudioStatus = false;
              let refinedImageStatus = false;
                  if (Parsed.at(-1).isAudio === true){
                       refinedContent = 'Voice Message';
                       refinedAudioStatus= true;
                  }
                  if (Parsed.at(-1).isImage === true){
                      refinedContent = 'Photo';
                      refinedImageStatus=true;
                  }
              return { ...conversation, message: refinedContent, updatedTime: Parsed.at(-1).timeStamp, messageId:Parsed.at(-1).id,notificationCount:prevCount,isAudio:refinedAudioStatus,isImage:refinedImageStatus,seen:Parsed.at(-1).content};
            }
            return conversation; 
          });
      
          // Sort the updated conversations by updatedTime
          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        });
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conversation => {
            if (conversation.convId === message.convId && conversation.messageId !== message.id && message.new === true) {
              let prevCount = Number(conversation.notificationCount);                              
              if(prevCount !== 0){
                prevCount = prevCount - 1;
              }
                                            
              const Parsed = JSON.parse(sessionStorage.getItem(`${message.convId}`));
              let refinedContent = Parsed.at(-1).content;
              let refinedAudioStatus = false;
              let refinedImageStatus = false;
                  if (Parsed.at(-1).isAudio === true){
                       refinedContent = 'Voice Message';
                       refinedAudioStatus= true;
                  }
                  if (Parsed.at(-1).isImage === true){
                      refinedContent = 'Photo';
                      refinedImageStatus=true;
                  }
              return { ...conversation, message: refinedContent, updatedTime: Parsed.at(-1).timeStamp, messageId:Parsed.at(-1).id,notificationCount:prevCount,isAudio:refinedAudioStatus,isImage:refinedImageStatus,seen:Parsed.at(-1).content};
            }
            return conversation; 
          });
      
          // Sort the updated conversations by updatedTime
          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        });
        // Checking Notification Count
        //console.log("ONePassed");  
    
        
        //setted message state
        const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
        if (xy!== null) {
          for (let index = 0; index < xy.length; index++) {
            if ( xy[index].id === message.id) {
              xy.splice(index,1);  
              break; 
            } 
        }
        sessionStorage.setItem(`${message.convId}`,JSON.stringify(xy))
        //console.log("three passed");  
    
      }          

  }else if (selectedConversationRef.current !== message.convId  && !sessionStorage.getItem(`${message.convId}`)){
        
        console.log("No Sc and No Ss DELETE");
        const checkConvId = (convId) => {
          return conversationsRef.current.some(conversation => conversation.convId === convId);
        };
        if(checkConvId(message.convId)===true){
          try {
            const messagesResponse = await fetch(`http://localhost:5206/api/Message/GetLastMessage?query=${message.convId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
              }
            });
            if (messagesResponse.ok) {
              const messagesData = await messagesResponse.json();
              if (messagesData!== null){
                setConversations(prevConversations => {
                  const updatedConversations = prevConversations.map(conversation => {
                    if (conversation.convId === message.convId && conversation.messageId === messagesData.id) {
                      
                      let prevCount = Number(conversation.notificationCount);
                      if(Number(prevCount) !== 0){
                        prevCount = prevCount -1;
                      }
                      let refinedContent = messagesData.content;
                      let refinedAudioStatus = false;
                      let refinedImageStatus = false;
                      if (messagesData.isAudio === true){
                            refinedContent = 'Voice Message';
                            refinedAudioStatus=true;
                      }
                      if (messagesData.isImage === true){
                          refinedContent = 'Photo';
                          refinedImageStatus=true;
                      }
                      return { ...conversation, message: refinedContent, updatedTime: messagesData.timeStamp, messageId: messagesData.id ,notificationCount:prevCount,isAudio:refinedAudioStatus,isImage:refinedImageStatus};
                    }
                    return conversation; 
                  });
          
                  // Sort the updated conversations by updatedTime
                  return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                });
                console.log('FIVE');
                setConversations(prevConversations => {
                  const updatedConversations = prevConversations.map(conversation => {
                    if (conversation.convId === message.convId && conversation.messageId !== messagesData.id && messagesData.new ===true) {
                      
                      let prevCount = Number(conversation.notificationCount);
                      if(Number(prevCount) !== 0){
                        prevCount = prevCount -1;
                      }
          
                      return { ...conversation, notificationCount:prevCount};
                    }
                    return conversation; 
                  });
              
                  // Sort the updated conversations by updatedTime
                  return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
                });
              }
              
              return; 
            } else {
              throw new Error('Failed to fetch messages');
            }
          } catch (error) {
            console.error('Error fetching messages:', error);
            // Handle error
          }
        }else{
          console.log("A conversaion is deleted, not my problem");
        }
        
  }else{
    console.log("problem at deleting message for conversation");
  }
 
}, []);
  const hanldeSeenUnseenQueue = useCallback(async (message) =>{
    //setting Conversation
    
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conversation => {
        if (conversation.convId === message.convId && (conversation.messageId === message.id || message.id ===0)) {
          return { ...conversation, seen: false };
        } 
        return conversation; 
      });
  
      // Sort the updated conversations by updatedTime
      return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
    });
    // setting Message state
    if ( selectedConversationRef.current===message.convId && sessionStorage.getItem(`${message.convId}`)) {
      // update both message state and Ss 
      console.log("both MessState and Ss");
      // Marks all messages to seen 
      if (message.id === 0){
        // Update the messageState
        setMessages(prevMessages => { 
          const updatedMessages = prevMessages.map(messagePara => {
            // Set `new` to false for all unseen messages
            if (messagePara.new === true) {
              return { ...messagePara, new: false };
            }
            return messagePara;
          });

          // Return the updated messages
          return updatedMessages;
        });

        // Update session storage
        const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
        if (xy !== null) {
          // Iterate through all messages in session storage and set `new` to false for unseen ones
          for (let index = 0; index < xy.length; index++) {
            if (xy[index].new === true) {
              xy[index].new = false;
            }
          }
          // Save the updated messages back to session storage
          sessionStorage.setItem(`${message.convId}`, JSON.stringify(xy));
        }
        return;

      }
      
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(messagePara => {
          if (messagePara.id === message.id) {
            return { ...messagePara, new:false};
          }
          return messagePara;
        });
    
        // Sort the updated conversations by updatedTime
        return updatedMessages;
      });
      const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
      if (xy!== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === message.id) {
              
              xy[index].new = false ;
              break; 
          } 
      }
      sessionStorage.setItem(`${message.convId}`,JSON.stringify(xy))
      }                    
      
    }else if (selectedConversationRef.current===message.convId && !sessionStorage.getItem(`${message.convId}`)){
      console.log(" MessState and !Ss");
      // Marks all messages to seen 
      if (message.id === 0){
        // Update the messageState
        setMessages(prevMessages => { 
          const updatedMessages = prevMessages.map(messagePara => {
            // Set `new` to false for all unseen messages
            if (messagePara.new === true) {
              return { ...messagePara, new: false };
            }
            return messagePara;
          });

          // Return the updated messages
          return updatedMessages;
        });

        
        return;

      }
      setMessages(prevMessages => {
        const updatedMessages = prevMessages.map(messagePara => {
          if (messagePara.id === message.id) {
            return { ...messagePara, new:false};
          }
          return messagePara;
        });
    
        // Sort the updated conversations by updatedTime
        return updatedMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
      });
      
    }else if ( message.convId !== selectedConversationRef.current && sessionStorage.getItem(`${message.convId}`)) {
      console.log("Only Session Storage,Not Message State");
      // Marks all messages to seen only in sessionStorage
      if (message.id === 0){
        
        // Update session storage only
        const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
        if (xy !== null) {
          // Iterate through all messages in session storage and set `new` to false for unseen ones
          for (let index = 0; index < xy.length; index++) {
            if (xy[index].new === true) {
              xy[index].new = false;
            }
          }
          // Save the updated messages back to session storage
          sessionStorage.setItem(`${message.convId}`, JSON.stringify(xy));
        }
        return;

      }
      const xy = JSON.parse(sessionStorage.getItem(`${message.convId}`));
      if (xy !== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === message.id) { 
             
              xy[index].new = false;
              break; 
          } 
      }
      sessionStorage.setItem(`${message.convId}`,JSON.stringify(xy))
      }                    
    }else if( message.convId !== selectedConversationRef.current && !sessionStorage.getItem(`${message.convId}`)){
      
      console.log("Don't do anything");
    }else{
      console.log("Problem Updating Message for Reciever in signalR");
    } 
 
}, []);
const handleDeletedAccnountQueue = useCallback(async (userId) =>{
  //setting Conversation
  
  setConversations(prevConversations => {
    const updatedConversations = prevConversations.map(conversation => {
      if (conversation.userId === userId ) {
        return { ...conversation, deleted: true };
      } 
      return conversation; 
    });

    // Sort the updated conversations by updatedTime
    return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
  });
  

}, []);


  const processEvents = useCallback(() => {
    if (isProcessing.current) return;
    
    if (sendMessageQueue.current.length === 0 && editMessageQueue.current.length ===0 && deleteMessageQueue.current.length === 0  && userProfileQueue.current.length === 0 && conversationQueue.current.length === 0 && userStatusQueue.current.length === 0) {
      isProcessing.current = false;
      return;
    }
  
    isProcessing.current = true;
  
    // Process messages
    if (sendMessageQueue.current.length > 0) {
      //console.log('Message Queue');
                    
      const message = sendMessageQueue.current.shift();
      hanldeSendMessageQueue(message).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }
    if (editMessageQueue.current.length > 0) {
      //console.log('Message Queue');
                    
      const message = editMessageQueue.current.shift();
      hanldeEditMessageQueue(message).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }
    if (deleteMessageQueue.current.length > 0) {
      //console.log('Message Queue');
                    
      const message = deleteMessageQueue.current.shift();
      hanldeDeleteMessageQueue(message).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }
    if (seenUnseenQueue.current.length > 0) {
      //console.log('Message Queue');
                    
      const message = seenUnseenQueue.current.shift();
      hanldeSeenUnseenQueue(message).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }
    if (userProfileQueue.current.length > 0) {
      console.log('UserProfile Queue');
      
      const userProfile = userProfileQueue.current.shift();
      handleUserProfileQueue(userProfile).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }
    if (conversationQueue.current.length > 0) {
      
      const conversation = conversationQueue.current.shift();
      handleConversationQueue(conversation).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }
    if (userStatusQueue.current.length > 0) {
      
      const userStatus = userStatusQueue.current.shift();
      
      handleUserStatusQueue(userStatus).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }
    if (deletedAccnountQueue.current.length > 0) {
      
      const deletedAccount = deletedAccnountQueue.current.shift();
      
      handleDeletedAccnountQueue(deletedAccount).finally(() => {
        isProcessing.current = false;
        processEvents();
      });
    }

  }, [hanldeSendMessageQueue,hanldeEditMessageQueue,hanldeDeleteMessageQueue,hanldeSeenUnseenQueue,handleUserProfileQueue,handleUserStatusQueue,handleConversationQueue,handleDeletedAccnountQueue]);

  const fetchMissedUpdates = useCallback( async () => {
    console.log("fetchMissedUPdate called");
        
    try {
      const response = await fetch('http://localhost:5206/api/Message/GetMissedPayloads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
        }
      });
  
      if (response.ok) {
        console.log("Got Response from fetchMissedUPdate");
        const dataJson = await response.json();
        
  
        dataJson.forEach(serializedUpdate => {
          const update = JSON.parse(serializedUpdate);

          if      ((update.type === 'SendMessage')) {
            sendMessageQueue.current.push(update.data);
          }
          else if ((update.type === 'EditMessage')) {
            editMessageQueue.current.push(update.data);
          }
          else if ((update.type === 'DeleteMessage')) {
            deleteMessageQueue.current.push({ id: update.messageId, convId: update.convId });
          }
          else if ((update.type === 'UserProfile')) {
            userProfileQueue.current.push(update.data);
          }
          else if ((update.type === 'SeenUnseen')) {
            seenUnseenQueue.current.push({ id: update.messageId, convId: update.convId });
          }
          else if ((update.type === 'UserStatus')) {
            let userIdMissedPayload= update.userId;
            let isOnlineMissedPayload=update.status;
            let lastSeenMissedPayload=update.time;
            userStatusQueue.current.push({objStatus: {userIdMissedPayload,isOnlineMissedPayload,lastSeenMissedPayload }});
          }
          else if ((update.type === 'deleteConversation')) {
            conversationQueue.current.push({ otherUserId: update.otherUserId, convId: update.convId });
          }
          else if ((update.type === 'DeletedAccount')) {
            deletedAccnountQueue.current.push(update.userId);
          }

          else{
            console.log("In MissedPayloads....type isn't any of my type");
          }
          processEvents();
 
        });
        
  
      } else {
        //window.location.reload();
        console.log("FetchMissedUpdates Else block");
        throw new Error('Failed to fetch missed updates');
        
      }
    } catch (error) {
      console.error('Error fetching missed updates:', error);
      //window.location.reload();

    } finally {
      //console.log("False New feature fetching Missed Updates");
      setIsOffline(false);
    }
  },[processEvents,setIsOffline]);

  const showToast = useCallback((message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        backgroundColor: isDarkMode? 'black':'bg-gray-100',
        color: isDarkMode? 'white':'black'
      }
    });
  }, [isDarkMode]);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages are updated
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const processTyping = useCallback((typer,valueBool)=>{
    if (selectedRecpientId !== null && selectedRecpientId === typer) {
      
      setSelectedTyping(valueBool);
      
    
    }
  },[selectedRecpientId,setSelectedTyping]);
  
  
  const handleConnectionLost = useCallback(() => {    
    reconnectTimeoutRef.current = setTimeout(() => {
      showToast('Connection lost. Attempting to reconnect...');
    }, 1500); // 5000ms = 5 seconds, adjust as needed
    
  }, [showToast]);

/*  const clearReconnectTimeout =useCallback( () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  },[]);
  */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      
      const connection = createConnection();
      connectionRef.current = connection;
     
      connection.start()
        .then(() => {
          console.log("Start");
          setIsOffline(false);

            connectionRef.current.on('ReceiveSendMessage', message => {
                console.log('ReceiveSendMessage', message);
                sendMessageQueue.current.push(message);
                processEvents();
            });
            // ProjectMakeFast
            connectionRef.current.on('ReceiveEditMessage', message => {
              console.log('ReceiveEditMessage', message);
              editMessageQueue.current.push(message);
              processEvents();
            });
            connectionRef.current.on('ReceiveDeleteMessage', (messId, convId) => {
              // Push the messageId and convId to the deleteMessageQueue
              console.log("RecieveDeleteMessage Id:",messId);
              deleteMessageQueue.current.push({ id: messId, convId: convId });

              processEvents();
            });
            connectionRef.current.on('ReceiveSeenUnseen', (messId, convId) => {
              console.log("ReceiveSeenUnseen Id:",messId);
              seenUnseenQueue.current.push({ id: messId, convId: convId });

              processEvents();
            });
            connectionRef.current.on('ReceiveUserProfile', userProfile => {
              console.log('Receive UserProfile');
              userProfileQueue.current.push(userProfile);
              processEvents();
            });

            connectionRef.current.on('ReceiveConversation', (otherUserId,convId) => {
                console.log('ReceiveConversation Coming...');
                conversationQueue.current.push({ otherUserId: otherUserId, convId: convId });

                processEvents();
            });

            connectionRef.current.on('UserStatusChanged', (userId, isOnline, lastSeen) => {
                console.log('UserStatusChanged being executed');
                userStatusQueue.current.push({objStatus: { userId, isOnline, lastSeen }});
                processEvents();
            });

            connectionRef.current.on('Typing', (typer, valueBool) => {
                console.log('Typing');
                processTyping(typer, valueBool);
            });
            connectionRef.current.on('ReceiveDeletedAccount', userId => {
              console.log("ReceiveDeletedAccount Id:",userId);
              deletedAccnountQueue.current.push(userId);
              processEvents();
            });


            connectionRef.current.onclose(() => {
                console.log("Closing");
                console.log("After Closing...");
                
                
            });
            connectionRef.current.onreconnected(() => {
              console.log("Reconnected");
              setIsOffline(true);
              // Fetch missed updates after reconnection
              fetchMissedUpdates();
            })
            }).catch(e => {
              console.log("Catch failed current state");
              handleConnectionLost();
              setIsOffline(true);
            });
  }, []);
  
  useEffect(() => {
    const handleVisibilityChange = async () => {
      try {
        if (document.visibilityState === 'visible') {
          if (connectionRef.current) {
            
            // Define a retry limit
            const maxRetries = 5; // Limit the retries to 5 times
            let retryCount = 0;
        
            async function tryInvoke() {
              try {
                await connectionRef.current.invoke('VisibilityChanged', 'visible', sessionStorage.getItem('userId'));
        
                console.log("PMF: hanldeVisibilityChangedVisible Invoked");
              } catch (error) {
                console.error('Error sending message:', error);
                
                // Increment retry count
                retryCount += 1;
        
                // Check if the retry limit is exceeded
                if (retryCount < maxRetries) {
                  console.log(`Retrying (${retryCount}/${maxRetries})...`);
                  
                  // Retry after a short delay (e.g., 2 seconds)
                  setTimeout(() => {
                    tryInvoke(); 
                  }, 2000);
                } else {
                  console.error(`Failed to send message after ${maxRetries} attempts.`);
                }
              }
            }
        
            tryInvoke();
          }
        } else {
          if (connectionRef.current) {
            // Define a retry limit
            const maxRetries = 5; // Limit the retries to 5 times
            let retryCount = 0;
            async function tryInvoke() {
              try {
                await connectionRef.current.invoke('VisibilityChanged', 'hidden',sessionStorage.getItem('userId'));
                console.log("PMF: handleVisiblitChangedHidden Invoked");
              } catch (error) {
                console.error('Error sending message:', error);
                retryCount += 1;
                if (retryCount < maxRetries) {
                  console.log(`Retrying (${retryCount}/${maxRetries})...`);
                  
                  setTimeout(() => {
                    tryInvoke(); 
                  }, 2000);
                } else {
                  console.error(`Failed to send message after ${maxRetries} attempts.`);
                }
              }
            }
            tryInvoke();
          }
        }
      } catch (error) {
        console.error('Error during visibility change:', error);
        //window.location.reload();
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchMissedUpdates]);

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
useEffect(() => {
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
        setConversations(data);  // Update Conversation data state
        console.log("SelectedConversation Convfetch: ",selectedConversation); 
      } else {
        let errorMessage = 'An error occurred';
        if (response.status === 401) {
          errorMessage = 'Unauthorized';
        } else if (!response.ok) {
          errorMessage = 'Connection problem ';
        }
        showToast(errorMessage);
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      showToast("Connection Refused");
    }
  };
  
  fetchConvData(); // Call fetchConvData function when component mounts

}, [showToast]);

/** Fetching Conversation End */
const handleOffline = useCallback(async () => {
  //setIsOffline(true);
  console.log("OFFLINE stop");
}, []);

const handleOnline = useCallback(async () => {
  //window.location.reload();
}, []);

  useEffect(() => {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [handleOffline,handleOnline]);

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
  let storedId = sessionStorage.getItem('userId');
  navigate(`/`);
    sessionStorage.clear();

    if (connectionRef.current) {
       // Define a retry limit
       const maxRetries = 5; // Limit the retries to 5 times
       let retryCount = 0;
       async function tryInvoke() {
         try {
          await connectionRef.current.invoke('UserLoggingOutTask',storedId);
          console.log("PMF: handleUserLogginOutTask Invoked");
         } catch (error) {
           console.error('Error sending message:', error);
           retryCount += 1;
           if (retryCount < maxRetries) {
             console.log(`Retrying (${retryCount}/${maxRetries})...`);
             
             setTimeout(() => {
               tryInvoke(); 
             }, 2000);
           } else {
             console.error(`Failed to send message after ${maxRetries} attempts.`);
           }
         }
       }
       tryInvoke();
      console.log("Invoked Log out");
      //connection.stop().then(() => console.log('Disconnected due to LOGOUT'));
    }
    

};
const handleMessage = useCallback(async (e) =>{
  if (!isLoadingMessage){
  setSendMessage(e.target.value);
  //handleTyping(true);
  if (connectionRef.current && selectedRecpientId!== null) {
    await connectionRef.current.invoke('TypingIndicator',selectedRecpientId,true);
  }
  
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout( async () => {
        //handleTyping(false);
        if (connectionRef.current && selectedRecpientId !== null) {
          await connectionRef.current.invoke('TypingIndicator',selectedRecpientId,false);
        } 
      }, 1000); // Adjust the timeout duration as needed
}

},[selectedRecpientId,isLoadingMessage]);
const insertMessage = (newMessage) => {
  setMessages(prevMessages => {
    const updatedMessages = [...prevMessages, newMessage]; // Add the new message to the existing array

    // Sort the updated messages by timeStamp
    return updatedMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
  });
};
const handleSendMessage = async (e) => {
  setIsLoadingMessage(true);
  //setVarOnce(true);
  try {
    const conversationIdDima = selectedConversationRef.current;
    const messagesResponse1 = await fetch('http://localhost:5206/api/Message/SendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      },  
      body: JSON.stringify({
        content: sendMessage, 
        recpientId: selectedRecpientId,
        messageType: "text",
        isAudio: false,
        isImage: false,
        conversationId: conversationIdDima,
        reply: replyMessageId
      })  
    });
    if (messagesResponse1.ok) {
        const data = await messagesResponse1.json();
        // Project "Make Fast"
        // Define a retry limit
        const maxRetries = 5; // Limit the retries to 5 times
        let retryCount = 0;
        async function tryInvoke() {
        try {
          await connectionRef.current.invoke('HandleSendMessageTask',data.recpientId,data);
          console.log("PMF: handleSendMessageTask Invoked");
        } catch (error) {
          console.error('Error sending message:', error);
          retryCount += 1;
          if (retryCount < maxRetries) {
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            
            setTimeout(() => {
              tryInvoke(); 
            }, 2000);
          } else {
            console.error(`Failed to send message after ${maxRetries} attempts.`);
          }
        }
        }
        tryInvoke();
        
        // SEtting only Coversation state here
        if (selectedConversationRef.current === 0) { 
          setConversations(prevConversations => {
            // Create a new array that includes the previous conversations and the new one
            
            const updatedConversations12 = [
              ...prevConversations,
              {
                convId: data.convId,
                message: sendMessage,
                updatedTime: data.timeStamp,
                messageId: data.id,
                userId: selectedRecpientId,
                userName: selectedName,
                lastName: selectedLastName,
                bio: selectedBio,
                email:selectedEmail,
                notificationCount: 0,
                isAudio: false,
                isImage: false,
                profilePicConv:selectedProfilePic,
                status:selectedOnlineStatus,
                lastSeen: selectedLastSeen,
                seen:true,
                messageSender:Number(sessionStorage.getItem('userId')),
                deleted: false  
              }
            ];
          
            // Sort the updated conversations array by updatedTime
            updatedConversations12.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
          
            // Return the sorted array to update the state
            return updatedConversations12;
          });
          selectedConversationRef.current = data.convId;
          setSelectedConversation(data.convId);
          
        }else{
          setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conversation => {
            
            if (conversation.convId === selectedConversationRef.current) {
              
              return { ...conversation, message: sendMessage,notificationCount: 0, updatedTime:data.timeStamp ,messageId: data.id,isAudio:false,isImage:false,messageSender:Number(sessionStorage.getItem('userId')),seen:true}; 
            }
            return conversation; 
          });
      
          // Sort the updated conversations by updatedTime
          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        });}
        // setting messgae State
        const newMessage = {
          content: data.content,
          convId: data.convId,
          deleted: data.deleted,
          id: data.id,
          messageType: data.messageType,
          recpientId: data.recpientId,
          senderId: data.senderId,
          status:data.status,
          timeStamp: data.timeStamp,
          new:true,
          reply: data.reply
        };
        
        insertMessage(newMessage);
        const ParsedMessage = JSON.parse(sessionStorage.getItem(`${data.convId}`));
        if (ParsedMessage!== null) {
        ParsedMessage.push(newMessage);
        sessionStorage.setItem(`${selectedConversationRef.current}`,JSON.stringify(ParsedMessage))
        }
        setIsLoadingMessage(false); 
        setSendMessage('');
        setReplyMessage(null);
        setReplyMessageId(0);
    } else {
      setIsLoadingMessage(false);
      let errorMessage = 'An error occurred';
        if (messagesResponse1.status === 401) {
          errorMessage = 'Unauthorized else';
        } else if (!messagesResponse1.ok) {
          errorMessage = 'Connection problem else';
        }
        showToast(errorMessage);
      
      throw new Error('Failed to fetch messages');
    }
  } catch (error) {
    setIsLoadingMessage(false);
    showToast('Connection Refused');
  }
};
const handleReplyMessage = (messageId,messageContent,messageType) => {
  setEditMessageModalId(0);
  setEditMessageModal(null);
  setSendMessage('');
  setReplyMessageId(messageId);
  console.log("Reply Message,",messageContent);
  setReplyMessage(messageContent);
};
const clearReplyMessage = () => {
  setReplyMessageId(0);
  setReplyMessage(null);
};
const clerEditMessageModal = () =>{
  setEditMessageModalId(0);
  setEditMessageModal(null);
  setSendMessage('');
};
const handleConversationClick = async (convId,recpientId,Name,LastName,onlineStatus,lastSeen,bio,email,profilePicConv,deletedPara) => {
  setIsLoading(true);
  setForSearchUser(false);
  setMessages([]);
  setSelectedConversation(convId); // Set the selected conversation 
  setSelectedRecpientId(recpientId);
  setSelectedName(Name);
  setSelectedLastName(LastName);
  setSelectedOnlineStatus(onlineStatus);
  setSelectedLastSeen(lastSeen);
  setSelectedBio(bio);
  setSelectedEmail(email);
  setSelectedProfilePic(profilePicConv);
  setSelectedDeleted(deletedPara);
  // clear reply and edit 
  setEditMessageModalId(0);
  setEditMessageModal(null);
  setSendMessage('');
  setReplyMessageId(0);
  setReplyMessage(null);


  
  const storedMessages = sessionStorage.getItem(`${convId}`);
  if (storedMessages !== null) {
    const rMd = JSON.parse(storedMessages);
    setIsLoading(false);
    setMessages(rMd);
    setConversations(prevConversations =>{ 
      const updatedConversations = prevConversations.map(conversation => {
        if (conversation.convId === convId) { 
          if (conversation.notificationCount !== 0){
            zeroNotificationCID(convId);
            console.log("About to call zero notification for a conversation click");
            // Define a retry limit
            const maxRetries = 5; // Limit the retries to 5 times
            let retryCount = 0;
            async function tryInvoke() {
              try {
                await connectionRef.current.invoke('HanldeSeenUnseenTask',conversation.userId,0,conversation.convId);
                  console.log("PMF: hanldeSeenUnseen Invoked");
              } catch (error) {
                console.error('Error sending message:', error);
                retryCount += 1;
                if (retryCount < maxRetries) {
                  console.log(`Retrying (${retryCount}/${maxRetries})...`);
                  
                  setTimeout(() => {
                    tryInvoke(); 
                  }, 2000);
                } else {
                  console.error(`Failed to send message after ${maxRetries} attempts.`);
                }
              }
            }
            tryInvoke();
          }
          // Update the message and timeStamp for the matching conversation
          return { ...conversation, notificationCount: 0};
        } 
        return conversation;
      });
  
      // Sort the updated conversations by updatedTime
      return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
  }); 
   

    return;
  }else{
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
        setIsLoading(false);
        setMessages(messagesData);
        
        setConversations(prevConversations =>{ 
          const updatedConversations = prevConversations.map(conversation => {
            if (conversation.convId === convId) { 
              if (conversation.notificationCount !== 0){
                zeroNotificationCID(convId);
                console.log("About to call zero notification for a conversation click");
                // Define a retry limit
                const maxRetries = 5; // Limit the retries to 5 times
                let retryCount = 0;
                async function tryInvoke() {
                  try {
                    await connectionRef.current.invoke('HanldeSeenUnseenTask',conversation.userId,0,conversation.convId);
                      console.log("PMF: hanldeSeenUnseen Invoked");
                  } catch (error) {
                    console.error('Error sending message:', error);
                    retryCount += 1;
                    if (retryCount < maxRetries) {
                      console.log(`Retrying (${retryCount}/${maxRetries})...`);
                      
                      setTimeout(() => {
                        tryInvoke(); 
                      }, 2000);
                    } else {
                      console.error(`Failed to send message after ${maxRetries} attempts.`);
                    }
                  }
                }
                tryInvoke();
              }
              
              // Update the message and timeStamp for the matching conversation
              return { ...conversation, notificationCount: 0};
            } 
            return conversation;
          });
      
          // Sort the updated conversations by updatedTime
          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
      }); 
      
      } else {
        //setIsLoading(false);
        let errorMessage = 'An error occurred';
          if (messagesResponse.status === 401) {
            errorMessage = 'Unauthorized';
          } else if (!messagesResponse.ok) {
            errorMessage = 'Connection problem';
          }
          showToast(errorMessage);
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      showToast('Connection Refused');
    }
}
};
const handleNewUserClick =  (RecpientId,Name,LastName,email,onlineStatus,lastSeen,bio,profilePicSearch)=>{ 
  setSearchResultUser([]);
  setSearchQueryUser('');
   // Checking if there is already a Conversation
  const existingConversation = conversations.find( 
    conversation => conversation.userId === RecpientId
  );
  
  if (existingConversation !== undefined) {
    // There is a previous Conversation
    handleConversationClick(existingConversation.convId, existingConversation.userId, existingConversation.userName, existingConversation.lastName,existingConversation.onlineStatus,existingConversation.lastSeen,existingConversation.bio,existingConversation.email,existingConversation.profilePicSearch,existingConversation.deleted);
  } else {
    // No Previous Conversation exsist (New Conv)
  setMessages([]);
  setSelectedRecpientId(RecpientId);
  setSelectedName(Name);
  setSelectedLastName(LastName);
  setSelectedOnlineStatus(onlineStatus);
  setSelectedLastSeen(lastSeen);
  setSelectedBio(bio);
  setSelectedEmail(email);
  setSelectedProfilePic(profilePicSearch);
  // selectedConversation set to zero
  setSelectedConversation(0);
  setForSearchUser(true); 
  // clear reply and edit 
  setEditMessageModalId(0);
  setEditMessageModal(null);
  setSendMessage('');
  setReplyMessageId(0);
  setReplyMessage(null);
  console.log("SelectedConversation:NewUser ",selectedConversation); 
  } 


};
const handleDeleteMessage = async (messageId,recpient,convId) => {
  setIsDeletingMessage(true);
  setIsDeletingMessageId(messageId);
  try {
    const response = await fetch(`http://localhost:5206/api/Message/DeleteMessage?deleteMessage=${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      // Project "Make Fast"
      // Define a retry limit
      const maxRetries = 5; // Limit the retries to 5 times
      let retryCount = 0;
      async function tryInvoke() {
        try {
          await connectionRef.current.invoke('HandleDeleteMessageTask',recpient,messageId,convId);
        } catch (error) {
          console.error('Error sending message:', error);
          retryCount += 1;
          if (retryCount < maxRetries) {
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            
            setTimeout(() => {
              tryInvoke(); 
            }, 2000);
          } else {
            console.error(`Failed to send message after ${maxRetries} attempts.`);
          }
        }
      }
      tryInvoke();
      console.log("PMF: handleDeleteMessageTask Invoked");
      if (messages.at(-2)) {
        setConversations(prevConversations => {
                      
          const updatedConversations = prevConversations.map(conversation => {
            if (conversation.convId === selectedConversationRef.current && conversation.messageId === messageId) {
              let refinedContent = messages.at(-2).content;
              let refinedAudioStatus = false;
              let refinedImageStatus = false;
              if (messages.at(-2).isAudio === true){
                refinedContent = 'Voice Message';
                refinedAudioStatus=true;
           }
           if (messages.at(-2).isImage === true){
               refinedContent = 'Photo';
               refinedImageStatus=true;
           }
              return { ...conversation, message: refinedContent, updatedTime:messages.at(-2).timeStamp,messageId:messages.at(-2).id,isAudio:refinedAudioStatus,isImage:refinedImageStatus};
            }
            return conversation;
          });
      
          // Sort the updated conversations by updatedTime
          return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
        });
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
      }else{
      setMessages([]);
      setConversations(prevConversations => {

        const updatedConversations1 = prevConversations
          .filter(conversation => conversation.convId !== selectedConversation) // Exclude the conversation with the specified convId
          .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
      return updatedConversations1;
      });
        setSelectedConversation(null);
        setForSearchUser(false);
        setSelectedRecpientId(null);
       
      
        sessionStorage.removeItem(selectedConversation);  
      }    
      
      
     setIsDeletingMessage(false); 
     setIsDeletingMessageId(null);
   
    } else {
      setIsDeletingMessage(false);
      setIsDeletingMessageId(null);
  
      let errorMessage = 'An error occurred';
        if (response.status === 401) {
          errorMessage = 'Unauthorized';
        } else if (!response.ok) {
          errorMessage = 'Connection problem';
        }
        showToast(errorMessage);
      
      throw new Error('Failed to delete message');
      
    }
  } catch (error) {
    setIsDeletingMessage(false);
    setIsDeletingMessageId(null);
    showToast('Connection Refused');
  }
};
const handleDeleteConversation = async (convIdPara,otherUserId) => {
  setIsDeletingConv(true);
  setIsDeletingConvId(convIdPara);
  try {
    const response = await fetch('http://localhost:5206/api/Message/DeleteConversation', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      },  
      body: JSON.stringify({
        convId: convIdPara, 
        otherId: otherUserId,
        ownId: Number(sessionStorage.getItem('userId'))
      })  
    });
    if (response.ok) {

      setIsDeletingConv(false);
      setIsDeletingConvId(null);

      if (selectedConversationRef.current === convIdPara){
        //console.log("Delete Conversation: Convid = selectedconv, sc = null, fsu=false, mess=[]");
        setSelectedConversation(null);
        //setForSearchUser(false);
        setSelectedRecpientId(null);
        setMessages([]);
        setSelectedName(null);
        setSelectedLastName(null);
        setSelectedOnlineStatus(null);
        setSelectedLastSeen(null);
        setSelectedBio(null);
        setSelectedEmail(null);
        setSelectedProfilePic([]);
        }
        
        sessionStorage.removeItem(convIdPara);
      setConversations(prevConversations =>{
        const updatedConversations1 = prevConversations
        .filter(conversation => conversation.convId !== convIdPara) // Exclude the conversation with the specified convId
        .sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)); // Sort the remaining conversations by updatedTime
        return updatedConversations1;
      });
      // Project "Make Fast"
      // Define a retry limit
      const maxRetries = 5; // Limit the retries to 5 times
      let retryCount = 0;
      async function tryInvoke() {
        try {
          await connectionRef.current.invoke('HandleDeleteConversationTask',otherUserId,convIdPara);
        } catch (error) {
          console.error('Error sending message:', error);
          retryCount += 1;
          if (retryCount < maxRetries) {
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            
            setTimeout(() => {
              tryInvoke(); 
            }, 2000);
          } else {
            console.error(`Failed to send message after ${maxRetries} attempts.`);
          }
        }
      }
      tryInvoke();
      console.log("PMF: handleDeleteConversation Task Invoked");
       
    } else {
      setIsDeletingConv(false);
      setIsDeletingConvId(null);
      let errorMessage = 'An error occurred';
        if (response.status === 401) {
          errorMessage = 'Unauthorized else';
        } else if (!response.ok) {
          errorMessage = 'Connection problem else';
        }
        showToast(errorMessage);
      
      
      throw new Error('Failed to delete message');
    }
  } catch (error) {
    setIsDeletingConv(false);
    setIsDeletingConvId(null);
  }
};
const zeroNotification = async (messageId) => {
  try {
    const response = await fetch(`http://localhost:5206/api/Message/zeroNotificationMID?messageId=${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      console.log("Setted message new to false");
      return;
    } else {
      throw new Error('Failed to zero Notification');
    }
  } catch (error) {
    console.error('Error zeroing Notification');
  }
};
const zeroNotificationCID = async (convIdPara) => {
  try {
    const response = await fetch(`http://localhost:5206/api/Message/zeroNotificationCID?convIdPara=${convIdPara}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      //console.log("Setted message new to false");
      return;
    } else {
      throw new Error('Failed to zero Notification');
    }
  } catch (error) {
    console.error('Error zeroing Notification');
  }
};
const handleEditSubmit = async () => {
  if (!sendMessage.trim()) {
   
    return;
  }
  setIsLoadingMessage(true);
  try {
    const response = await fetch(`http://localhost:5206/api/Message/EditMessage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      },
      body: JSON.stringify({ 
        content: sendMessage,
        MessageId: editMessageModalId 
      }) 
    });
    if (response.ok) {
      const updatedMessage = await response.json();
      // Project "Make Fast"
       // Define a retry limit
       const maxRetries = 5; // Limit the retries to 5 times
       let retryCount = 0;
       async function tryInvoke() {
         try {
          await connectionRef.current.invoke('HandleEditMessageTask',updatedMessage.recpientId,updatedMessage);
          console.log("PMF: handleEditMessage Invoked");
         } catch (error) {
           console.error('Error sending message:', error);
           retryCount += 1;
           if (retryCount < maxRetries) {
             console.log(`Retrying (${retryCount}/${maxRetries})...`);
             
             setTimeout(() => {
               tryInvoke(); 
             }, 2000);
           } else {
             console.error(`Failed to send message after ${maxRetries} attempts.`);
           }
         }
       }
       tryInvoke();

      setMessages(messages.map(message => message.id === editMessageModalId ? updatedMessage : message));
      setIsLoadingMessage(false);
      setEditMessageModalId(0);
      setEditMessageModal(null);
      setSendMessage('');
      setConversations(prevConversations => {
        
        const updatedConversations = prevConversations.map(conversation => {
          
          if (conversation.convId === selectedConversation && conversation.messageId === editMessageModalId) {
            
          
            return { ...conversation, message: sendMessage };
          }
          return conversation;
        });
    
        // Sort the updated conversations by updatedTime
        return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
      });
      const xy = JSON.parse(sessionStorage.getItem(`${selectedConversation}`));
      if (xy!== null) {
        for (let index = 0; index < xy.length; index++) {
          if ( xy[index].id === editMessageModalId) {
              xy[index].content = sendMessage;
              xy[index].edited = true;
              break; 
          } 
      }
      sessionStorage.setItem(`${selectedConversation}`,JSON.stringify(xy))
      }
      
    } else {
      setIsLoadingMessage(false);
      let errorMessage = 'An error occurred';
      if (response.status === 401) {
        errorMessage = 'Unauthorized';
      } else if (!response.ok) {
        errorMessage = 'Connection problem';
      }
      showToast(errorMessage);
      throw new Error('Failed to edit message');
    }
  } catch (error) {
    setIsLoadingMessage(false);
      
    showToast('Connection Refused');
  }
};
const handleEditMessage = (messageId,messageContent) => {
  setReplyMessageId(0);
  setReplyMessage(null);
  setEditMessageModalId(messageId);
  setEditMessageModal(messageContent);
  setSendMessage(messageContent);
};
const deleteAccount = () => {
  if (window.confirm('Are you sure you want to delete this item?')) {
      setIsLoadingModal(true); // Set loading state to true before making the API call
      fetch('http://localhost:5206/api/Users/DeleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
        } 
      }).then(response => {
        if (response.ok) {

          setIsLoadingModal(false);
          setgoodMessage('Deleted');
          clearErrorMessageAfterDelay();
          setTimeout(() => {
            //handleLogOut();
            navigate(`/`); // Redirect the user after displaying the error message
          }, 1500); // Redirect after 3 seconds (adjust the delay as needed)
          // Project "Make Fast"
          // Define a retry limit
          const maxRetries = 5; // Limit the retries to 5 times
          let retryCount = 0;
          async function tryInvoke() {
          try {
            await connectionRef.current.invoke('HandleDeletedAccount',sessionStorage.getItem('userId'));
            console.log("PMF: HandleDeletedAccount Invoked");
          } catch (error) {
            console.error('Error sending message:', error);
            retryCount += 1;
            if (retryCount < maxRetries) {
              console.log(`Retrying (${retryCount}/${maxRetries})...`);
              
              setTimeout(() => {
                tryInvoke(); 
              }, 2000);
            } else {
              console.error(`Failed to send message after ${maxRetries} attempts.`);
            }
          }
          }
          tryInvoke();
          handleLogOut();
        }else if (response.status === 10) { 
          // Handle bad request
          setIsLoadingModal(false);
          setErrorMessage('Invalid Token'); 
          clearErrorMessageAfterDelay();
          setTimeout(() => {
            navigate(`/`); // Redirect the user after displaying the error message
          }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
        }else {
          setIsLoadingModal(false);
          setErrorMessage('Connection Problem. Please try again.Backend');
          clearErrorMessageAfterDelay(); // Set error message for the user
        }
      }).catch(error => {
        setIsLoadingModal(false);
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
  if (e.target.value.length <= 14) {
    setFirstName(e.target.value);
  }
};
const handleLastNameChange = (e) => {
  if (e.target.value.length <= 14) {
      setLastName(e.target.value);
    }
};
const handleBioChange = (e) => { 
  if (e.target.value.length <= 70) {
    setBio(e.target.value);
  }
}
const handleSubmitProfile = (e) => {
  e.preventDefault();
  setIsLoadingModal(true); // Set loading state to true before making the API call
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
      setIsLoadingModal(false);
      sessionStorage.setItem('Name', firstName);
      sessionStorage.setItem('LastName', lastName);
      sessionStorage.setItem('Bio', bio);
      
      let userProfile = {
        userId: sessionStorage.getItem('userId'),
        firstname: firstName,
        lastname: lastName,
        bio: bio,
        profilePic: sessionStorage.getItem('ProfilePic')
    };
    
      // Convert the object to a JSON string
      let userProfileString = JSON.stringify(userProfile);
    
      // Define a retry limit
      const maxRetries = 5; // Limit the retries to 5 times
      let retryCount = 0;
      async function tryInvoke() {
        try {
          await connectionRef.current.invoke('HandleUserProfileTask', userProfileString);
        console.log("PMF: hanldeUserProfile Invoked");
        } catch (error) {
          console.error('Error sending message:', error);
          retryCount += 1;
          if (retryCount < maxRetries) {
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            
            setTimeout(() => {
              tryInvoke(); 
            }, 2000);
          } else {
            console.error(`Failed to send message after ${maxRetries} attempts.`);
          }
        }
      }
      tryInvoke();

      console.log("PMF: handleUserProfileTask Invoked");

      setgoodMessage('Successfully Updated');  
      clearErrorMessageAfterDelay();  
  
    }else if (response.status === 15) { 
      // Handle bad request
      setIsLoadingModal(false);
      setErrorMessage('Token Expired'); 
      clearErrorMessageAfterDelay(); 
      handleLogOut();
      
    }else if (response.status === 10) {
      // Handle bad request
      setIsLoadingModal(false);
      setErrorMessage('Internal Server Error,Try again');
      clearErrorMessageAfterDelay(); // Set error message for the user
      
    }else if( response.status === 401){
      setIsLoadingModal(false);
      setErrorMessage('Invalid token');
      clearErrorMessageAfterDelay(); // Set error message for the user
      handleLogOut();
    }else if( response.status === 30){
      setIsLoadingModal(false);
      setErrorMessage('DataBase connection problem');
      clearErrorMessageAfterDelay(); // Set error message for the user
      
    } else {
      setIsLoadingModal(false);
      setErrorMessage('Connection Problem. Please try again.');
      clearErrorMessageAfterDelay(); // Set error message for the user
      }
  }).catch(error => {
    setIsLoadingModal(false);
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
setIsLoadingModal(true); // Set loading state to true before making the API call
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
    setIsLoadingModal(false);
    setgoodMessage('Successfully updated Password');
    setNewPassword('');
    setOldPassword('');
    clearErrorMessageAfterDelay();
    
  }else if (response.status === 10) { 
    // Handle bad request
    setIsLoadingModal(false);
    setErrorMessage('Invalid Token'); 
    clearErrorMessageAfterDelay();
    handleLogOut();
  }else if (response.status === 20) {
    // Handle bad request
    setIsLoadingModal(false);
    setErrorMessage('Wrong Password');
    clearErrorMessageAfterDelay(); // Set error message for the user
    
  } else {
    setIsLoadingModal(false);
    setErrorMessage('Connection Problem. Please try again.');
    clearErrorMessageAfterDelay(); // Set error message for the user
    }
}).catch(error => {
  setIsLoadingModal(false);
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
  
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes; // adding leading zero if needed
    return `${hours}:${minutesStr}${ampm}`;
  };
  const timeString = formatTime(date);

  if (isToday) {
    // If the date is today, show time in 12-hour format
    return timeString;
  } else if (diffDays <= 7) {
    // If the date is within the past 7 days, show the day of the week and time
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${daysOfWeek[date.getDay()]} at ${timeString}`;
  } else {
    // If the date is older than 7 days, show date, month, and time
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month}/${day} at ${timeString}`;
  }
}
function formatDateTimeConv(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = (date.getDate() === now.getDate() &&
                   date.getMonth() === now.getMonth() &&
                   date.getFullYear() === now.getFullYear());

  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffDays = Math.round(Math.abs((now - date) / oneDay));
  
  const formatTimeConv = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes; // adding leading zero if needed
    return `${hours}:${minutesStr}${ampm}`;
  };
  const timeString = formatTimeConv(date);

  if (isToday) {
    // If the date is today, show time in 12-hour format
    return timeString;
  } else if (diffDays <= 7) {
    // If the date is within the past 7 days, show the day of the week and time
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${daysOfWeek[date.getDay()]}`;
  } else {
    // If the date is older than 7 days, show date, month, and time
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month}/${day}`;
  }
}
// FUNCTION INTEGRATION START
const isAudioDownloaded = (messageId) => {
  return localStorage.getItem(`audioBlob_${messageId}`) !== null;
};
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

    // Store the media stream to stop tracks later
    recorderRef.current.stream = stream;

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
const handleStopRecording = () => {
recorderRef.current.stopRecording(async () => {
  const blob = recorderRef.current.getBlob();
  const audioURL = URL.createObjectURL(blob);
  const messageId = Date.now();
  const base64 = await blobToBase64(blob);
  // Add a temporary message with a loading icon
  const newMessageObj = { id: messageId, content: audioURL, timeStamp: new Date(), isAudio: true, isUploading: true,senderId:Number(sessionStorage.getItem('userId')) };
  setMessages(prevMessages => [...prevMessages, newMessageObj]);
  setUploadingMessageId(messageId);
  setIsUploading(true);
  setIsLoadingMessage(true);
  //setVarOnce(true);
  // Upload to Firebase Storage
  const storageRef = ref(storage, `FonkaGram/Recordings/${messageId}.webm`);
  try {
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    try {
      const conversationIdDima = selectedConversationRef.current === null ? 0 : selectedConversationRef.current;
      //console.log("ConverstaionIdDima:", conversationIdDima);
    
      const messagesResponse1 = await fetch('http://localhost:5206/api/Message/SendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
        },  
          body: JSON.stringify({
          content: downloadURL, 
          recpientId: selectedRecpientId,
          messageType: "text",
          isAudio: true,
          isImage: false,
          conversationId: conversationIdDima,
          reply: replyMessageId
        })  
      });
      if (messagesResponse1.ok) {
        const data = await messagesResponse1.json();
           setIsLoadingMessage(false);
           // Define a retry limit
            const maxRetries = 5; // Limit the retries to 5 times
            let retryCount = 0;
            async function tryInvoke() {
              try {
                await connectionRef.current.invoke('HandleSendMessageTask',data.recpientId,data);
                console.log("PMF: handleSendMessageTask Invoked");
              } catch (error) {
                console.error('Error sending message:', error);
                retryCount += 1;
                if (retryCount < maxRetries) {
                  console.log(`Retrying (${retryCount}/${maxRetries})...`);
                  
                  setTimeout(() => {
                    tryInvoke(); 
                  }, 2000);
                } else {
                  console.error(`Failed to send message after ${maxRetries} attempts.`);
                }
              }
            }
            tryInvoke();

            if (selectedConversationRef.current === 0) { 
              setConversations(prevConversations => {
                // Create a new array that includes the previous conversations and the new one
                const updatedConversations12 = [
                  ...prevConversations,
                  {
                    convId: data.convId,
                    message: 'Voice Message',
                    updatedTime: data.timeStamp,
                    messageId: data.id,
                    userId: selectedRecpientId,
                    userName: selectedName,
                    lastName: selectedLastName,
                    lastSeen: selectedLastSeen,
                    bio: selectedBio,
                    email:selectedEmail,
                    notificationCount: 0,
                    isAudio: false,
                    isImage: false,
                    profilePicConv:selectedProfilePic,
                    status:selectedOnlineStatus,
                    seen:true,
                    messageSender:Number(sessionStorage.getItem('userId')),
                    deleted: false
                  }
                ];
              
                // Sort the updated conversations array by updatedTime
                updatedConversations12.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
              
                // Return the sorted array to update the state
                return updatedConversations12;
              });
              selectedConversationRef.current = data.convId;
              setSelectedConversation(data.convId);
            
            }else{
              setConversations(prevConversations => {
              const updatedConversations = prevConversations.map(conversation => {
                
                if (conversation.convId === selectedConversation) {
                  
                  return { ...conversation, message: 'Voice Message',notificationCount: 0, updatedTime:data.timeStamp ,messageId: data.id,isAudio:true,isImage:false,messageSender:Number(sessionStorage.getItem('userId')),seen:true}; 
                }
                return conversation; 
              });
          
              // Sort the updated conversations by updatedTime
              return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
            });}
            
            const newMessage = {
              content: audioURL, // audio URL
              convId: data.convId,
              deleted: data.deleted,
              id: data.id,
              messageType: data.messageType,
              recpientId: data.recpientId,
              senderId: data.senderId,
              status:data.status,
              timeStamp: data.timeStamp,
              isAudio: true,
              isImage: false,
              new:true
            };
       
        
        //insertMessage(newMessage);
        setMessages(prevMessages =>prevMessages.map(msg=>{
          if (msg.id === messageId){
            return {...msg,
            content: audioURL, 
            convId: data.convId,
            deleted: data.deleted,
            id: data.id,
            messageType: data.messageType,
            recpientId: data.recpientId,
            senderId: data.senderId,
            status:data.status,
            timeStamp: data.timeStamp,
            isAudio: true,
            isImage: false,
            new : true
          };
          } return msg;
        }));
        localStorage.setItem(`audioBlob_${data.id}`, base64);
  
        setIsUploading(false);
        setUploadingMessageId(null);
  
        const ParsedMessage = JSON.parse(sessionStorage.getItem(`${selectedConversation}`));
        if (ParsedMessage!== null) {
        ParsedMessage.push(newMessage);
        sessionStorage.setItem(`${selectedConversation}`,JSON.stringify(ParsedMessage))
        }
         
        setSendMessage('');
      } else {
        setIsUploading(false);
        setIsLoadingMessage(false);
        setUploadingMessageId(null);
  
      let errorMessage = 'An error occurred';
        if (messagesResponse1.status === 401) {
          errorMessage = 'Unauthorized else';
        } else if (!messagesResponse1.ok) {
          errorMessage = 'Connection problem else';
        }
        showToast(errorMessage);
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
        throw new Error('Failed to fetch messages');

      }
    } catch (error) {
    setIsUploading(false);
    setUploadingMessageId(null);
  
    setIsLoadingMessage(false);
    showToast('Connection Refused');
      // Remove the message if upload fails
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    
    
    }

   
  } catch (error) {
    console.error('Error uploading audio:', error);
    // Remove the message if upload fails
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    setIsUploading(false);
    setUploadingMessageId(null);
  
    setIsLoadingMessage(false);
    showToast('Connection Refused');
  }

});

setIsRecording(false);
clearInterval(recordingIntervalRef.current);
// Stop all tracks of the media stream to release the microphone
  // Stop all tracks of the media stream to release the microphone
  if (recorderRef.current.stream) {
    recorderRef.current.stream.getTracks().forEach(track => track.stop());
  }
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
  //handlePlayAudio(URL.createObjectURL(blob), messageId);
} catch (error) {
  console.error('Error downloading audio:', error);
  showToast('Error downloading audio');
  setIsDownloading(false);
}
};
const handleConversationChange = (conversationId) => {
setSelectedConversation(conversationId);
stopCurrentAudio();
setContextMenu(null);
setContextMenu2(null);
}; 
useEffect(() => {
  const currentWaveformRefs = waveformRefs.current;

  messages.forEach(message => {
    if (message.isAudio && !currentWaveformRefs[message.id]) {
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

        currentWaveformRefs[message.id] = waveform;
      }
    }
  });

  return () => {
    // Cleanup WaveSurfer instances on unmount
    Object.values(currentWaveformRefs).forEach(waveform => waveform.destroy());
  };
}, [messages]);
// handleImageClick for Pictures
const handleImageClick = (src) => {
  setFullImagePicture(src);
};
const closeFullImagePic = () =>{
   setFullImagePicture(null);
   setFullImageOTHER(null);
   setIsDropdownOpen(false);
};
const handleImageClickOwnProfile = (index) =>{
  setFullscreenImage(profilePicturesArray[index]);
  setCurrentImageIndex(index);
  setIsDropdownOpen(false); // Close dropdown when image is clicked
};
const handleOtherProfilePic = (index)=>{
  setFullImageOTHER(selectedProfilePic[index]);
  console.log(selectedProfilePic[index]);
  setCurrentImageIndex(index);
  setIsDropdownOpen(false);
};
const closeFullscreenImage = () => {
  setFullscreenImage(null);
  setCurrentImageIndex(0);
  setIsDropdownOpen(false); // Close dropdown when fullscreen mode is closed
};
const handleNextImage = () => {
  setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profilePicturesArray.length);
};
const handlePrevImage = () => {
  setCurrentImageIndex((prevIndex) => (prevIndex - 1 + profilePicturesArray.length) % profilePicturesArray.length);
};
const handleNextImageOTHER = () => {
  setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProfilePic.length);
  
};

const handlePrevImageOTHER = () => {
  setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProfilePic.length) % selectedProfilePic.length);
  
};

const hanldeSaveImage =()=>{
const picId = Date.now().toString();
    
   if (fullImageOTHER) {
    // Fetch the image as a blob from the URL
    fetch(fullImageOTHER)
      .then(response => response.blob())
      .then(blob => {
        // Create a URL for the Blob object
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Fonkagram${picId}.jpg`; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Clean up after the download
        document.body.removeChild(a);
      })
      .catch(err => {
        console.error('Error downloading image:', err);
      });
  } else {
  showToast('Image not available for download');
    //console.error('No image available to download.');
  }
};
const handleEditClick = (e) => {
  e.stopPropagation();
  setIsDropdownOpen(!isDropdownOpen);
};

const handleRemoveClick = async () => {
  setIsDeletingProfilePic(true);
  console.log("curr Index",currentImageIndex);
  console.log("currIndex Backend",profilePicturesArray.length - currentImageIndex -1);
  try {
    const messagesResponse1 = await fetch(`http://localhost:5206/api/UserProfile/DeleteProfilePic?urlId=${ profilePicturesArray.length - currentImageIndex -1 }`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (messagesResponse1.ok) {
    setIsDeletingProfilePic(false);
    const updatedProfilePictures = profilePicturesArray.filter((_, index) => index !== currentImageIndex);
    sessionStorage.setItem('ProfilePic', JSON.stringify(updatedProfilePictures));
    if (updatedProfilePictures.length === 0) {
      closeFullscreenImage();
    } else {
      const newIndex = currentImageIndex === updatedProfilePictures.length ? 0 : currentImageIndex;
      setCurrentImageIndex(newIndex);
      setFullscreenImage(updatedProfilePictures[newIndex]);
    }
    } else {
    setIsDeletingProfilePic(false);
    let errorMessage = 'An error occurred';
      if (messagesResponse1.status === 401) {
        errorMessage = 'Unauthorized else';
      } else if (!messagesResponse1.ok) {
        errorMessage = 'Connection problem';
      }
      showToast(errorMessage);
      throw new Error('Failed to fetch messages');

    }
  } catch (error) {
    setIsDeletingProfilePic(false);
    showToast('Connection Refused');
    
  
  }
};
const handleSetToMainClick = async () => {

  setIsDeletingProfilePic(true);
  try {
    const messagesResponse1 = await fetch(`http://localhost:5206/api/UserProfile/MainProfilePic?urlId=${ profilePicturesArray.length - currentImageIndex -1 }`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (messagesResponse1.ok) {
    setIsDeletingProfilePic(false);
    const mainImage = profilePicturesArray[currentImageIndex];
    const updatedProfilePictures = [mainImage, ...profilePicturesArray.filter((_, index) => index !== currentImageIndex)];
    sessionStorage.setItem('ProfilePic', JSON.stringify(updatedProfilePictures));
    setCurrentImageIndex(0);
    setFullscreenImage(mainImage);
    
    } else {
    setIsDeletingProfilePic(false);
    let errorMessage = 'An error occurred';
      if (messagesResponse1.status === 401) {
        errorMessage = 'Unauthorized else';
      } else if (!messagesResponse1.ok) {
        errorMessage = 'Connection problem';
      }
      showToast(errorMessage);
      throw new Error('Failed to fetch messages');

    }
  } catch (error) {
    setIsDeletingProfilePic(false);
    showToast('Connection Refused');
    
  
  }


  
};

useEffect(() => {
  if (fullscreenImage) {
    setFullscreenImage(profilePicturesArray[currentImageIndex]);
  }
  if (fullImageOTHER){
    setFullImageOTHER(selectedProfilePic[currentImageIndex]);
  }
}, [currentImageIndex,fullscreenImage,fullImageOTHER,selectedProfilePic,profilePicturesArray]);
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
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  
  if (file && !editProfileModal) {
    
    const messageId = Date.now().toString();
    const newMessageObj = { id: messageId, content: URL.createObjectURL(file), timeStamp: new Date().toLocaleString(), isImage: true, isUploading: true,senderId:Number(sessionStorage.getItem('userId')) };
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      setUploadingMessageId(messageId);
      setIsUploading(true);
    const storageRef = ref(storage, `FonkaGram/Images/${messageId}.${file.name.split('.').pop()}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    
    try {
      // Add a temporary message with a loading icon
      
      try {
      const conversationIdDima = selectedConversationRef.current === null ? 0 : selectedConversationRef.current;
      console.log("ConverstaionIdDima:", conversationIdDima);
    
      const messagesResponse1 = await fetch('http://localhost:5206/api/Message/SendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
        },  
          body: JSON.stringify({
          content: downloadURL, 
          recpientId: selectedRecpientId,
          messageType: "text",
          isAudio: false,
          isImage: true,
          conversationId: conversationIdDima,
          reply: replyMessageId
        })  
      });
      if (messagesResponse1.ok) {
        const data = await messagesResponse1.json();
           setIsLoadingMessage(false);
           // Define a retry limit
            const maxRetries = 5; // Limit the retries to 5 times
            let retryCount = 0;
            async function tryInvoke() {
              try {
                await connectionRef.current.invoke('HandleSendMessageTask',data.recpientId,data);
                console.log("PMF: handleSendMessageTask Invoked");
              } catch (error) {
                console.error('Error sending message:', error);
                retryCount += 1;
                if (retryCount < maxRetries) {
                  console.log(`Retrying (${retryCount}/${maxRetries})...`);
                  
                  setTimeout(() => {
                    tryInvoke(); 
                  }, 2000);
                } else {
                  console.error(`Failed to send message after ${maxRetries} attempts.`);
                }
              }
            }
            tryInvoke();
            if (selectedConversationRef.current === 0) { 
              setConversations(prevConversations => {
                // Create a new array that includes the previous conversations and the new one
                const updatedConversations12 = [
                  ...prevConversations,
                  {
                    convId: data.convId,
                      message: 'Photo',
                      updatedTime: data.timeStamp,
                      messageId: data.id,
                      userId: selectedRecpientId,
                      userName: selectedName,
                      lastName: selectedLastName,
                      bio: selectedBio,
                      email:selectedEmail,
                      notificationCount: 0,
                      isAudio: false,
                      isImage: true,
                      profilePicConv:selectedProfilePic,
                      status:selectedOnlineStatus,
                      lastSeen: selectedLastSeen,
                      seen:true,
                      messageSender:Number(sessionStorage.getItem('userId')),
                      deleted: false
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
                
                if (conversation.convId === selectedConversationRef.current) {
                  
                  return { ...conversation, message: 'Photo',notificationCount: 0, updatedTime:data.timeStamp ,messageId: data.id,isAudio:false,isImage:true,messageSender:Number(sessionStorage.getItem('userId')),seen:true}; 
                }
                return conversation; 
              });
          
              // Sort the updated conversations by updatedTime
              return updatedConversations.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime));
            });}
            
            const newMessage = {
              content: URL.createObjectURL(file), // audio URL
              convId: data.convId,
              deleted: data.deleted,
              id: data.id,
              messageType: data.messageType,
              recpientId: data.recpientId,
              senderId: data.senderId,
              status:data.status,
              timeStamp: data.timeStamp,
              isAudio: false,
              isImage: true,
              new : true
            };
       
        
        //insertMessage(newMessage);
        setMessages(prevMessages =>prevMessages.map(msg=>{
          if (msg.id === messageId){
            return {...msg,
            content:URL.createObjectURL(file), 
            convId: data.convId,
            deleted: data.deleted,
            id: data.id,
            messageType: data.messageType,
            recpientId: data.recpientId,
            senderId: data.senderId,
            status:data.status,
            timeStamp: data.timeStamp,
            isAudio: false,
            isImage: true,
            new: true
          };
          } return msg;
        }));
        setIsUploading(false);
        setUploadingMessageId(null);
  
        const ParsedMessage = JSON.parse(sessionStorage.getItem(`${selectedConversation}`));
        if (ParsedMessage!== null) {
        ParsedMessage.push(newMessage);
        sessionStorage.setItem(`${selectedConversation}`,JSON.stringify(ParsedMessage))
        }
         
        setSendMessage('');
      } else {
        setIsUploading(false);
        setIsLoadingMessage(false);
        setUploadingMessageId(null);
  
      let errorMessage = 'An error occurred';
        if (messagesResponse1.status === 401) {
          errorMessage = 'Unauthorized else';
        } else if (!messagesResponse1.ok) {
          errorMessage = 'Connection problem else';
        }
        showToast(errorMessage);
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
        throw new Error('Failed to fetch messages');

      }
    } catch (error) {
    setIsUploading(false);
    setUploadingMessageId(null);
  
    setIsLoadingMessage(false);
    showToast('Connection Refused');
      // Remove the message if upload fails
    //setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    
    
    }
      
      setIsUploading(false);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      // Remove the message if upload fails
      //setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      setIsUploading(false);
    }
  
  }
  if (file && editProfileModal){
    if (profilePicturesArray.length >16){
      showToast('Maximum Limit Reached');
      return;
    }
    setIsSettingNewPic(true);
    const profilePicId = Date.now().toString();
    const storageRef = ref(storage, `FonkaGram/Images/${profilePicId}.${file.name.split('.').pop()}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    try {
      const messagesResponse1 = await fetch('http://localhost:5206/api/UserProfile/AddProfilePic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
        },  
          body: JSON.stringify({
            url: downloadURL
        })  
      });
      if (messagesResponse1.ok) {

        const updatedProfilePictures = [downloadURL, ...profilePicturesArray];
        sessionStorage.setItem('ProfilePic', JSON.stringify(updatedProfilePictures));
        setIsSettingNewPic(false);
      } else {
        setIsSettingNewPic(false);
  
      let errorMessage = 'An error occurred';
        if (messagesResponse1.status === 401) {
          errorMessage = 'Unauthorized else';
        } else if (!messagesResponse1.ok) {
          errorMessage = 'Connection problem';
        }
        showToast(errorMessage);
        throw new Error('Failed to fetch messages');

      }
    } catch (error) {
      setIsSettingNewPic(false);
      showToast('Connection Refused WHAT IS IT');
    }    

  }

};
const openModal = (content) => {
if (content === 'EditProfile'){
    setModalContent(
        <div>Yeah Edit Profile</div>
    );
    setEditProfileModal(true);
}else if (content === 'ChangePassword'){
    setModalContent(
       <div>changePassword</div>
    );
    setChangePasswordModal(true);
}else if (content === 'DeleteAccount'){
    setModalContent(
      <div>DeleteAccount</div>
    );
    setDeleteAccountModal(true);
}else{
   console.log("Problem in settings display");
}
};
const closeModal = () => {
  setModalContent(null);
  setEditProfileModal(false);
  setChangePasswordModal(false);
  setDeleteAccountModal(false);
  setViewUserModal(false);
  setFirstName(sessionStorage.getItem('Name'));
  setLastName(sessionStorage.getItem('LastName'));
  setBio(sessionStorage.getItem('Bio'));
  
};
const handleOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
    setEditProfileModal(false);
    setChangePasswordModal(false);
    setDeleteAccountModal(false);
    setViewUserModal(false);
    setFirstName(sessionStorage.getItem('Name'));
  setLastName(sessionStorage.getItem('LastName'));
  setBio(sessionStorage.getItem('Bio'));
  }
};
const truncateText = (firstName, lastName, b) => {
  if ((firstName.length + lastName.length) <= 18) {
    if (b === 0) {
        return `${firstName}`;
    }
    return `${lastName}`;
    } else {
        if (firstName.length === 18) {
            if (b === 0) {
                return `${firstName}`;
            }
            return '';
        } else if (firstName.length > 18) {
            if (b === 0) {
                return `${firstName.substring(0, 15)}...`;
            }
            return '';
        } else {
            const lastNameAllowed = 18 - firstName.length - 3;
            if (b === 1) {
                return `${lastName.substring(0, lastNameAllowed)}...`;
            }
            return `${firstName}`;
        }
    } 
 
};
const truncateText101 = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
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
const openUserModal = () => {
  setModalContent(
    <div>user Info modal</div>
     );
  setViewUserModal(true);
};
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    //setNewMessage(prev => prev + '\n');
  } else if (e.key === 'Enter' && !e.ctrlKey) {
    e.preventDefault();
    if (editMessageModalId !== 0){
      handleEditSubmit();
    }else{
      handleSendMessage();
    }
    
  }
};
//useOutsideClick(emojiPickerRef,() => setShowEmojiPickerEDIT(false));
useOutsideClick(emojiPickerRef,() => setShowEmojiPicker(false));

const toggleDarkMode = async () => {
  let temp = isDarkMode;
  
  console.log("Before",temp);
  setIsDarkMode(!isDarkMode);
  console.log("After", !temp);
  
  sessionStorage.setItem('Dark', !temp);
  
  try {
    const response = await fetch(`http://localhost:5206/api/Users/LightDark?value=${!temp}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    });
    if (response.ok) {
      console.log("changed Apperance");
      return;
    } else {
      throw new Error('Failed to zero Notification');
    }
  } catch (error) {
    console.error('Error zeroing Notification');
  }
  
};
const handleResize = () => {
  setIsMobileView(window.innerWidth < 768);
};
const msgIdTomsgObj = (id) => {
  const replyMessage = messages.find(msg => msg.id === id);
    
  if (replyMessage.isAudio === true){
    return 'Voice Message';
  };
  if (replyMessage.isImage === true){  
    return 'Photo Message';
  };
  return replyMessage.content;
};

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

const handleRightClick = (e,messageId,type,chatType) => {
  e.preventDefault();
  e.stopPropagation(); 
  if (type === "text" && chatType === "end" ){
    setContextMenu2(null);
    setContextMenu({
      messageId,
      x: e.clientX,
      y: e.clientY,
    });
  } else if (type === "audio"){
    setContextMenu(null);
    setContextMenu2({
      messageId,
      x: e.clientX,
      y: e.clientY,
    });
  } else {
    setContextMenu(null);
    setContextMenu2({
      messageId,
      x: e.clientX,
      y: e.clientY,
    });
  }
};

const closeContextMenu = useCallback(() => {
  setContextMenu(null);
  setContextMenu2(null);
},[]);
const handleScroll = useCallback (() => {
  setContextMenu(null);
  setContextMenu2(null);
},[]);

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [handleScroll]);

    // FUCNTION INTEGRATION END

// For Settings code End

  return(
  <div className={`flex h-screen relative ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}  onClick={closeContextMenu}>
    <ToastContainer />
    {modalContent && (
        <div 
          className={`fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
          onClick={handleOverlayClick}
        > 
          <div  
          ref={modalRef}
            className={`p-4 rounded-lg shadow-lg relative ${isMobileView ? 'w-full h-full' : 'w-1/3'} flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
            onClick={(e) => e.stopPropagation()}
          >
          {editProfileModal && (
            <div className={`flex flex-col items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-2 overflow-hidden">
                { profilePicturesArray && profilePicturesArray.length > 0 ? (
                  <>
                  {isSettingNewPic === true ? (
                  <div
                    className="w-24 h-24 rounded-full bg-pink-500 mb-2 overflow-hidden  text-white flex items-center justify-center mr-3 text-lg font-bold">
                        {(sessionStorage.getItem('Name')).charAt(0)}
                     </div>
                     ):(
                  <img 
                  src={profilePicturesArray[0]} 
                  alt="Profile Pic" 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => handleImageClickOwnProfile(0)}
                  /> 
                  )}
                  </>
                ):(
                  <>
                  {isSettingNewPic === true ?(
                 <div
                  className="w-24 h-24 rounded-full bg-pink-500 mb-2 overflow-hidden  text-white flex items-center justify-center mr-3 text-lg font-bold">
                      <FontAwesomeIcon icon={faSpinner} spin />
                   </div>
                  ):(
                <div
                  className="w-24 h-24 rounded-full bg-pink-500 mb-2 overflow-hidden  text-white flex items-center justify-center mr-3 text-lg font-bold">
                      {(sessionStorage.getItem('Name')).charAt(0)}
                   </div>
                  )}
                  </>
                )} 

                </div>
                <input 
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
                <button 
                className={`btn btn-secondary ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`} 
                onClick={() => fileInputRef.current.click()}
                disabled={isSettingNewPic}
                >
                Set New Photo
                </button>
              </div>
            
            <form className={`w-full max-w-md  ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`} onSubmit={handleSubmitProfile}>
            <span className="text-gray-700 text-lg font-bold">Edit Profile</span> <br />
            <label>Name</label>
            <input
              className={`email-input ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
              type="text"
              placeholder="Name"
              required
              value={firstName}
              onChange={handleFirstNameChange}
              disabled={isLoadingModal}
              maxLength={14}
            />
            <label>Last Name</label>
            <input
              className={`email-input ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
              placeholder="LastName"
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              disabled={isLoadingModal}
              maxLength={14}
            />
            <label>Bio</label>
            <TextareaAutosize
              className={`email-input ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
              type="text"
              value={bio}
              onChange={handleBioChange}
              disabled={isLoadingModal}
              maxLength={70}
            />
            
            <div className="flex justify-center mt-4 mb-4">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg" disabled={isLoadingModal}>
              Set
            </button>
      </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {goodMessage && <p className="good-message">{goodMessage}</p>}
            {isLoadingModal && <p className="is-loading">Loading...</p>}
          </form>
          
          <div className="mt-4">
      <button
        onClick={closeModal}
        className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200"
      >
        Close
      </button>
    </div>
            </div>
          )}
          {changePasswordModal && (
              <div className={`edit-profile-container ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <form className={`form-sign-up  ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`} onSubmit={handleSubmitPassword}>
              <span className="title">Change Password</span> <br />
              <input
                className={`email-input ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
                placeholder='Old Password'
                type="current-password" 
                required 
                value={oldPassword}
                onChange={handleOldPasswordChange}
                disabled={isLoadingModal} // Disable input field while loading
              />
              <input
                className={`email-input ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
                placeholder='New Password'
                type="current-password" 
                required 
                value={newPassword}
                onChange={handleNewPasswordChange}
                disabled={isLoadingModal} // Disable input field while loading
              /> 
              
             
              <div className="flex justify-center mt-4 mb-4">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg" disabled={isLoadingModal}>
                Submit
              </button>
               </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {goodMessage && <p className="good-message">{goodMessage}</p>}
              {isLoadingModal && <p className="is-loading">Loading...</p>}
            </form>
            <div className="mt-4">
      <button
        onClick={closeModal}
        className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200"
      >
        Close
      </button>
    </div>
          </div>
          )}
          {deleteAccountModal && (
          <div className={`flex flex-col items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <form className= {`w-full max-w-md  ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`} onSubmit={deleteAccount}>
          <span className="text-red-700 text-lg font-bold">Danger Zone</span> <br />
            Are you sure you want to delete this account? <br /><br />
          <button className='px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200' onClick={deleteAccount}  disabled={isLoadingModal} >Delete</button>
        
        {isLoadingModal && <p className='text-black text-sm mt-2'>Loading...</p>}
          
      </form>
      <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200"
                >
                  Close
                </button>
          </div>
          )}
          {viewUserModal && (
            <div className={`p-6 rounded-lg shadow-lg max-w-md mx-auto ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden">
                  {selectedProfilePic && selectedProfilePic.length > 0 ? (
                    <img
                      src={selectedProfilePic[0]}
                      alt="Profile Pic"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleOtherProfilePic(0)}
                    />
                  ) : (
                    
                    <div
                    className="w-32 h-32 rounded-full bg-pink-500 mb-2 overflow-hidden  text-white flex items-center justify-center mr-3 text-lg font-bold">
                        {selectedName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-2">{selectedName} {selectedLastName ? selectedLastName : ''}</h2>
              <p className="text-center text-gray-500 mb-4">{selectedEmail}</p>
              
              <p className="text-center mb-4"><strong> Bio: </strong><br />{selectedBio ? selectedBio : ''}</p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => { setModalContent(null); setViewUserModal(false); }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
            
            
            
          </div>
        </div>
    )}
    {/* Fullscreen Image Modal 3 */}

        {/* show Picture from Image */}
        {fullImagePicture && (
        <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`} 
        onClick={closeFullImagePic}
        > 
        <button
              onClick={closeFullscreenImage}
              className={`absolute top-4 right-4  text-2xl ${isDarkMode ? 'text-white': 'text-black'}`}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={`absolute top-2 right-16 ${isDarkMode ? 'text-white': 'text-black'}`}>
              <button onClick={handleEditClick} disabled={isDeletingProfilePic} className="text-xl">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              {(isDropdownOpen && !isDeletingProfilePic) && (
                <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-black': 'bg-white'} rounded-md shadow-lg z-10`}>
                  <ul className="py-1">
                    <li
                      className={`px-4 py-2 ${isDarkMode ? 'text-white': 'text-black'}  hover:bg-gray-200 cursor-pointer`}
                      onClick={hanldeSaveImage}
                    >
                      Save
                    </li>
                    
                  </ul>
                </div>
              )}
              </div>
          <img src={fullImagePicture} alt="Fullscreen" className="max-w-full max-h-full" />
        </div>
         )}
        {/* show picture from own Profile */}
        {fullscreenImage && (
          <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`} 
          >
            <button
              onClick={closeFullscreenImage}
              className={`absolute top-4 right-4  text-2xl ${isDarkMode ? 'text-white': 'text-black'}`}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={`absolute top-2 left-2 ${isDarkMode ? 'text-white': 'text-black'}`}>
              {currentImageIndex + 1} / {profilePicturesArray.length}
            </div>
            <div className={`absolute top-2 right-16 ${isDarkMode ? 'text-white': 'text-black'}`}>
              <button onClick={handleEditClick} disabled={isDeletingProfilePic} className="text-xl">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              {(isDropdownOpen && !isDeletingProfilePic) && (
                <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-black': 'bg-white'} rounded-md shadow-lg z-10`}>
                  <ul className="py-1">
                    <li
                      className={`px-4 py-2 ${isDarkMode ? 'text-white': 'text-black'}  hover:bg-gray-200 cursor-pointer`}
                      onClick={handleRemoveClick}
                    >
                      Remove
                    </li>
                    {currentImageIndex !== 0 && (
                      <li
                        className={`px-4 py-2 ${isDarkMode ? 'text-white': 'text-black'}  hover:bg-gray-200 cursor-pointer`}
                        onClick={handleSetToMainClick}
                      >
                        Set to Main
                      </li>
                    )}
                  </ul>
                </div>
              )}
              </div>



            <img src={fullscreenImage} 
            alt="Fullscreen" 
            className="max-w-full max-h-full"
            />
            {profilePicturesArray.length > 1 && (
              <>
                <button
                  className={`absolute left-4 text-3xl ${isDarkMode ? 'text-white': 'text-black'}`}
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  disabled={isDeletingProfilePic}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                  className={`absolute right-4 text-3xl ${isDarkMode ? 'text-white': 'text-black'}`}
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  disabled={isDeletingProfilePic}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </>
            )}
          </div>
        )}
        {/*show other Profile Picture */}
        {fullImageOTHER && (
          <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`} 
          >
            <button
              onClick={closeFullImagePic}
              className={`absolute top-4 right-4  text-2xl ${isDarkMode ? 'text-white': 'text-black'}`}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={`absolute top-2 left-2 ${isDarkMode ? 'text-white': 'text-black'}`}>
              {currentImageIndex + 1} / {selectedProfilePic.length}
            </div>
            <div className={`absolute top-2 right-16 ${isDarkMode ? 'text-white': 'text-black'}`}>
              <button onClick={handleEditClick} disabled={isDeletingProfilePic} className="text-xl">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              {(isDropdownOpen && !isDeletingProfilePic) && (
                <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-black': 'bg-white'}  rounded-md shadow-lg z-10`}>
                  <ul className="py-1">
                    <li
                      className={`px-4 py-2 ${isDarkMode ? 'text-white': 'text-black'}  hover:bg-gray-200 cursor-pointer`}
                      
                      onClick={hanldeSaveImage}
                    >
                      Save
                    </li>
                    
                  </ul>
                </div>
              )}
              </div>



            <img src={fullImageOTHER} 
            alt="Fullscreen" 
            className="max-w-full max-h-full"
            />
            {selectedProfilePic.length > 1 && (
              <>
                <button
                  className={`absolute left-4 text-3xl ${isDarkMode ? 'text-white': 'text-black'}`}
                  onClick={(e) => { e.stopPropagation(); handlePrevImageOTHER(); }}
                  disabled={isDeletingProfilePic}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                  className={`absolute right-4 text-3xl ${isDarkMode ? 'text-white': 'text-black'}`}
                  onClick={(e) => { e.stopPropagation(); handleNextImageOTHER(); }}
                  disabled={isDeletingProfilePic}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </>
            )}
          </div>

        )}
      
    {isMobileView ? (
      
      selectedConversation || forSearchUser === true  ?(
        <div className={`flex flex-col w-full ${isDarkMode ? 'bg-gray-900 text-white  border-gray-800' : 'bg-gray-100 text-black  border-gray-200'}`}>
        
        {isOffline && (
        <div className={`flex justify-center items-center${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
        </div>
        )}
        
      {/*Conversation Info*/}
      <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-gray-900 text-white  border-gray-800' : 'bg-gray-100 text-black  border-gray-200'}`}>
       {/*Back Button */}
       <button onClick={() => {setSelectedConversation(null); setForSearchUser(false);}} className="btn btn-secondary mr-2 size-0">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        
        <div className="cursor-pointer flex-grow text-center">
          <h2 className="text-lg font-semibold">
            {selectedRecpientId === Number(sessionStorage.getItem('userId'))?(
              <>
              Saved Messages
              </>
            ):(
            <>
            {selectedName} {selectedLastName}
            </>
            )}
            
          </h2> 
          <div className="text-sm text-gray-500">
          {selectedRecpientId === Number(sessionStorage.getItem('userId'))?(
            <></>
          ):(
            <>
            {selectedOnlineStatus==='true' ? 'Online' : `Last seen: ${formatDateTime(selectedLastSeen)}`}
            </>
          )}
        </div>
        </div>
        {/* Profile Picture */}

        {selectedProfilePic !== null? ( 
                  
        <div className="ml-2 cursor-pointer" onClick={() => openUserModal()} >
          <img src={selectedProfilePic.at(0)} alt="Profile" className="w-8 h-8 rounded-full" />
        </div>
          ):(
        <div
        className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
          {selectedName.charAt(0)}
      </div>
                  
        )}
        <div>
        {isPlaying && (
          <div className="flex justify-between mt-2">
          
        <button onClick={stopCurrentAudio} className="text-red-500">
          <FontAwesomeIcon icon={faStop} />  
        </button> 
      </div> 
      )} 
      </div>
        </div>
       {/* Messages */}
          
       <div className='flex-1 overflow-y-auto p-4 scrollbar-thin' ref={messagesEndRef}>
          {selectedConversation!= null || forSearchUser === true ? (
          messages.length > 0 ? (
          messages.map(message=>( 
            
            <div key={message.id} onClick={closeContextMenu} id={`message-${message.id}`} className="mb-4">
            <div>
            {message.senderId !== Number(sessionStorage.getItem('userId'))?(
            <div key={message.id} onClick={closeContextMenu} className="chat chat-start">
                {/* chat chat start classname = "group chat-bubble bg-white-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words"*/ }         
                <div className="group w-80">
                {message.isImage ? (
                isUploading && uploadingMessageId === message.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : (
                  <div className='group group-hover:cursor-pointer' onContextMenu={(e)=> handleRightClick(e,message.id,"image","start")}>
                  <MessageBox
                    reply={message.reply !== 0 && {
                    photoURL: selectedProfilePic,
                    title: `${truncateText101(selectedName,13)}`,
                    titleColor: '#8717ae',
                    message: 'Photo Message',
                  }}
                  onReplyMessageClick={() => console.log('reply clicked!')}
                  
                    position="left"
                    type="photo"
                    title={selectedName}
                    data={{ uri: message.content }}
                    status={message.new === true || message.new === null ? 'sent' : 'received'}
                    onClick={() => handleImageClick(message.content)}
                  />
                  {contextMenu2 && (
                    <ContextMenu2
                      x={contextMenu2.x}
                      y={contextMenu2.y}
                      
                      onReply={() => {
                        handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"image");
                        closeContextMenu();
                      }}
                      onDelete={() => {
                        handleDeleteMessage(contextMenu2.messageId);
                        closeContextMenu();
                      }}
                      onClose={closeContextMenu}
                    />
                  )}
                  </div>
                )):message.isAudio?(
                  <div className='group chat-bubble bg-blue-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words' onContextMenu={(e)=> handleRightClick(e,message.id,"audio","start")}>
                      {isUploading && uploadingMessageId === message.id && (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      )}
                      {(!isUploading || uploadingMessageId !== message.id) && (
                        <>
                        {isDownloading && downloadingMessageId === message.id ? (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        ) : (
                          isAudioDownloaded(message.id) ? (
                            <button onClick={() => handlePlayAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={isPlaying && currentAudioId === message.id ? faPause : faPlay} />
                            </button>
                          ) : (
                            <button onClick={() => handleDownloadAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={faCloudDownload} />
                            </button>
                          )
                        )}
                      </>
                      )}
                    <div id={`waveform-${message.id}`} className="rounded-lg max-w-full">
                    <span className="duration" 
                      id={`duration-${message.id}`}>
                      {/* eslint-disable-next-line no-template-curly-in-string */}
                      {isPlaying && currentAudioId === message.id
                    ? `${Math.floor((elapsedTimes[message.id] || 0) / 60)}:${Math.floor((elapsedTimes[message.id] || 0) % 60).toString().padStart(2, '0')}`
                    : durationsRef.current[message.id]
                      ? `${Math.floor(durationsRef.current[message.id] / 60)}:${Math.floor(durationsRef.current[message.id] % 60).toString().padStart(2, '0')}`
                      : '0:00'}
                      
                      </span>
                  </div>
                  {contextMenu2 && (
                    <ContextMenu2
                      x={contextMenu2.x}
                      y={contextMenu2.y}
                      
                      onReply={() => {
                        console.log("Chat chat start")
                        handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"audio");
                        closeContextMenu();
                      }}
                      onDelete={() => {
                        handleDeleteMessage(contextMenu2.messageId);
                        closeContextMenu();
                      }}
                      onClose={closeContextMenu}
                    />
                  )}
                </div>
                ):(
                <div onContextMenu={(e)=> handleRightClick(e,message.id,"text","start")}>
                  <MessageBox 
                    reply={message.reply !== 0 && {
                      photoURL: selectedProfilePic,
                      title: `${truncateText101(selectedName,13)}`,
                      titleColor: '#8717ae',
                      message: `${truncateText101((msgIdTomsgObj(message.id)),15)}`,
                    }}
                    onReplyMessageClick={() => console.log('reply clicked!')}
                    position={'left'}
                    type={'text'}
                    text={message.content}
                    
                    />
                    {contextMenu2 && (
                      <ContextMenu2
                        x={contextMenu2.x}
                        y={contextMenu2.y}
                        
                        onReply={() => {
                          handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"text");
                          closeContextMenu();
                        }}
                        onDelete={() => {
                          handleDeleteMessage(contextMenu2.messageId);
                          closeContextMenu();
                        }}
                        onClose={closeContextMenu}
                      />
                    )}
                </div>
                )}
                </div>
                {/* Deleting Icon and Timefield*/}
              {isDeletingMessage ===true && isDeletingMessageId === message.id ?(
              <FontAwesomeIcon icon={faSpinner} spin />
              ):(
              <div className="chat-footer opacity-50">
              {message.edited === true ? ( 
                <span className="mr-2">edited</span>
                ) : null} 
              {formatDateTime(message.timeStamp)} 
              </div> 
              )}
            </div>
            ):( 
            <div key={message.id} onClick={closeContextMenu} className="chat chat-end" >             
                
                <div className='group'>              
                {message.isImage ? (
                isUploading && uploadingMessageId === message.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : (
                  <div className='group w-80 group-hover:cursor-pointer relative overflow-hidden ml-auto' onContextMenu={(e)=> handleRightClick(e,message.id,"image","end")}>
                  <MessageBox
                    reply={message.reply !== 0 && {
                    photoURL: selectedProfilePic,
                    title: `${truncateText101(selectedName,13)}`,
                    titleColor: '#8717ae',
                    message: 'Photo Message',
                  }}
                  onReplyMessageClick={() => console.log('reply clicked!')}
                  
                    position="right"
                    type="photo"
                    title={selectedName}
                    data={{ uri: message.content }}
                    status={message.new === true || message.new === null ? 'sent' : 'received'}
                    onClick={() => handleImageClick(message.content)}
                  />
                  {contextMenu2 && (
                    <ContextMenu2
                      x={contextMenu2.x}
                      y={contextMenu2.y}
                      
                      onReply={() => {
                        handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"image");
                        closeContextMenu();
                      }}
                      onDelete={() => {
                        handleDeleteMessage(contextMenu2.messageId);
                        closeContextMenu();
                      }}
                      onClose={closeContextMenu}
                    />
                  )}
                  </div>
                )) : message.isAudio?(
                  <div className='group chat-bubble bg-blue-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words' onContextMenu={(e) => handleRightClick(e, message.id, "audio","end")}>
                      {isUploading && uploadingMessageId === message.id && (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      )}
                      {!isUploading && (
                        <>
                        {isDownloading && downloadingMessageId === message.id ? (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        ) : (
                          isAudioDownloaded(message.id) ? (
                            <button onClick={() => handlePlayAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={isPlaying && currentAudioId === message.id ? faPause : faPlay} />
                            </button>
                          ) : (
                            <button onClick={() => handleDownloadAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={faCloudDownload} />
                            </button>
                          )
                        )}
                      </>
                      )} 
                      {contextMenu2 && (
                        <ContextMenu2
                          x={contextMenu2.x}
                          y={contextMenu2.y}
                          
                          onReply={() => {
                            handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"audio");
                            closeContextMenu();
                          }}
                          onDelete={() => {
                            handleDeleteMessage(contextMenu2.messageId);
                            closeContextMenu();
                          }}
                          onClose={closeContextMenu}
                        />
                      )} 
                    <div id={`waveform-${message.id}`} className="rounded-lg max-w-full">
                    <span className="duration"
                      id={`duration-${message.id}`}>
                      {/* eslint-disable-next-line no-template-curly-in-string */}
                      {isPlaying && currentAudioId === message.id
                    ? `${Math.floor((elapsedTimes[message.id] || 0) / 60)}:${Math.floor((elapsedTimes[message.id] || 0) % 60).toString().padStart(2, '0')}`
                    : durationsRef.current[message.id]
                      ? `${Math.floor(durationsRef.current[message.id] / 60)}:${Math.floor(durationsRef.current[message.id] % 60).toString().padStart(2, '0')}`
                      : '0:00'}
                      
                      </span>
                      
                    </div>
                    
                
                   
                </div>
                ):(
                <div className='group' onContextMenu={(e)=> handleRightClick(e,message.id,"text","end")}>
                  <MessageBox
                    reply={message.reply !== 0 && {
                      photoURL: selectedProfilePic,
                      title: `${truncateText101(selectedName,13)}`,
                      titleColor: '#8717ae',
                      message: `${truncateText101((msgIdTomsgObj(message.id)),15)}` ,
                    }}
                    onReplyMessageClick={() => console.log('reply clicked!')}
                    position={'right'}
                    type={'text'}
                    text={message.content}
                    status={message.new === true || message.new === null ? 'sent' : 'received'}
                    />
                    {contextMenu && (
                      <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onEdit={() => {
                          handleEditMessage(contextMenu.messageId,msgIdTomsgObj(contextMenu.messageId));
                          closeContextMenu();
                        }}
                        onReply={() => {
                          handleReplyMessage(contextMenu.messageId,msgIdTomsgObj(contextMenu.messageId),"text");
                          closeContextMenu();
                        }}
                        onDelete={() => {
                          handleDeleteMessage(contextMenu.messageId);
                          closeContextMenu();
                        }}
                        onClose={closeContextMenu}
                      />
                    )}
                
                </div>
              
                )}   
                </div>                               
              {/* Deleting Icon*/}
              {isDeletingMessage === true && isDeletingMessageId === message.id ?(
              <FontAwesomeIcon icon={faSpinner} spin />
              ):(
                <div className="chat-footer opacity-50">
                  {message.edited === true ? (
                      <span className="mr-2">edited</span>
                    ) : null}
                  {formatDateTime(message.timeStamp)}
                </div>
              
              
              )}
                
            </div>
             
            )}
          
          </div>
          </div>
            
          ))
          ):(
          <>
          {isLoading ? (<div className="text-center text-gray-600"><FontAwesomeIcon icon={faSpinner} size='2x' spin /></div> ):(<div className="text-center text-gray-600">No messages</div>  ) }
        </>
          )
        ):(
          <div className="flex justify-center items-center h-full text-center text-gray-600">
      
      <p>Select a conversation to view messages</p>
    </div>
        )}
        </div>

      {/* Input Field */}
      
          <div className={`p-1 border-t flex flex-col ${isDarkMode ? 'bg-gray-900 text-white  border-gray-800' : 'bg-gray-100 text-black  border-gray-200'}`}>
          {replyMessage && (
              <div className={`w-full mb-2 p-1 rounded-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                <div className="flex justify-between items-center">
                <div className="flex items-start pl-6">
                  <FontAwesomeIcon icon={faReply} className="mr-2 text-gray-600" />
                  <div className='pl-4'>
                    <div className="font-bold">{`Reply to ${truncateText101(selectedName,13)}`}</div> 
                    <div>{`${truncateText101(replyMessage,15)}`}</div>
                  </div> 
                </div>
                <button className="text-red-600" onClick={clearReplyMessage}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
           )}
          {editMessageModal && (
              <div className={`w-full mb-2 p-1 rounded-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                <div className="flex justify-between items-center">
                <div className="flex items-start pl-6">
                  <FontAwesomeIcon icon={faEdit} className="mr-2 text-gray-600" />
                  <div className='pl-4'>
                    <div className="font-bold">Edit message</div> 
                    <div>{`${truncateText101(editMessageModal,15)}`}</div>
                  </div> 
                </div>
                <button className="text-red-600" onClick={clerEditMessageModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
           )}
          {isRecording ?(
          <div className={`flex items-center w-full justify-between ${isDarkMode ? 'bg-gray-900 text-white  border-gray-700' : 'bg-gray-100 text-black  border-gray-200'}`}>
            <span className="mr-2">{Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}</span>
            <div id="waveform-recording" className="flex-1"></div>
            <button onClick={handleStopRecording} className="ml-2 text-red-600 text-lg">
              <FontAwesomeIcon icon={faStop} size="lg" />
            </button>
          </div>
          ):(
            
          <div className={`flex items-center w-full ${isDarkMode ? 'bg-gray-900 text-white  border-gray-700' : 'bg-gray-100 text-black  border-gray-200'} `}>
            <input 
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isOffline}
              className="btn btn-secondary ml-2"
            >
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
            <TextareaAutosize  
            placeholder="Type your message..."
            value={sendMessage}
            onChange={handleMessage}
            className={`textarea textarea-bordered flex-1 p-2 resize-none rounded-md overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white  border-gray-700' : 'bg-gray-100 text-black  border-gray-200'}`}
            onKeyDown={handleKeyDown}
            minRows={1}
          /> 
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn btn-secondary ml-2"
          > 
          <FontAwesomeIcon icon={faSmile} />
          </button> 
          {(sendMessage.length === 0 && isOffline === false )&& (<button onClick={isRecording ? handleStopRecording : handleStartRecording} className={`btn ml-2 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} `}>
            <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
          </button>)}
              
          {(sendMessage.length !==0 && isOffline ===false) && (<button onClick={editMessageModalId === 0 ? handleSendMessage : handleEditSubmit} disabled={sendMessage.length ===0}>
            {isLoadingMessage ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
          </button> )}
          {/* Emoji Picker */}
          {showEmojiPicker && (
          <div className= {`absolute bottom-20 right-10 z-50 bg-dark`} ref={emojiPickerRef} >
          <Picker theme = {`${isDarkMode ? 'dark' : 'light'}`} dataXX={dataXXX} 
            onEmojiSelect={(e) => { 
              setSendMessage(sendMessage + e.native); 
            }}
          />
          </div>
          )}
          </div>
          
        )}
          </div>
     
    
          </div>
          
      
      ):( 
        <div className={`w-full bg-gray-100 border-r border-gray-300 flex flex-col  ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
          <div className="p-2 flex justify-between items-center">
            <h1 className="text-lg font-bold">FonkaGram</h1>
            {isOffline && (
        <div className={`flex justify-center items-center${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
        </div>
      )}
            <button onClick={toggleDarkMode} className="text-xl">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
      </div>
          {/*Search Bar */}
          <div className="p-4 flex items-center relative">
        <input type="text"
        placeholder="Search Users By Email" 
        value={searchQueryUser} 
        onChange={(e) => setSearchQueryUser(e.target.value)} 
        className={`input input-bordered w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
        />
        <FontAwesomeIcon 
          icon={faCog} 
          className="ml-2 cursor-pointer text-gray-600 hover:text-gray-800" 
          onClick={() => setShowSettings(!showSettings)} 
        />
        {showSettings && (
          <div ref={settingsRef} className={`absolute top-full mt-1 right-0 w-48 border-gray-300 rounded-md shadow-lg z-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            
            <div className='p-2 hover:bg-gray-500 cursor-pointer flex items-center' onClick={() => openModal('EditProfile')}>
              <FontAwesomeIcon icon={faUserEdit} className="mr-2" /> Edit Profile
            </div>
            <div className="p-2 hover:bg-gray-500 cursor-pointer flex items-center" onClick={() => openModal('ChangePassword')}>
              <FontAwesomeIcon icon={faKey} className="mr-2" /> Change Password
            </div>
            <div className="p-2 hover:bg-gray-500 cursor-pointer flex items-center" onClick={() => openModal('DeleteAccount')}>
              <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete Account
            </div>
            <div className="p-2 hover:bg-gray-500 cursor-pointer flex items-center" onClick={() => handleLogOut()}>
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
            </div>
          </div>
        )}
        {searchResultUser.length > 0 && searchQueryUser.length> 0 && ( 
          <div className={`absolute top-full mt-1 w-full border-gray-300 rounded-md shadow-lg z-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}  `}> 
            {searchResultUser.map(result => (
              <div  
              key={result.id}
              className='p-2 hover:bg-gray-500 cursor-pointer'
              onClick={()=>handleNewUserClick(result.id,result.name,result.lastName,result.email,result.status,result.lastSeen,result.bio,result.profilePicSearch)}
              > 
              {result.profilePicSearch? (
              
              <div className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center mr-3 text-lg font-semibold overflow-hidden">
                  <img src={result.profilePicSearch.at(0)} alt={result.profilePicSearch.at(0)} className="w-full h-full object-cover" />    
                </div>
              ):(
                <div
                  className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
                  {result.name.charAt(0)}
                </div>
              )}
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold">
                    {truncateText( `${result.name}`, 8)} {truncateText( `${result.lastName}`, 4)}
                        
                    <span className={`ml-2 inline-block w-3 h-3 rounded-full ${result.status === 'true' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      
                    </div>
                  <div className="text-sm text-gray-500">{result.email}</div>
                </div>
                
              </div>
            </div>

              </div>
            ))} 
          </div>
        )}
           </div> 
          {/*Conversation List */}
          <div className="overflow-y-auto flex-grow p-2 ">    
      {conversations.length > 0 ?(
        <>
          {conversations.map(conversation =>(
            <div 
                key={conversation.convId}   
                className={` group p-4 flex items-start ${selectedConversation === conversation.convId ? 'cursor-pointer' : 'cursor-pointer'}  ${selectedConversation && selectedConversation === conversation.convId ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-300') : ''}`}
                onClick={selectedConversation === conversation.convId ? null : () => { 
                  handleConversationChange(conversation.convId);
                  handleConversationClick(conversation.convId, conversation.userId, conversation.userName, conversation.lastName, conversation.status, conversation.lastSeen, conversation.bio, conversation.email, conversation.profilePicConv);  
                }}
              
              >
              {/* Deleting Conv*/}
              {isDeletingConv ===true && isDeletingConvId === conversation.convId ?(
                <FontAwesomeIcon icon={faSpinner} spin />
              ):(
                <button
                className="relative right-3 text-red-500  hidden group-hover:block"
                onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conversation.convId,conversation.userId); }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                    </button> 
              )}
                
                {conversation.userId === Number(sessionStorage.getItem('userId')) ?(
                <div
                  className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
                    <FontAwesomeIcon icon={faBookmark} style={{ fontSize: '34px', color : isDarkMode? 'white':'black' }}  />
                </div>
                ):(
                  <>
                {conversation.profilePicConv ? ( 
                
                <div className="w-16 h-16 rounded-full bg-gray-500 text-white flex items-center justify-center mr-3 text-lg font-semibold overflow-hidden">
                    <img src={conversation.profilePicConv.at(0)} alt={conversation.profilePicConv.at(0)} className="w-full h-full object-cover" />    
                </div>
                ):(
                  <div
                  className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
                    {conversation.userName.charAt(0)}
                </div>
                
                )}
                </>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                    {conversation.userId === Number(sessionStorage.getItem('userId')) ?(
                      <>
                      Saved Messages
                      </>
                    ):(
                    <div className="text-lg font-semibold">
                        {truncateText( `${conversation.userName}`, 6)} {truncateText( `${conversation.lastName}`, 4)}
                    
                        <span className={`ml-2 inline-block w-3 h-3 rounded-full ${conversation.status === 'true' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      </div>
                    )}
                      
                      {conversation.isAudio && (<div className="text-sm text-gray-500">Voice Message</div>)}
                      {conversation.isImage && (<div className="text-sm text-gray-500">Photo</div>)}
                      {!conversation.isAudio && !conversation.isImage && (<div className="text-sm text-gray-500">{truncateText(conversation.message, 15)}</div>)}
                      
                      
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                    <div className="flex items-center justify-end">
                    {conversation.userId === Number(sessionStorage.getItem('userId')) ? (
                        <></>
                      ) : (
                        <>
                        {conversation.messageSender === Number(sessionStorage.getItem('userId'))?(
                          <>
                          {conversation.seen === true ? (
                            <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-1" />
                          ) : (
                            <FontAwesomeIcon icon={faCheckDouble} className="text-gray-500 mr-1" />
                          )}
                          </>
                        ):(
                          <div></div>
                        )}
                          {conversation.notificationCount > 0 && (
                            <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {conversation.notificationCount}
                            </div>
                          )}
                        </>
                      )}

                      <div>{formatDateTimeConv(conversation.updatedTime)}
                      </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
            </div>
          ))}
      </>
      ):( 
        <>
        {isLoading ? (<div className={`text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} `}><FontAwesomeIcon icon={faSpinner} size='2x' spin /></div> ):(<div className={`text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>No Conversations, Search User's by Email and Start a Conversation</div>  ) }
      </>
      )}

          </div>
        
        </div>
      )
      ):(
    // Desktop view
    <>
      {/*Left Side Bar*/}
      <div className={`w-1/4 bg-gray-100 border-r border-gray-300 flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="p-2 flex justify-between items-center">
            <h1 className="text-lg font-bold">FonkaGram</h1>
            <button onClick={toggleDarkMode} className="text-xl">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
      </div>
      <div className = "p-2 flex justify-between items-center text-lg font-bold">
        <h3>Signed in as {sessionStorage.getItem('Name')}</h3>
      </div>
      {/* Search Bar */}
      <div className="p-4 flex items-center relative">
          <input type="text"
          placeholder="Search Users By Email" 
          value={searchQueryUser} 
          onChange={(e) => setSearchQueryUser(e.target.value)} 
          className={`input input-bordered w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
          />
          <FontAwesomeIcon 
            icon={faCog} 
            className="ml-2 cursor-pointer text-gray-600 hover:text-gray-800" 
            onClick={() => setShowSettings(!showSettings)} 
          />
          {showSettings && (
            <div ref={settingsRef} className={`absolute top-full mt-1 right-0 w-48 border-gray-300 rounded-md shadow-lg z-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
              
              <div className='p-2 hover:bg-gray-500 cursor-pointer flex items-center' onClick={() => openModal('EditProfile')}>
                <FontAwesomeIcon icon={faUserEdit} className="mr-2" /> Edit Profile
              </div>
              <div className="p-2 hover:bg-gray-500 cursor-pointer flex items-center" onClick={() => openModal('ChangePassword')}>
                <FontAwesomeIcon icon={faKey} className="mr-2" /> Change Password
              </div>
              <div className="p-2 hover:bg-gray-500 cursor-pointer flex items-center" onClick={() => openModal('DeleteAccount')}>
                <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete Account
              </div>
              <div className="p-2 hover:bg-gray-500 cursor-pointer flex items-center" onClick={() => handleLogOut()}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
              </div>
            </div>
          )}
          {searchResultUser.length > 0 && searchQueryUser.length> 0 && ( 
            <div className={`absolute top-full mt-1 w-full border-gray-300 rounded-md shadow-lg z-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} style = {{ maxHeight: '20rem', overflowY: 'auto'}}  `}> 
              {searchResultUser.map(result => (
                <div  
                key={result.id}
                className='p-2 hover:bg-gray-500 cursor-pointer'
                onClick={()=>handleNewUserClick(result.id,result.name,result.lastName,result.email,result.status,result.lastSeen,result.bio,result.profilePicSearch)}
                > 
                {result.profilePicSearch? (
                
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 text-lg font-semibold overflow-hidden">
                    <img src={result.profilePicSearch.at(0)} alt={result.profilePicSearch.at(0)} className="w-full h-full object-cover" />    
                  </div>
                ):(
                  <div
                    className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
                    {result.name.charAt(0)}
                  </div>
                )}
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold">
                      <span style={{ fontSize: '0.80em' }}>
                        {truncateText(result.name,result.lastName,0)}
                      </span>{' '}
                      {result.lastName ? 
                      <span style={{ fontSize: '0.80em' }}>
                          {truncateText(result.name,result.lastName,1)}
                        </span> : ''}
                   
                      <span className={`ml-2 inline-block w-3 h-3 rounded-full ${result.status === 'true' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        
                      </div>
                    <div className="text-sm text-gray-500">{result.email}</div>
                  </div>
                </div>
              </div>

                </div>
              ))} 
            </div>
          )}
      </div> 

      {/* Conversations List */}
      <div className="overflow-y-auto flex-grow p-2 ">    
        {conversations.length > 0 ?(
          <>
            {conversations.map(conversation =>(
              <div 
                  key={conversation.convId}   
                  className={` group p-4 flex items-start ${selectedConversation === conversation.convId ? 'cursor-pointer' : 'cursor-pointer'}  ${selectedConversation && selectedConversation === conversation.convId ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-300') : ''}`}
                  onClick={selectedConversation === conversation.convId ? null : () => { 
                    handleConversationChange(conversation.convId);
                    handleConversationClick(conversation.convId, conversation.userId, conversation.userName, conversation.lastName, conversation.status, conversation.lastSeen, conversation.bio, conversation.email, conversation.profilePicConv,conversation.deleted);  
                  }}
                
                >
                {/* Deleting Conv*/}
                {isDeletingConv ===true && isDeletingConvId === conversation.convId ?(
                  <FontAwesomeIcon icon={faSpinner} spin />
                ):(
                  <button
                  className="relative right-3 text-red-500  hidden group-hover:block"
                  onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conversation.convId,conversation.userId); }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                      </button> 
                )}
                  
                  {conversation.userId === Number(sessionStorage.getItem('userId')) ?(
                  <div
                    className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
                      <FontAwesomeIcon icon={faBookmark} style={{ fontSize: '34px', color : isDarkMode? 'white':'black' }}  />
                  </div>
                  ):(
                    <>
                  {conversation.profilePicConv && conversation.deleted === false ? ( 
                  
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 text-lg font-semibold overflow-hidden">
                      <img src={conversation.profilePicConv.at(0)} alt={conversation.profilePicConv.at(0)} className="w-full h-full object-cover" />    
                  </div>
                  ):(
                    <div
                    className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 text-lg font-semibold">
                      {conversation.userName.charAt(0)}
                  </div>
                  
                  )}
                  </>
                  )}
                  
                  <div className="flex-1">
                    {conversation.deleted === true ? (
                      <div className = 'flex justify-between items-center' >
                      <div className="text-lg font-semibold">
                        Deleted Account                  
                      <span className={`ml-2 inline-block w-3 h-3 rounded-full bg-black`}></span>                   
                    </div>
                    </div>
                    ):(
                     <div className="flex justify-between items-center">
                      <div>
                      {conversation.userId === Number(sessionStorage.getItem('userId')) ?(
                        <>
                        Saved Messages
                        </>
                      ):(
                      
                      <div className="text-lg font-semibold">
                      <span style={{ fontSize: '0.80em' }}>
                        {truncateText(conversation.userName,conversation.lastName,0)}
                      </span>{' '}
                      {conversation.lastName ? 
                      <span style={{ fontSize: '0.80em' }}>
                          {truncateText(conversation.userName,conversation.lastName,1)}
                      </span> : ''}
                      <span className={`ml-2 inline-block w-3 h-3 rounded-full ${conversation.status === 'true' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    </div> 
                      )}
                        
                    {conversation.isAudio && (<div className="text-sm text-gray-500">Voice Message</div>)}
                    {conversation.isImage && (<div className="text-sm text-gray-500">Photo</div>)}
                    {!conversation.isAudio && !conversation.isImage && (<div className="text-sm text-gray-500">{truncateText101(conversation.message, 15)}</div>)}
                    
                        
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                      <div className="flex items-center justify-end">
                      {conversation.userId === Number(sessionStorage.getItem('userId')) ? (
                          <></>
                        ) : (
                          <>
                          {conversation.messageSender === Number(sessionStorage.getItem('userId'))?(
                            <>
                            {conversation.seen === true ? (
                              <FontAwesomeIcon icon={faCheck} className="text-blue-500 mr-1" />
                            ) : (
                              <FontAwesomeIcon icon={faCheckDouble} className="text-gray-500 mr-1" />
                            )}
                            </>
                          ):(
                            <div></div>
                          )}
                            {conversation.notificationCount > 0 && (
                              <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {conversation.notificationCount}
                              </div>
                            )}
                          </>
                        )}

                        <div>{formatDateTimeConv(conversation.updatedTime)}
                        </div>
                        </div>
                        
                      </div>
                    </div>
                    )}
                    

                    
                  </div>
              </div>
            ))}
        </>
        ):( 
          <>
          {isLoading ? (<div className="text-center text-gray-600"><FontAwesomeIcon icon={faSpinner} size='2x' spin /></div> ):(<div className="text-center text-gray-600">No Conversations, Search User's by Email and Start a Conversation</div>  ) }
          
        </>
        )}

      </div>
      </div>
        
      {/* Right Content */}
      <div className='flex flex-col w-3/4'>
      {/* Conversation Info */}
        {isOffline && (
          <div className={`flex justify-center items-center${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
          </div>
        )}
        {selectedConversation !== null ? (
          <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-900 text-white  border-gray-800' : 'bg-gray-100 text-black  border-gray-200'}`}>
          {selecteDeleted === true ? (<div>
            <h2 className = 'text-lg font-semibold'>
            {selectedName} {selectedLastName ? selectedLastName : ''}
            </h2>
            <div className="text-sm text-gray-500">
          
            <>
            Last seen a long time ago
            </>
          
        </div>
          </div>):(
          <div onClick={() => openUserModal()}  className="cursor-pointer">
          <h2 className="text-lg font-semibold">
            {selectedRecpientId === Number(sessionStorage.getItem('userId'))?(
              <>
              Saved Messages
              </>
            ):(
            <>
            {selectedName} {selectedLastName ? selectedLastName : ''}
            </>
            )}
            
          </h2> 
          <div className="text-sm text-gray-500">
          {selectedRecpientId === Number(sessionStorage.getItem('userId'))?(
            <></>
            ):(
              <div className={`${selectedOnlineStatus === 'true' ? 'text-blue-700' : 'text-gray-500'}`}>
              {selectedOnlineStatus === 'true' && selectedConversation !== null 
                ? (selectedTyping ? '...typing' : 'Online') 
                : `Last seen: ${formatDateTime(selectedLastSeen)}`}
            </div>
          )}
        </div>
        </div>
          )}
          
          <div>
          {isPlaying && (
            <div className="flex justify-between mt-2">
            
          <button onClick={stopCurrentAudio} className="text-red-500">
            <FontAwesomeIcon icon={faStop} />  
          </button> 
        </div> 
          )} 
          </div>
        </div>
        ):(
          <></>
        )}
        
 
      {/* Messages */}
          
        <div className='flex-1 overflow-y-auto p-4 scrollbar-thin' ref={messagesEndRef}>
        {selectedConversation !== 0 && selectedConversation !== null ? (
          messages.length > 0 ? (
          messages.map(message=>( 
            
            <div key={message.id} onClick={closeContextMenu} id={`message-${message.id}`} className="mb-4">
            <div>
            {message.senderId !== Number(sessionStorage.getItem('userId'))?(
            <div key={message.id} onClick={closeContextMenu} className="chat chat-start">
                {/* chat chat start classname = "group chat-bubble bg-white-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words"*/ }         
                <div className="group w-80">
                {message.isImage ? (
                isUploading && uploadingMessageId === message.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : (
                  <div className='group group-hover:cursor-pointer' onContextMenu={(e)=> handleRightClick(e,message.id,"image","start")}>
                  <MessageBox
                    reply={message.reply !== 0 && {
                    photoURL: selectedProfilePic,
                    title: `${truncateText101(selectedName,13)}`,
                    titleColor: '#8717ae',
                    message: 'Photo Message',
                  }}
                  onReplyMessageClick={() => console.log('reply clicked!')}
                  
                    position="left"
                    type="photo"
                    title={selectedName}
                    data={{ uri: message.content }}
                    status={message.new === true || message.new === null ? 'sent' : 'received'}
                    onClick={() => handleImageClick(message.content)}
                  />
                  {contextMenu2 && contextMenu2.messageId === message.id && (
                    <ContextMenu2
                      x={contextMenu2.x}
                      y={contextMenu2.y}
                      isDarkMode={isDarkMode}
                      
                      onReply={() => {
                        handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"image");
                        closeContextMenu();
                      }}
                      onDelete={() => {
                        handleDeleteMessage(contextMenu2.messageId,message.recpientId,message.convId);
                        closeContextMenu();
                      }}
                      onClose={closeContextMenu}
                    />
                  )}
                  </div>
                )):message.isAudio?(
                  <div className='group chat-bubble bg-blue-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words relative' onContextMenu={(e)=> handleRightClick(e,message.id,"audio","start")}>
                      {isUploading && uploadingMessageId === message.id && (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      )}
                      {(!isUploading || uploadingMessageId !== message.id) && (
                        <>
                        {isDownloading && downloadingMessageId === message.id ? (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        ) : (
                          isAudioDownloaded(message.id) ? (
                            <button onClick={() => handlePlayAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={isPlaying && currentAudioId === message.id ? faPause : faPlay} />
                            </button>
                          ) : (
                            <button onClick={() => handleDownloadAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={faCloudDownload} />
                            </button>
                          )
                        )}
                      </>
                      )}
                    <div id={`waveform-${message.id}`} className="relative rounded-lg max-w-full">
                    <span className="duration" 
                      id={`duration-${message.id}`}>
                      {/* eslint-disable-next-line no-template-curly-in-string */}
                      {isPlaying && currentAudioId === message.id
                    ? `${Math.floor((elapsedTimes[message.id] || 0) / 60)}:${Math.floor((elapsedTimes[message.id] || 0) % 60).toString().padStart(2, '0')}`
                    : durationsRef.current[message.id]
                      ? `${Math.floor(durationsRef.current[message.id] / 60)}:${Math.floor(durationsRef.current[message.id] % 60).toString().padStart(2, '0')}`
                      : '0:00'}       
                    </span>
                    {contextMenu2 && contextMenu2.messageId === message.id &&(
                    <ContextMenu2

                      x={contextMenu2.x}
                      y={contextMenu2.y}
                      isDarkMode={isDarkMode}
                      
                      onReply={() => {
                        handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"audio");
                        closeContextMenu();
                      }}
                      onDelete={() => {
                        handleDeleteMessage(contextMenu2.messageId,message.recpientId,message.convId);
                        closeContextMenu();
                      }}
                      onClose={closeContextMenu}
                    />
                    )}
                  </div>
                  
                  
                </div>
                ):(
                <div onContextMenu={(e)=> handleRightClick(e,message.id,"text","start")}>
                  <MessageBox 
                    reply={message.reply !== 0 && {
                      photoURL: selectedProfilePic,
                      title: `${truncateText101(selectedName,13)}`,
                      titleColor: '#8717ae',
                      message: `${truncateText101((msgIdTomsgObj(message.reply)),15)}`,
                    }}
                    onReplyMessageClick={() => console.log('reply clicked!')}
                    position={'left'}
                    type={'text'}
                    text={message.content}
                    styles={{ 
                      backgroundColor: isDarkMode ? '#2A2F3A' : 'white',  // Black for dark mode, light green otherwise
                      color: isDarkMode ? 'white' : 'black',  // White text for dark mode, black text otherwise
                      borderRadius: '15px',  // Rounded corners
                      padding: '10px',  // Padding inside the box
                    }}
                    textStyle={{
                      fontSize: '56px',  // Adjust the font size
                      color: 'black'     // Make sure text color stays black
                    }}
                    />

                    {contextMenu2  && contextMenu2.messageId === message.id &&(
                      <ContextMenu2
                        x={contextMenu2.x}
                        y={contextMenu2.y}
                        isDarkMode={isDarkMode}
                        onReply={() => {
                          handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"text");
                          closeContextMenu();
                        }}
                        onDelete={() => {
                          handleDeleteMessage(contextMenu2.messageId,message.recpientId,message.convId);
                          closeContextMenu();
                        }}
                        onClose={closeContextMenu}
                      />
                    )}
                </div>
                )}
                </div>
                {/* Deleting Icon and Timefield*/}
              {isDeletingMessage ===true && isDeletingMessageId === message.id ?(
              <FontAwesomeIcon icon={faSpinner} spin />
              ):(
              <div className="chat-footer opacity-50">
              {message.edited === true ? ( 
                <span className="mr-2">edited</span>
                ) : null} 
              {formatDateTime(message.timeStamp)} 
              </div> 
              )}
            </div>
            ):( 
            <div key={message.id} onClick={closeContextMenu} className="chat chat-end" >             
                
                <div className='group'>              
                {message.isImage ? (
                isUploading && uploadingMessageId === message.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : (
                  <div className='group w-80 group-hover:cursor-pointer ' onContextMenu={(e)=> handleRightClick(e,message.id,"image","end")}>
                  <MessageBox
                    reply={message.reply !== 0 && {
                    photoURL: selectedProfilePic,
                    title: `${truncateText101(selectedName,13)}`,
                    titleColor: '#8717ae',
                    message: 'Photo Message',
                  }}
                  onReplyMessageClick={() => console.log('reply clicked!')}
                  
                    position="right"
                    type="photo"
                    title={selectedName}
                    data={{ uri: message.content }}
                    status={message.new === true || message.new === null ? 'sent' : 'received'}
                    onClick={() => handleImageClick(message.content)}
                  />
                  {contextMenu2 && contextMenu2.messageId === message.id && (
                    <ContextMenu2
                      x={contextMenu2.x}
                      y={contextMenu2.y}
                      isDarkMode={isDarkMode}
                      onReply={() => {
                        handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"image");
                        closeContextMenu();
                      }}
                      onDelete={() => {
                        handleDeleteMessage(contextMenu2.messageId,message.recpientId,message.convId);
                        closeContextMenu();
                      }}
                      onClose={closeContextMenu}
                    />
                  )}
                  </div>
                )) : message.isAudio?(
                  <div className='group chat-bubble bg-blue-500 text-white p-2 rounded-lg max-w-xs md:max-w-md break-words' onContextMenu={(e) => handleRightClick(e, message.id, "audio","end")}>
                      {isUploading && uploadingMessageId === message.id && (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      )}
                      {!isUploading && (
                        <>
                        {isDownloading && downloadingMessageId === message.id ? (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        ) : (
                          isAudioDownloaded(message.id) ? (
                            <button onClick={() => handlePlayAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={isPlaying && currentAudioId === message.id ? faPause : faPlay} />
                            </button>
                          ) : (
                            <button onClick={() => handleDownloadAudio(message.content, message.id)} className="mr-2">
                              <FontAwesomeIcon icon={faCloudDownload} />
                            </button>
                          )
                        )}
                      </>
                      )}                     
                    <div id={`waveform-${message.id}`} className="rounded-lg max-w-full">
                    <span className="duration"
                      id={`duration-${message.id}`}>
                      {/* eslint-disable-next-line no-template-curly-in-string */}
                      {isPlaying && currentAudioId === message.id
                    ? `${Math.floor((elapsedTimes[message.id] || 0) / 60)}:${Math.floor((elapsedTimes[message.id] || 0) % 60).toString().padStart(2, '0')}`
                    : durationsRef.current[message.id]
                      ? `${Math.floor(durationsRef.current[message.id] / 60)}:${Math.floor(durationsRef.current[message.id] % 60).toString().padStart(2, '0')}`
                      : '0:00'}
                      
                      </span>
                      {contextMenu2 && contextMenu2.messageId === message.id &&(
                        <ContextMenu2
                          x={contextMenu2.x}
                          y={contextMenu2.y}
                          isDarkMode={isDarkMode}
                          onReply={() => {
                            handleReplyMessage(contextMenu2.messageId,msgIdTomsgObj(contextMenu2.messageId),"audio");
                            //console.log("ContextMenu2 Audio chatEnd");
                            closeContextMenu();
                          }}
                          onDelete={() => {
                            handleDeleteMessage(contextMenu2.messageId,message.recpientId,message.convId);
                            closeContextMenu();
                          }}
                          onClose={closeContextMenu}
                        />
                      )} 
                    </div>

                    
                
                   
                </div>
                ):(
                <div className='group' onContextMenu={(e)=> handleRightClick(e,message.id,"text","end")}>
                    <MessageBox
                      reply={message.reply !== 0 && {
                        photoURL: selectedProfilePic,
                        title: `${truncateText101(selectedName,13)}`,
                        titleColor: '#8717ae',
                        message: `${truncateText101((msgIdTomsgObj(message.reply)),15)}` ,
                      }}
                      onReplyMessageClick={() => console.log('reply clicked!')}
                      position={'right'}
                      type={'text'}
                      text={message.content}
                      status={message.new === true || message.new === null ? 'sent' : 'received'}
                      styles={{ 
                        backgroundColor: isDarkMode ? '#3A76F0' : '#3A76F0',  // Black for dark mode, light green otherwise
                        color: isDarkMode ? 'white' : 'black',  // White text for dark mode, black text otherwise
                        borderRadius: '15px',  // Rounded corners
                        padding: '10px',  // Padding inside the box
                      }}
                      textStyle={{
                        fontSize: '56px',  // Adjust the font size
                        color: 'black'     // Make sure text color stays black
                      }}
                      />
                    {contextMenu && contextMenu.messageId === message.id && (
                      <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        isDarkMode={isDarkMode}
                        onEdit={() => {
                          handleEditMessage(contextMenu.messageId,msgIdTomsgObj(contextMenu.messageId));
                          closeContextMenu();
                        }}
                        onReply={() => {
                          handleReplyMessage(contextMenu.messageId,msgIdTomsgObj(contextMenu.messageId),"text");
                          closeContextMenu();
                        }}
                        onDelete={() => {
                          handleDeleteMessage(contextMenu.messageId,message.recpientId,message.convId);
                          closeContextMenu();
                        }}
                        onClose={closeContextMenu}
                      />
                    )}
                
                </div>
                )}   
                </div>                               
              {/* Deleting Icon*/}
              {isDeletingMessage === true && isDeletingMessageId === message.id ?(
              <FontAwesomeIcon icon={faSpinner} spin />
              ):(
                <div className="chat-footer opacity-50">
                  {message.edited === true ? (
                      <span className="mr-2">edited</span>
                    ) : null}
                  {formatDateTime(message.timeStamp)}
                </div>
              
              
              )}
                
            </div>
             
            )}
          
          </div>
          </div>
            
          ))
          ):(
          <>
          {isLoading ? (
            <div className="text-center text-gray-600"><FontAwesomeIcon icon={faSpinner} size='2x' spin /></div> 
            ):(<div className="text-center text-gray-600">No messages</div>  
            )}
        </>
          )
        ):(
          <div className="flex justify-center items-center h-full text-center text-gray-600">   
            { selectedConversation === null ?(<p>Select a conversation to view messages</p>):(<></>) }
          </div>
        )}
        </div>

      {/* Input Field */}
      { selecteDeleted === false && selectedConversation !==null? (
          <div className={`p-1 border-t flex flex-col ${isDarkMode ? 'bg-gray-900 text-white  border-gray-800' : 'bg-gray-100 text-black  border-gray-200'}`}>
            {replyMessage && (
              <div className={`w-full mb-2 p-1 rounded-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                <div className="flex justify-between items-center">
                <div className="flex items-start pl-6">
                  <FontAwesomeIcon icon={faReply} className="mr-2 text-gray-600" />
                  <div className='pl-4'>
                    <div className="font-bold">{`Reply to ${truncateText101(selectedName,13)}`}</div> 
                    <div>{`${truncateText101(replyMessage,15)}`}</div>
                  </div> 
                </div>
                <button className="text-red-600" onClick={clearReplyMessage}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
           )}
           {editMessageModal && (
              <div className={`w-full mb-2 p-1 rounded-md ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                <div className="flex justify-between items-center">
                <div className="flex items-start pl-6">
                  <FontAwesomeIcon icon={faEdit} className="mr-2 text-gray-600" />
                  <div className='pl-4'>
                    <div className="font-bold">Edit message</div> 
                    <div>{`${truncateText101(editMessageModal,15)}`}</div>
                  </div> 
                </div>
                <button className="text-red-600" onClick={clerEditMessageModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
           )}
          {isRecording ?(
          <div className={`flex items-center w-full justify-between ${isDarkMode ? 'bg-gray-900 text-white  border-gray-700' : 'bg-gray-100 text-black  border-gray-200'}`}>
            <span className="mr-2">{Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}</span>
            <div id="waveform-recording" className="flex-1"></div>
            <button onClick={handleStopRecording} className="ml-2 text-red-600 text-lg">
              <FontAwesomeIcon icon={faStop} size="lg" />
            </button>
          </div>
          ):(
            
          <div className={`flex items-center w-full ${isDarkMode ? 'bg-gray-900 text-white  border-gray-700' : 'bg-gray-100 text-black  border-gray-200'} `}>
            <input 
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isOffline}
              className="btn btn-secondary ml-2"
            >
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
            <TextareaAutosize  
            placeholder="Type your message..."
            value={sendMessage}
            onChange={handleMessage}
            className={`textarea textarea-bordered flex-1 p-2 resize-none rounded-md overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white  border-gray-700' : 'bg-gray-100 text-black  border-gray-200'}`}
            onKeyDown={handleKeyDown}
            minRows={1}
          /> 
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn btn-secondary ml-2"
          > 
          <FontAwesomeIcon icon={faSmile} />
          </button> 
          {(sendMessage.length === 0 && isOffline === false )&& (<button onClick={isRecording ? handleStopRecording : handleStartRecording} className={`btn ml-2 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} `}>
            <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
          </button>)}
              
          {(sendMessage.length !==0 && isOffline ===false) && (<button onClick={editMessageModalId === 0 ? handleSendMessage : handleEditSubmit} disabled={sendMessage.length ===0}>
            {isLoadingMessage ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
          </button> )}
          </div>
          
        )}
          </div>
      ):(
      <div></div>
      )}

      </div>
      {/* Emoji Picker */}
      {showEmojiPicker && (
      <div className= {`absolute bottom-20 right-10 z-50 bg-dark`} ref={emojiPickerRef} >
      <Picker theme = {`${isDarkMode ? 'dark' : 'light'}`} dataXX={dataXXX} 
        onEmojiSelect={(e) => { 
          setSendMessage(sendMessage + e.native); 
        }}
      />
      </div>
      )}
      </>    
      )}
  </div>
  );
}
export default Chats;