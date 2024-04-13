import { useState, useEffect } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";
import Posts from "../components/Posts.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";

function UserPage() {
  const {user, loading} = useGetUserProfile()
  const { username } = useParams()
  const showToast = useShowToast()
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    getPosts()
  }, [username, showToast])

  const getPosts = async() => {
    setFetchingPosts(true)
    try {
      const res = await fetch(`/api/posts/user/${username}`)
      const data = await res.json()
      setPosts(data)
      console.log(data);
    } catch (error) {
      showToast("Error", error.message ,"error")    
      setPosts([])  
    } finally {
      setFetchingPosts(false)
    }
  }


  if(!user && loading) {
    return (
      <Flex justifyContent={"center"} >
        <Spinner size="xl" />
      </Flex>
    )
  }

  if(!user && !loading) return <h1>User not found</h1>
  
  return (
    <>
    <UserHeader user={user} />
    {!fetchingPosts && posts.length === 0 && <h1>User have no post.</h1>}
    {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.map(post => (
        <Posts key={post._id} postedBy={post.postedBy} post={post} />
      ))}

    </>
  )
}

export default UserPage