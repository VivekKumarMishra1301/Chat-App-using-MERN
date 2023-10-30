import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender,isLastMessage } from '../chatConfig/chatLogics'
import { ChatState } from '../../context/chatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'


const scrollableChat = ({messages}) => {
    const { user } = ChatState();
    console.log('done')
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                <div
                    style={{ display: 'flex' }}
                    key={m._id}
                >
                        {(isSameSender(messages, m, i, user._id))
                            || isLastMessage(messages, m.i, user._id)
                        && <Tooltip
                                lable={m.sender.name}
                                placement='bottom-start'
                                hasArrow
                            >
                                <Avatar
                                    mt='7px'
                                    mr={1}
                                    size='sm'
                                    cursor='pointer'
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                >
                                        
                                </Avatar>
                            </Tooltip>}
                </div>
            ))}
        </ScrollableFeed>
    );
}

export default scrollableChat