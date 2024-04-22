import {
  Button,
  Flex,
  Image,
  useColorMode,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [searchedUser, setSearchUser] = useState("");
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleSearchUser = async () => {
    try {
      const res = await fetch(`/api/users/profile/${searchedUser}`);
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (data.isFrozen) {
        showToast("Error", "Account freezed", "error");
        return;
      }

      navigate(`/${searchedUser}`);
      setSearchUser("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchUser();
            }}
          >
            <InputGroup size="sm" w="125px">
              <Input
                variant="outline"
                placeholder="Search user"
                borderRadius={100}
                value={searchedUser}
                onChange={(e) => setSearchUser(e.target.value)}
                required
                pattern="^\S.*$"

              />
              <InputRightElement
                cursor={"pointer"}
                children={<RiSearchLine color="gray.300" />}
              />
            </InputGroup>
          </form>

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
