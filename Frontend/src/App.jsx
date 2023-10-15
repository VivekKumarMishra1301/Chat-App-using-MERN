import { useState } from 'react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import './App.css'
import {Route} from 'react-router-dom'
import Chat from './components/Chat/chat.jsx';
import Home from './components/Home/home.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div className='App'>
        <Route path='/' component={Home} exact/>
         <Route path='/chat' component={Chat}/>
        <Button colorScheme='blue'>Button</Button>
      </div>
    
  )
}

export default App
