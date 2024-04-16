import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  Heading,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast.js";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom.js";


function OtpModal({ isOpen, onClose, email }) {
  const [otp, setOtp] = useState("");
  const showToast = useShowToast();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  
  const [disableResend, setDisableResend] = useState(true); // State to control button disabled status
  const [timer, setTimer] = useState(60);

  console.log("disable", disableResend);
  useEffect(() => {
    if (isOpen && timer > 0 && disableResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);

    } else if (timer === 0 && disableResend) {
      setDisableResend(false); // Enable the "Resend OTP" button after 1 minute
    }
  }, [timer, disableResend, isOpen]);



  const handleVerify = async() => {
    setLoading(true);

    try {
        const res = await fetch("/api/users/verify-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({otp, email}),
          });
          const data = await res.json();
          console.log(data);
    
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
    
          showToast("Success", data.message, "success");
          onClose()
          setAuthScreen("login")

    } catch (error) {
        showToast("Error", error, "error");
    } finally {
        setOtp("")
        setLoading(false)
    }
  };


  const handleOtpResend = async() => {
    setLoading1(true);
    console.log("Entered OTP:", otp);
    console.log(email);
    try {
        const res = await fetch("/api/users/resend-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({otp, email}),
          });
          const data = await res.json();
          console.log(data);
    
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          showToast("Success", data.message, "success");
          setTimer(60);
          setDisableResend(true)


    } catch (error) {
        showToast("Error", error, "error");
    } finally {
        setOtp("")
        setLoading1(false)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verify your Email</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack
            spacing={4}
            bg={useColorModeValue("white", "gray.700")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}>
            <Flex direction={"column"} align={"center"}>
              <Center>
                <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                  Account Registered
                </Heading>
              </Center>
              <Center
                fontSize={{ base: "sm", sm: "md" }}
                color={"white"}>
                We have sent OTP to your email
              </Center>
              <Center
                fontSize={{ base: "sm", sm: "md" }}
                fontWeight="bold"
                color={useColorModeValue("gray.800", "gray.400")}>
                {email}
              </Center>
            </Flex>
            <FormControl>
              <Center>
                <HStack>
                  <PinInput value={otp} onChange={setOtp}>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </Center>
            </FormControl>
          </Stack>
        </ModalBody>
        <Button
        margin={4}
        loadingText="Submitting"
        size="lg"
        bg={"blue.400"}
        color={"white"}
        _hover={{
          bg: "blue.500",
        }}
          mt={4}
          isLoading={loading}
          onClick={handleVerify}>
          Verify
        </Button>

        <Button
        margin={4}
        loadingText="Sending OTP"
        size="lg"
        bg={"blue.400"}
        color={"white"}
        _hover={{
          bg: "blue.500",
        }}
        isLoading={loading1}
        isDisabled={disableResend}
          mt={4}
          onClick={handleOtpResend}>
          {disableResend ? `Resend OTP ( ${timer} s)` : "Resend OTP"}

        </Button>
      </ModalContent>
    </Modal>
  );
}

export default OtpModal