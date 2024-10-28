import { theme } from "@/data/data"
import { Button as ChakraButton } from "@chakra-ui/react"

const Button = ({ children, ...props }) => {
  return (
    <ChakraButton
    colorScheme="teal"
    height={'40px'}
      fontSize="14px"
      color="white"
      fontWeight="400"
      variant="solid"
      _hover={{ opacity: 0.7 }}
      {...props}
    >
      {children}
    </ChakraButton>
  )
}

export const GhostButton = ({ children, ...props }) => {
  return <ChakraButton
    boxShadow={"0px 0px 1px 1px #1018280D"}
    fontSize="14px"
    fontWeight="500"
    variant="outline"
    backgroundColor={"#FFFFFF"}
    color={"black"}
    border={"1px solid"}
    borderColor={"teal"}
    _hover={{ opacity: 0.7 }}
    {...props}
  >
    {children}
  </ChakraButton>
}

export const DangerButton = ({ children, ...props }) => {
  return <ChakraButton

    boxShadow={"0px 0px 1px 1px #1018280D"}
    border="1px solid"
    borderColor="#FDA29B"
    backgroundColor="#FFFFFF"
    fontSize="14px"
    color="#B42318"
    fontWeight="500"
    variant="solid"
    _hover={{ opacity: 0.7 }}
    {...props}
  >
    {children}
  </ChakraButton>
}

export default Button