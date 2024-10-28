'use client'

import {
    Box,
    Flex,
    Text,
    IconButton,

    Stack,
    Collapse,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react'
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons'
import Button, { GhostButton } from './ui/Button'
import Link from 'next/link'
import Logo from './logo'

export default function Header() {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <Box pos={'fixed'} width={'100%'} zIndex={1}>
            <Flex
                bg={'#000000A0'}
                color={'white'}
                minH={'60px'}
                py={{ base: 2, md : 4 }}
                px={{ base: 4 }}

                align={'center'}
                justify={'space-between'}>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3}  color={'white'}/> : <HamburgerIcon w={5} h={5} color={'white'}/>}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />

                </Flex>
                <Flex display={{ base: 'none', md: 'flex' }}>
                   <Logo type={'light'}/>
                </Flex>
               

                <Stack

                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>
                    <Button as={Link} href="/login">
                        LOGIN
                    </Button>
                    <GhostButton as={Link} href="/signup">
                        SIGN UP
                    </GhostButton>
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
             
            </Collapse>
        </Box>
    )
}
