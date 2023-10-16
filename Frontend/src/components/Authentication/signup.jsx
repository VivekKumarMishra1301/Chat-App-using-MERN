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
import axios from 'axios';
import {useHistory} from 'react-router-dom'
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
    const history=useHistory();
    const handleClick = () => setShow(!show);
    const handleClickCf = () => setcShow(!cShow);
    console.log(pic);
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
            data.append("upload_preset", "chatapp");
            data.append("cloud_name", "rtca");
            fetch("https://api.cloudinary.com/v1_1/rtca/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json() ).then((data) => {
                console.log(data.secure_url);
                setPic(data.secure_url.toString());
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

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
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
        if (password != confirmPassword) {
          toast({
                title: 'Password Do Not Match',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
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
            const { data } = await axios.post('http://localhost:5000/api/user', { name, email, password,pic }, config);
            toast({
                title: 'Registration SuccessFul',
                // description: "We've created your account for you.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        } catch (error) {
            toast({
                title: 'Error Occured',
                // description: "We've created your account for you.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            setLoading(false);
        }

    };
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