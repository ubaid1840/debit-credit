
import {
    Container,
    Text,
    VStack,
} from "@chakra-ui/react";
import Button from "../ui/Button";
import Link from "next/link";


export default function HomePage() {

    return (
            <Container as={"section"} id="home" maxW={'100%'} bgImage={'/home.jpg'} bgSize={'cover'} bgPosition={'center'} height={'100vh'} alignItems={'center'} justifyContent={'center'} flexDir={'column'}>

                <VStack
                    align={'center'}
                    justify={'center'}
                    textAlign={'center'}
                    w={'100%'}
                    height={'100%'}
                >
                    <Text variant={'heading'} fontSize={{base : '5xl', md : '8xl'}} color={'white'} fontWeight={'bold'}>
                        MONEY MANAGER
                    </Text>
                    <Text fontSize={'2xl'} color={'white'}>
                        Your personal debit and credit wallet.
                    </Text>
                    <div>
                        <Button size={'lg'} mt={4} as={Link} href={"/login"}>
                            GET STARTED
                        </Button>
                    </div>

                </VStack>
            </Container>
       
    )
}