
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Grid,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom.js";
import useShowToast from "../hooks/useShowToast.js";
import userAtom from "../atoms/userAtom.js";
import OtpModal from "./OtpModal.jsx";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("")
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      username: "",
      email: "",
      password: "",
    };

    // Validate name
    if (!inputs.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Validate username
    if (!inputs.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    // Validate email
    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(inputs.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Validate password
    if (!inputs.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (inputs.password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isValidEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {

    if (!validateForm()) {
      return; // Don't proceed with signup if form is invalid
    }
    setLoading(true);

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log(data);
      setEmail(data.email)

      onOpen()
      showToast("Account created", "Verify your email", "success");
      setInputs(prevInputs => ({ ...prevInputs, name: "", username: "", email: "", password: "" }));


      // localStorage.setItem("user-threads", JSON.stringify(data));
      // setUser(data);


    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>

        <OtpModal isOpen={isOpen} onClose={onClose} email={email} />


        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    value={inputs.name}
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <Text color={useColorModeValue("red.500", "red.200")}>
                      {errors.name}
                    </Text>
                  )}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={inputs.username}
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                  />
                  {errors.username && (
                    <Text color={useColorModeValue("red.500", "red.200")}>
                      {errors.username}
                    </Text>
                  )}
                </FormControl>
              </Grid>
            </HStack>

            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={inputs.email}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
              />
              <Text color={useColorModeValue("red.500", "red.200")}>
                {" "}
                {errors.email}{" "}
              </Text>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text color={useColorModeValue("red.500", "red.200")}>
                {" "}
                {errors.password}{" "}
              </Text>
            </FormControl>
            <Stack spacing={10} pt={2}>

              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                isLoading={loading}
                onClick={handleSignup}
              >
                Sign up via OTP
              </Button>

            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    
  );
}
