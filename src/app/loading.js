'use client'
import { Flex, Spinner, useColorModeValue } from '@chakra-ui/react'
export default function Loading() {
    return (
        <Flex  height={'100vh'} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} >
            <Spinner color='black'/>
        </Flex>
    )
}