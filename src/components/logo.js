import { theme } from "@/data/data";
import { Box, Image, Text } from "@chakra-ui/react";


export default function Logo({type}) {
    return (
        <Box color={type ? "white" : 'teal'} display={'flex'} gap={1}>
           
            <Text ml={1}  fontSize="18px" fontWeight="600">
                Money
            </Text>
            <Text fontSize="18px">
                Manager
            </Text>
        </Box>
    )
}