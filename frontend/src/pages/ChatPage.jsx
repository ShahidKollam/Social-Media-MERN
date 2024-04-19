import { SearchIcon } from "@chakra-ui/icons";
import { GiConversation } from "react-icons/gi";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

function ChatPage() {
  const [loadingConversations, setLoadingConversations] = useState(true);
  const currentUser = useRecoilValue(userAtom)
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const [searchText, setSearchText] = useState("")
  const [searchingUser, setSearchingUser] = useState(false)

  const showToast = useShowToast();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);
  

  const handleConversationSearch = async (e) => {
    e.preventDefault()
    setSearchingUser(true)

    try {
      const res = await fetch("/api/users/profile/" + searchText);
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (data._id === currentUser._id) {
        showToast("Error", "You cannot message yourself.", "error");
        return
      }

      const conversationAlreadyExist = conversations.find(
        conversation => conversation.participants[0]._id === data._id
      )

      if (conversationAlreadyExist) {
        setSelectedConversation({
          _id: conversationAlreadyExist._id,
          userId: data._id,
          username: data.username,
          userProfilePic: data.profilePic,
        })
        return
      }

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false)
    }
  }
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Serach for a user" 
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to Start messaging</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
}

export default ChatPage;
