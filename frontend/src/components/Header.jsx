import {
  Button,
  Flex,
  Image,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import { useState } from "react";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [searchUser, setSearchUser] = useState("")
  console.log(searchUser);
  const handleSearchUser = async() => {}

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <Link to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      {!user && (
        <Link to={"/auth"} onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
        

          <InputGroup size="sm" w="125px">
            <InputLeftElement
              pointerEvents="none"
              children={<RiSearchLine color="gray.300" />}
            />
            <Input
              variant="outline"
              placeholder="Search user"
              borderRadius={100}
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              onClick={handleSearchUser}
            />
          </InputGroup>


          <Link to={`${user.username}`}>
            <RxAvatar size={24} />
          </Link>

          <Link to={"/chat"}>
            <BsFillChatQuoteFill size={20} />
          </Link>

          <Link to={"/settings"}>
            <MdOutlineSettings size={20} />
          </Link>

          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
      {!user && (
        <Link to={"/auth"} onClick={() => setAuthScreen("signup")}>
          Sign up
        </Link>
      )}
    </Flex>
  );
}

export default Header;
