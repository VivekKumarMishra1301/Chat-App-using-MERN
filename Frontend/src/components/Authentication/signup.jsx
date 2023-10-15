import React,{useState} from 'react'
import { Stack, HStack, VStack, InputRightElement } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Input,InputGroup } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
const signup = () => {
    const [show, setShow] = useState(false);
    const [cShow,setcShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const handleClick = () => setShow(!show);
    const handleClickCf = () => setcShow(!cShow);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            return;
        }
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append("file", pics);
            data.append('upload_preset', 'chatapp');
            data.append('cloud_name', 'rtca');
            fetch("https://api.cloudinary.com/v1_1/rtca/image/upload", {
                method: 'post',
                body: data,
                mode: 'no-cors',
                headers: {
    'Authorization': '738923653429559',
  },
            }).then((res) => {
                console.log(res)
                res.json()
            }).then((data) => {
                console.log(data);
                setPic(data.url.toString());
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });

        } else {
            toast({
                title: 'Please Select an Image',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = () => {
        
    }
  return (
      <VStack spacing='5px'>
          <FormControl id='first-name' isRequired>
              <FormLabel>Name</FormLabel>
                  <Input
                      placeholder="Enter Your Name"
                      onChange={(e)=>setName(e.target.value)}
                  />
              
          </FormControl>
          <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
                  <Input
                      placeholder="Enter Your Email"
                      onChange={(e)=>setEmail(e.target.value)}
                  />
              
          </FormControl>
          <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                  <Input
                      type={show?"text":"Password"}
                      placeholder="Enter Your Password"
                      onChange={(e)=>setPassword(e.target.value)}
                  />
                  <InputRightElement
                      width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show?"Hide":"Show"}
                      </Button>
                  </InputRightElement>
                  
              </InputGroup>      
              
          </FormControl>
          <FormControl id='cpassword' isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                  <Input
                      type={cShow?"text":"Password"}
                      placeholder="Enter Your Confirm Password"
                      onChange={(e)=>setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement
                      width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClickCf}>
                          {cShow?"Hide":"Show"}
                      </Button>
                  </InputRightElement>
                  
              </InputGroup>      
              
          </FormControl>
          <FormControl>
              <FormLabel>Upload Your Profile Picture</FormLabel>
              <Input type="file"

                  p={1.5}
                  accept="image/*"
                  onChange={(e)=>postDetails(e.target.files[0])}
              />
          </FormControl>
          <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={submitHandler}
          isLoading={loading}
          >SignUp</Button>
    </VStack>
  )
}

export default signup