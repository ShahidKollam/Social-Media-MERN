import { Avatar, Flex, useColorModeValue, Text, Image, Divider, SkeletonCircle, Skeleton } from '@chakra-ui/react'
import React from 'react'
import Message from './Message'
import MessageInput from './MessageInput'

function MessageContainer() {
  return (
    <Flex flex="70"
        bg={useColorModeValue("gray.200", "gray.dark")}
        borderRadius={"md"}
        flexDirection={"column"} p={2}
    >

        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
            <Avatar src='' size={"sm"} />
            <Text display={"flex"} alignItems={"center"}>
                shahuu <Image src='/verified.png' w={4} h={4} ml={1} />
            </Text>
        </Flex>
        <Divider />

        <Flex flexDir={"column"} gap={4} my={4} px={2}
            height={"400px"} overflowY={"auto"}
        >
            {false &&
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

				{/* {!loadingMessages &&
					messages.map((message) => (
						<Flex
							key={message._id}
							direction={"column"}
							ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
						>
							<Message message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))} */}

                    <Message ownMessage={true} />
                    <Message ownMessage={false} />
                    <Message ownMessage={true} />
                    <Message ownMessage={false} />
                    <Message ownMessage={true} />
                    <Message ownMessage={false} />

			</Flex>
                <MessageInput />
    </Flex>
  )
}

export default MessageContainer