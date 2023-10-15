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

const login = () => {
  const [show, setShow] = useState(false);
    
    
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    
   
    const handleClick = () => setShow(!show);

   
    const submitHandler = () => {
        
    }
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
          onClick={submitHandler}>Login</Button>
          
          <Button
              variant="solid"
              colorScheme="red"
              width="100%"
              onClick={() => {
                  setEmail("guest@example.com");
                  setPassword("123456")
          }}>Guest User</Button>
    </VStack>
  )
}

export default login