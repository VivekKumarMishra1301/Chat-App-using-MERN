import React, { useEffect,useState} from 'react'
import axios from 'axios';
import {ChatState} from '../../context/chatProvider';
import SideDrawer from '../chatWindow/sideDrawer';
import MyChats from '../chatWindow/myChats';
import ChatBox from '../chatWindow/chatBox';
import {Box} from '@chakra-ui/react'
const chat = () => {
  const {user}=ChatState();
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
          {user&&<MyChats/>}
          {user&&<ChatBox/>}
        </Box>
      </div>
    
  );
    
};

export default chat