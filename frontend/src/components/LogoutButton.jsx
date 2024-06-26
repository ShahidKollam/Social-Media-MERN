
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import useShowToast from "../hooks/useShowToast.js";



// this in not using .
// instead of this uselogout custom hook.




function LogoutButton() {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const handleLogout = async () => {
    try {
      const res = await fetch("api/users/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  };
  return 
}

export default LogoutButton;
