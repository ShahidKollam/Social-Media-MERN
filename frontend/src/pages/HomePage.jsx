import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Posts from "../components/Posts";

function HomePage() {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast]);

  return (
    <>
      {!loading && posts.length === 0 && 
        <h1>Follow some users to see the post</h1>
      }

      {loading && (
        <Flex justify={"center"}>
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.map((post) => (
        <Posts key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default HomePage;
