
import { FcGoogle } from 'react-icons/fc'
import { Button, Center, Text } from '@chakra-ui/react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import useShowToast from '../hooks/useShowToast';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

export default function OAuth() {
    const showToast = useShowToast()
    const setUser = useSetRecoilState(userAtom);

    const handleGoogleClick = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(app);
          const result = await signInWithPopup(auth, provider);
          console.log(result.user);
          
          const res = await fetch("/api/users/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: result.user.displayName,
              email: result.user.email,
              profilePic: result.user.photoURL,
            }),
          });
          const data = await res.json();
          console.log("googleauth",data);

          if (data.error) {
            showToast("Error", data.error, "info");
            return;
          }

          localStorage.setItem("user-threads", JSON.stringify(data));
          setUser(data);                               
          showToast("Success", "Google Authentication success", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
            console.log("Could not login with google", error);
        }
      };
    
  return (
    <Center>

        <Button w={'full'} size={"lg"} variant={'outline'} leftIcon={<FcGoogle />}
            onClick={handleGoogleClick}
        >
          <Center>
            <Text>Login in with Google</Text>
          </Center>

        </Button>

    </Center>
  )
}