import { Avatar, Flex, useColorModeValue, Text, Image, Divider, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import Message from './Message'
import MessageInput from './MessageInput'
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import { useEffect, useRef, useState } from 'react';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext.jsx';
import messageSound from "../assets/sounds/sound.mp3"

function MessageContainer() {
	const currentUser = useRecoilValue(userAtom)
	const selectedConversation = useRecoilValue(selectedConversationAtom)
	const showToast = useShowToast();
	const [loadingMessages, setLoadingMessages] = useState(true)
	const [messages, setMessages] = useState([])
	const { socket } = useSocket()
	const setConversations = useSetRecoilState(conversationsAtom);
	const messageEndRef = useRef()

	useEffect(() => {

	  socket.on("newMessage", (message) => {

		if(message.conversationId === selectedConversation._id){
			setMessages((prev) => [...prev, message])
		}
			
		if (!document.hasFocus()) {
			const sound = new Audio(messageSound)
			sound.play()
		}
			

		setConversations((prev) => {
			const updatedConversations = prev.map(conversation => {
				if(conversation._id === message.conversationId){
					return {
						...conversation,
						lastMessage: {
							text: message.text,
							sender: message.sender
						}
					}
				}
				return conversation
			})
			return updatedConversations
		})
	  })

	
	  return () => socket.off("newMessage")

	}, [socket, selectedConversation, setConversations])

	useEffect(() => {
		const lastMessageFrmOtherUser = messages.length && messages[messages.length-1].sender !== currentUser._id
		
		if(lastMessageFrmOtherUser){
			socket.emit("markMessagesAsSeen",{
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId
			})
		}

		socket.on("messagesSeen", ({conversationId}) => {

			setMessages(prev => {
				if(selectedConversation._id === conversationId) {
					const updatedMessages = prev.map(message => {
						if(!message.seen) {
							return {
								...message,
								seen: true
							}
						}
						return message
					})
					return updatedMessages
				}
			})
		})
	}, [socket, currentUser._id, messages, selectedConversation])
	
	useEffect(() => {

	  const getMessages = async () => {
		setLoadingMessages(true)
		setMessages([])
		try {
		  if(selectedConversation.mock) return;
		  	
		  const res = await fetch(`/api/messages/${selectedConversation.userId}`);
		  const data = await res.json();
  
		  if (data.error) {
			showToast("Error", data.error, "error");
			return;
		  }
		  setMessages(data)

		} catch (error) {
		  showToast("Error", error.message, "error");
		} finally {
		  setLoadingMessages(false)
		}
	  };
	  getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

	useEffect(() => {
	  messageEndRef.current?.scrollIntoView({ behaviour: "smooth"})
	}, [messages])
	
  
  return (
    <Flex flex="70"
        bg={useColorModeValue("gray.200", "gray.dark")}
        borderRadius={"md"}
        flexDirection={"column"} p={2}
    >

        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
            <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
            <Text display={"flex"} alignItems={"center"}>
                {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
            </Text>
        </Flex>
        <Divider />

        <Flex flexDirection={"column"} gap={4} my={4} px={2}
            height={"400px"} overflowY={"auto"}
        >
            {loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message) => (
						<Flex
							key={message._id}
							direction={"column"}
							ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
						>
							<Message message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))}
 
			</Flex>
                	<MessageInput setMessages={setMessages} />
    </Flex>
  )
}

export default MessageContainer