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
const sideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingC, setLoadingC] = useState();
    const { user } = ChatState();
    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
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
                  <Button variant='ghost'>
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
              
          >
              
          </Drawer>
      </>
  );
}

export default sideDrawer