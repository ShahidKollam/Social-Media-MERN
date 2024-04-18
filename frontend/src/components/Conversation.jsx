import {
  Avatar,
  AvatarBadge,
  Flex,
  Stack,
  WrapItem,
  useColorModeValue,
  Text,
  Image
} from "@chakra-ui/react";


function Conversation() {
  return (
    <Flex
      gap={2}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src="https://bit.ly/broken-link"
        >
          <AvatarBadge boxSize="1em" bg="green.500" />
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          shahid <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text
          fontSize={"xs"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
        >
            message...
        </Text>
      </Stack>

    </Flex>
  );
}

export default Conversation;
