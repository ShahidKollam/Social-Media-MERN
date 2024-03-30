import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

function UserPage() {
  return (
    <>
    <UserHeader />
    <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads" />
    <UserPost likes={3240} replies={340} postImg="/post3.png" postTitle="Success path" />
    <UserPost likes={1211} replies={290} postImg="/zuck-avatar.png" postTitle="World of innovation" />
    </>
  )
}

export default UserPage