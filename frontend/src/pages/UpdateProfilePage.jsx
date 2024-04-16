"use client";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  FormHelperText,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg.js";
import useShowToast from "../hooks/useShowToast.js";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [errors, setErrors] = useState({});

  const [inputs, setInputs] = useState({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    bio: user?.bio,
    password: "",
    profilePic: "",
  });

  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);

  const { handleImageChange, imgUrl } = usePreviewImg();
  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);

    // Frontend validation
    const validationErrors = {};
    if (!inputs.name.trim()) {
      validationErrors.name = "Name is required";
    }
    if (!inputs.username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!inputs.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(inputs.email.trim())) {
      validationErrors.email = "Invalid email address";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setUpdating(false);
      return;
    }

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Profile upadated successfully", "success");

      setUser(data);

      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>

          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button onClick={() => fileRef.current.click()} w="full">
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>

          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              placeholder="Full Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
            {errors.name && (
              <FormHelperText color="red.500">{errors.name}</FormHelperText>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
            {errors.username && (
              <FormHelperText color="red.500">{errors.username}</FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
            {errors.email && (
              <FormHelperText color="red.500">{errors.email}</FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              placeholder="your bio ."
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
            {errors.bio && (
              <FormHelperText color="red.500">{errors.bio}</FormHelperText>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>

          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.600",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
