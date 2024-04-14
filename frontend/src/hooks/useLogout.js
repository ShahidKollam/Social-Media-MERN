import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import useShowToast from "../hooks/useShowToast.js";

function useLogout() {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const logout = async () => {
    try {
      
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      
      const data = await res.json();
      console.log(data);
      
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      console.log(error);
      showToast("Logout Error", error.message, "error");
    }
  };
  return logout;
}

export default useLogout;
