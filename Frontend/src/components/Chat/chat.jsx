import React, { useEffect,useState} from 'react'
import axios from 'axios';
import {ChatState} from '../../context/chatProvider';
import SideDrawer from '../chatWindow/sideDrawer';
import MyChats from '../chatWindow/myChats';
import ChatBox from '../chatWindow/chatBox';
import {Box} from '@chakra-ui/react'
const chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    
      <div style={{width:'100%'}}>
        {user&&<SideDrawer/>}        
        <Box className='Chat-Window'
          d="flex"
          justifyContent='space-between'
        
          w="100%"
          h='91.5vh'
          p='10px'
          
        >
          {user&&<MyChats fetchAgain={fetchAgain} />}
          {user&&<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
      </div>
    
  );
    
};

export default chat