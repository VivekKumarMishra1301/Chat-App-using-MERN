import React, {useState,useEffect} from 'react'
import {ChatState} from '../../context/chatProvider';
import { Box, IconButton, Input, Spinner } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../chatConfig/chatLogics'
import ProfileModal from './profileModal'
import UpdateGroupChatModal from './updateGroupChatModal';

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import axios from 'axios';
import { useToast } from '@chakra-ui/react'
import ScrollableChat from './scrollableChat'
import io from 'socket.io-client'
import Lottie from 'react-lottie';
const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare;
import animationData from '../animations/typing.json'
const singleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio:'xMidYMid slice'
    },
}


  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  // console.log(message);
  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  const fetchMessage = async () => {
    if (!selectedChat)
      return;
    try {
      const config = {
        headers: {
            
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/messages/${selectedChat._id}`, config);
      console.log(message);
      setMessage(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom',
      });
    }

  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing',()=> setIsTyping(false));
  }, [])
  
  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      console.log('new Message Recieved ')
      if (
        !selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        // give notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
          
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }
      
    });
});


  const sendMessage = async(event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage('');
        const { data } = await axios.post('http://localhost:5000/api/messages',{
          content: newMessage,
          chatId: selectedChat,
        }, config);
        console.log("data")
        console.log(data);
        socket.emit('new message', data);
        setMessage([...message, data]);
      } catch (error) {
        toast({
                title: 'Error in Sending Messages',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'bottom-left',
            });
      }
    }
  }
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    },timerLength)
  }


  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            width='100%' fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={()=>setSelectedChat('')}
            ></IconButton>

            {!selectedChat.isGroupChat?(
              <>
                {getSender(user,selectedChat.users)}
                {<ProfileModal user={getSenderFull(user,selectedChat.users)}/>}
              </>
            ) : (
                <>
                   {selectedChat.chatName.toUpperCase()}
                  {<UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessage={fetchMessage}
                  />} 
                </>
            )}
          </Text>
          <Box
            display='flex'
            flexDirection='column'
            justifyContent='flex-end'
            p={3}
            bg='#E8E8E8'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
                <div className='messages'>
                  <ScrollableChat messages={message}/>
                </div>
            )}


            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{marginBottom:15,marginLeft:0}}
                ></Lottie>

              </div>:(<></>)}
              <Input
                variant='filled'
                bg='#E0E0E0'
                placeholder='Type a Message...'
                onChange={typingHandler}
                value={newMessage}
              >
              </Input>

              
              </FormControl>

          </Box>
        </>
  ): (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      h='100%'
    >
      <Text
        fontSize='3xl'
        pb={3}
        fontFamily='Work sans'
      >
        Click on a user to start chatting
      </Text>
      
        </Box>
      )}
    </>
  );
  
}

export default singleChat