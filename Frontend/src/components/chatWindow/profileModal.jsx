import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import {Button} from '@chakra-ui/react'
import { Image,Text } from '@chakra-ui/react'
const profileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
      <>
          {children ? (
              <span onClick={onOpen}>{ children}</span>
          ) : (
                  <IconButton d={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}></IconButton>
          )}
          <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='410px'>
          <ModalHeader
            fontSize='40px'
            fontFamily='Work-sans'
            display="flex"
            justifyContent='center'
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='space-between'
          >
            <Image
              borderRadius='full'
              boxSize='150px'
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: '28px', md: '30px' }}
              fontFamily='work sans'
            >Email:{user.email}</Text>
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default profileModal