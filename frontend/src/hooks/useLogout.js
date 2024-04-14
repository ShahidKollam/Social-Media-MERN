import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import useShowToast from "../hooks/useShowToast.js";

function useLogout() {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const logout = async () => {
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
      showToast("Error", error.message, "error");

      console.log(error.message);
    }
  };
  return logout;
}

export default useLogout;
