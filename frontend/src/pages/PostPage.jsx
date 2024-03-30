import { Flex, Avatar, Box, Text, Image, Divider, Button,  } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

function PostPage() {
  const [liked, setLiked] = useState(false);

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark Zucker" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              markzuckerberg
            </Text>
            <Image src="/verified.png" w={"4"} h={"4"} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>Let's talk about threads.</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={"/post1.png"} w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked}/>
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"} >238 replies</Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"} >{200 + (liked ? 1 : 0)} likes</Text>
      </Flex>

      <Divider my={4}/>

      <Flex justifyContent={"space-between"} >
        <Flex gap={2} alignItems={"center"} >
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4}/>
      <Comment comment='woww nicee' createdAt='2d' likes={1} username='shahu' userAvatar='https://bit.ly/dan-abramov' />
      <Comment comment='Lokks good' createdAt='3d' likes={231} username='John' userAvatar='https://bit.ly/kent-c-dodds' />
      <Comment comment='amazing' createdAt='1d' likes={121} username='aish' userAvatar='https://bit.ly/ryan-florence' />
    </>
  );
}

export default PostPage;
