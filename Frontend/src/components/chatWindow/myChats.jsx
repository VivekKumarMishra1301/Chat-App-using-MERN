import React,{useState,useEffect} from 'react'
import {ChatState} from '../../context/chatProvider';
import { useToast } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons';
import {} from '../chatConfig/chatLogics'
import { getSender } from '../chatConfig/chatLogics';
import { Text } from '@chakra-ui/react'
import { Stack, HStack, VStack } from '@chakra-ui/react'
import GroupChatModal from './groupChatModal';
import axios from 'axios';
const myChats = () => {
  const [loggedUser, setLoggedUSer] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          
        },
      };
      const { data } = await axios.get('http://localhost:5000/api/chat', config)
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to Load the Chats',
        status: 'error',
        duration: 5000,
        isCLosable: true,
        position:'bottom-left',
      })
    }
  }
  useEffect(() => {
    setLoggedUSer(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  },[])
  return (
    <Box
      display={{base:selectedChat?"none":"flex",md:"flex"}}
      flexDirection='column'
      alignItems='center'
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"

      >
        My Chats
        <GroupChatModal>


        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "10px" }}
          rightIcon={<AddIcon/>}
          >
          New Group Chat
        </Button>
          </GroupChatModal>

      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat?(getSender(loggedUser,chat.users)):(chat.chatName)}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(<chatLoading/>)}
      </Box>
    </Box>
  )
}

export default myChats