import React, {useState} from 'react'
import { Box, Button, Drawer, IconButton, Input, useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import {ChatState} from '../../context/chatProvider';
import { useToast } from '@chakra-ui/react'
import UserBadgeItem from './useBadgeItem'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import axios from 'axios'
import UserListItem from './userList'

const updateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessage}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, setSelectedChat, chats, setChats,selectedChat } = ChatState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading,setRenameLoading] = useState(false);
    const [groupChatName, setGroupChatName] = useState();

     const toast = useToast()
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admins Can Remove',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id,
                
            }, config);
            user1._id===user._id?setSelectedChat():setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessage();
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: bottom,
            });
            setLoading(false);
            return;
        }
        
    }
    const handleRename = async() => {
        if (!groupChatName) return
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/chat/rename', {
                chatId: selectedChat._id,
                chatName:groupChatName
            }, config)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false);
            
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setGroupChatName('');
        }
    }
     const handleSearch = async(query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
        const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
        console.log(data)
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: "Failed to Load Search Result",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:'bottom-left'
            })
        }
    }
    const handleAddUser = async(user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)){
            toast({
                title: 'User already Added',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;

        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admins Can Add',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.put('http://localhost:5000/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id,
                
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
    }
    return (
    <>
            <IconButton onClick={onOpen}
                display={{ base: 'flex' }}
                icon={<ViewIcon/>}

            >Open Drawer</IconButton>


      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb='3'>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display='flex'>
                            <Input
                                placeHolder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e)=>setGroupChatName(e.target.value)}
                            >
                                </Input>
                                <Button
                                    variant='solid'
                                    colorScheme='teal'
                                    isLoading={renameLoading}
                                    onClick={handleRename}
                                    >
                                    Update
                                </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeHolder='Add User To Group'
                                mb={1}
                                onChange={(e)=>handleSearch(e.target.value)}
                            ></Input>
                        </FormControl>
                        {loading ? <div>loading...</div> : (
                           searchResult?.slice(0, 4).map(user => (
                               <UserListItem
                                   key={user._id}
                                   user={user}
                                   handleFunction={()=>handleAddUser(user)}
                               />))
                        )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)} >
              Leave Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default updateGroupChatModal