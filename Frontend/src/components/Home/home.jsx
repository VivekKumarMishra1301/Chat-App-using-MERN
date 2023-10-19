import { React ,useEffect} from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../Authentication/login';
import SignUp from '../Authentication/signup';
import {useHistory} from 'react-router-dom'
const home = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      history.push('/chats');
    }
  }, [history]);

  return (<Container maxW='xl' centerContent>
    <Box
      d='flex'
      p={3}
      bg={"white"}
      w="100%"
      m="400px 0 15 px 0"
      mb="2em"
      mt="2em"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Text fontSize="4xl" fontFamily="work sans" color="black">VartaLaap</Text>
    </Box>
    <Box color="black" bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px">
      <Tabs variant='soft-rounded' >
        <TabList mb="1em">
          <Tab width="50%">Login</Tab>
          <Tab width="50%">SignUp</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>
              <Login/>
            </p>
          </TabPanel>
          <TabPanel>
            <p>
              <SignUp/>
            </p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </Container >
  );
}

export default home