import React,{useState,useEffect} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import axios from 'axios'
import {ChatState} from '../../context/chatProvider';
import UserListItem from './userList'
import UserBadgeItem from './useBadgeItem'
const groupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const[selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [state, setState] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = ChatState();
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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please Fill All The Fields ',
                status: 'warning',
                duration: '2000',
                isClosable: true,
                position: 'top',
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);
            setChats([data, ...chats])
            onClose();
            toast({
                title: 'New Group Is Created',
                status: 'success',
                duration: '2000',
                isClosable: true,
                position: 'bottom',
            });
        } catch (error) {
            toast({
                title: 'Failed to Create Group ',
                status: 'error',
                duration: '2000',
                isClosable: true,
                position: 'top',
            });
        }

    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Already Added",
                
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd])
    }
    const handleDelete = (userToDel) => {
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id!==userToDel._id))
    }
   return (
    <>
           <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
                   <ModalHeader
                       fontsize='35px'
                       fontFamily='Work sans'
                       display='flex'
                       justifyContent='center'
                   >Create Group Chat</ModalHeader>
          <ModalCloseButton />
                   <ModalBody
                       display='flex'
                       flexDirection='column'
                       alignItems='center'

                   >
                       <FormControl>
                           <Input
                               placeholder='Add Users eg: Vivek Mishra'
                               mb={1}
                               onChange={(e)=>setGroupChatName(e.target.value)}

                           />
                       </FormControl>
                       <FormControl>
                           <Input
                               placeholder='Chat Name'
                               mb={3}
                               onChange={(e)=>handleSearch(e.target.value)}

                           />
                       </FormControl>
                      <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers?.map((u) => (
                                <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleDelete(u)}
                                />
                            ))}
                            </Box>
                       {loading ? <div>loading...</div> : (
                           searchResult?.slice(0, 4).map(user => (
                               <UserListItem
                                   key={user._id}
                                   user={user}
                                   handleFunction={()=>handleGroup(user)}
                               />))
                        )}
                        
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default groupChatModal