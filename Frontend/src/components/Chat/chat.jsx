import React, { useEffect,useState} from 'react'
import axios from 'axios';
const chat = () => {
  const [chats, setChats] = useState([]);
  const fetchChat = async () => {
    const data = await axios.get('http://localhost:5000/api/chat');
    console.log(data)
    setChats(data.data);


  //     try {
  //   const response = await axios.get('http://localhost:5000/api/chat');
  //   console.log(response.data);
  // } catch (error) {
  //   console.error('Axios Error:', error);
  // }


  }
  useEffect(() => {
    fetchChat();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}</div>
  );
};

export default chat