import React, {useState} from 'react'
import { Box, Tooltip } from '@chakra-ui/react'
import { Button, ButtonGroup,Text } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { BellIcon,PhoneIcon, AddIcon, WarningIcon,ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import {ChatState} from '../../context/chatProvider';
import ProfileModal from './profileModal';
import {useHistory} from 'react-router-dom'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useDisclosure,useToast } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import axios from 'axios';
import ChatLoading from './ChatLoading'
import UserListItem from './userList'
import { Spinner } from '@chakra-ui/react'
const sideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { user,setSelectedChat,chats,setChats } = ChatState();
    const history = useHistory();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
    }


    const handleSearch = async() => {
        if (!search) {
            toast({
                title: "Please Enter Email or Name",
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position:'top-left',
                
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured",
                description:'Failed To Load The Search Result',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:'top-left',
                
            });
        }
    }

    const accessChat = async(userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type":'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/chat', { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
        } catch (error) {
            toast({
                title: 'Error fetching the Chat',
                description: error.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'bottom-left',
            });
        }
    }
  return (
      <>
          <Box className='Side-Bar'
              display='flex'
              justifyContent="space-between"
              alignItems='center'
              bg='white'
              w='100%'
              p='5px 10px 5px 10px'
              borderWidth='5px'
          >
              
          <Tooltip label="Search Users To Chat" hasArrow placement='bottom-end'>
                  <Button variant='ghost' onClick={onOpen}>
                      <FontAwesomeIcon icon={faSearch} />
                  {/* <i class="fa-thin fa-magnifying-glass"></i> */}
                  <Text d={{base:'none',md:'flex'}} px='4'>
                      SearchUser
                </Text>
              </Button>
        </Tooltip>
              <Text fontSize='2xl' fontFamily='work-sans'>
                  Vart-A-Laap
              </Text>
              <div>
                  <Menu>
                      <MenuButton p={1}>
                          <BellIcon></BellIcon>
                      </MenuButton>
                      {/* <MenuList></MenuList> */}
                  </Menu>
                  <Menu>
                      <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon/>}
                      >
                          <Avatar
                              size='sm'
                              cursor='pointer'
                              name={user.name}
                              src={user.pic}
                          />
                      </MenuButton>
                      <MenuList>
                          <ProfileModal user={user}>
                              
                          <MenuItem>My Profile</MenuItem>
                          </ProfileModal >
                          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                      </MenuList>
                  </Menu>
              </div>
          </Box>
          <Drawer
              placement='left'
              onClose={onClose}
              isOpen={isOpen}

          >
              <DrawerOverlay></DrawerOverlay>
              <DrawerContent>
                  <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
                  <DrawerBody>
                  <Box
                      display='flex'
                      pb={2}
                  >
                      <Input
                          placeholder='search by name or email'
                          mr={2}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          
                      />
                      <Button
                          onClick={handleSearch}
                      >
                          Go
                      </Button>
                      </Box>
                      {loading ? (
                        <ChatLoading></ChatLoading>
                      ) : (
                               
                              searchResult?.map((user)=>(
                                <UserListItem
                                      key={user._id}
                                      user={user}
                                      handleFunction={()=>accessChat(user._id)}
                                />
                              ))
                      )}
                      {loadingChat&&<Spinner ml='auto' display='flex'/>}
                </DrawerBody>
              </DrawerContent>
              
          </Drawer>
      </>
  );
}

export default sideDrawer