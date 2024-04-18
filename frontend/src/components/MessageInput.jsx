import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { IoSendSharp } from 'react-icons/io5'

function MessageInput() {
  return (
    <form>
        <InputGroup>
            <Input w={"full"} placeholder='Type a message' />

            <InputRightElement>
                <IoSendSharp />
            </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput  