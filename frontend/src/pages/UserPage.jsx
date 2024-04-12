import { useState, useEffect } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";

function UserPage() {
  const [user, setUser] = useState(null)
  const { username } = useParams()
  const showToast = useShowToast()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async() => {
      try {
        const res = await fetch(`/api/users/profile/${username}`)
        const data = await res.json()

        if (data.error) {
          showToast("Error", data.error ,"error")
          return;
        }
        setUser(data)

      } catch (error) {
        showToast("Error", error ,"error")      
      } finally {
        setLoading(false);
      }
    }
    getUser()
  }, [username, showToast])

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
    <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads" />
    <UserPost likes={3240} replies={340} postImg="/post3.png" postTitle="Success path" />
    <UserPost likes={1211} replies={290} postImg="/zuck-avatar.png" postTitle="World of innovation" />
    </>
  )
}

export default UserPage