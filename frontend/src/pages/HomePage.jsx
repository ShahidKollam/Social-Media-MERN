import { useEffect, useState } from "react";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

function HomePage() {
  const showToast = useShowToast(userAtom);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/posts/feed");
        const data = res.json()
        console.log(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false)
      }
    };
    getFeedPosts()
  }, [showToast]);

  return <div>HomePage</div>; 
}

export default HomePage;
