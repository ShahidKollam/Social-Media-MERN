import { useState } from "react";
import { Flex, Avatar, Box, Text, Image, Divider } from "@chakra-ui/react";
import Actions from "./Actions";

function Comment({ reply, lastReply }) {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex gap={3} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.username}
            </Text>
            {/* <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {createdAt}
              </Text>
            </Flex> */}
          </Flex>
          <Text>{reply.text}</Text>

          {/* <Actions liked={liked} setLiked={setLiked} />
          <Text fontSize={"sm"} color={"gray.light"}>
            {likes + (liked ? 1 : 0)} likes
          </Text> */}

        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
}

export default Comment;
