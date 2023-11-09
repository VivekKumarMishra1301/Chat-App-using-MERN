import React,{useState} from 'react'
import { Stack, HStack, VStack, InputRightElement } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Input,InputGroup } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
const login = () => {
  const [show, setShow] = useState(false);
    
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history=useHistory();
    const handleClick = () => setShow(!show);

   
    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please Fill All The Fields',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("http://localhost:5000/api/user/login", { email, password }, config);
            toast({
                title: 'Now You Are Logged In',
                // description: "We've created your account for you.",
                status: 'success',
                duration: 2000,
                isClosable: true,
                position:"bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
            window.location.href = '/chats';
        } catch (error) {
            toast({
                title: 'Error Occured!',
                // description: "We've created your account for you.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            setLoading(false);
        }
    };
  return (
      <VStack spacing='5px'>
          
          <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
                  <Input
                      placeholder="Enter Your Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  />
              
          </FormControl>
          <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                  <Input
                      type={show?"text":"Password"}
                      placeholder="Enter Your Password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                  />
                  <InputRightElement
                      width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show?"Hide":"Show"}
                      </Button>
                  </InputRightElement>
                  
              </InputGroup>      
              
          </FormControl>
          
          <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={submitHandler}
              isLoading={loading}
          >Login</Button>
          
          <Button
              variant="solid"
              colorScheme="red"
              width="100%"
              onClick={() => {
                  setEmail("guestusernew@gmail.com");
                  setPassword("1234567")
          }}>Guest User</Button>
    </VStack>
  )
}

export default login