"use client"

import React, { useContext, useEffect, useState } from "react";
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    Image,
    Divider,
    HStack,
    Avatar,
    VStack,
    Switch,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Heading,
    AccordionIcon,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@chakra-ui/react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { RiHome2Line, RiLogoutBoxLine } from "react-icons/ri";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Logo from "./logo";
import { theme } from "@/data/data";
import Link from "next/link";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth, db } from "@/config/firebase";
// import { UserContext } from "@/store/context/UserContext";
import useCheckSession from "@/config/checkSession";
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import Button from "./ui/Button";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { UserContext } from "@/store/context/UserContext";

export default function Sidebar({ children, LinkItems }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { state: UserState, setUser } = useContext(UserContext)
    const checkSession = useCheckSession()

    useEffect(() => {

        checkSession().then((val) => {
            setUser(val)
        })
    }, [])

    return (

        <Box
            minH="100vh"
        >
            <SidebarContent


                LinkItems={LinkItems}
                onClose={() => onClose}
                display={{ base: "none", md: "flex" }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent LinkItems={LinkItems} display="flex" onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: '280px' }} display={"flex"} flexDir={'column'}>
                {children}
            </Box>

        </Box>
    );
}

const SidebarContent = ({ LinkItems, onClose, ...rest }) => {

    const pathname = usePathname()
    const { state: UserState, setUser } = useContext(UserContext)


    return (
        <Box
            w={{ base: "full", md: '280px' }}
            pos="fixed"
            minHeight={"full"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            bg={"#F5F8FF"}
            {...rest}
            borderRightWidth={1}
            borderRightColor="#EAECF0"
        >
            <div>
                <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                    <Logo />
                    <CloseButton
                        display={{ base: "flex", md: "none" }}
                        onClick={onClose}
                    />
                </Flex>

                {LinkItems.map((link, index) =>
                (
                    <NavItem
                        key={link.name}
                        icon={link.icon}
                        path={`${link.path}`}
                        isActive={pathname.includes(link?.path)}
                    >
                        {link.name}
                    </NavItem>
                )
                )}
            </div>
            <Flex
                w={'100%'}
                flexDir={'column'}>
                {/* <NavItem
                    icon={IoIosNotificationsOutline}
                    path={`/notifications`}
                >
                    {t('notifications')}
                </NavItem>
                */}

                <Divider color={'#EAECF0'} width={'250px'} alignSelf={'center'} />
                <HStack width={'100%'} align={'center'} justify={'space-between'} p={5}>

                    <Icon onClick={() => {
                        signOut(auth).then(() => {
                            setUser()
                        })
                    }} as={FiLogOut} boxSize={6} color={'#667085'} _hover={{ color: "teal", cursor: 'pointer' }} />

                    <Text fontSize={'12px'}>{UserState.value.data?.email}</Text>
                </HStack>
            </Flex>
        </Box>
    );
};

const NavItem = ({ icon, children, path, isActive, id, ...rest }) => {


    return (
        <Link
            href={`${path}`}
            style={{ textDecoration: "none", fontSize: "14px", fontWeight: "300", height: '40px' }}
            _focus={{ boxShadow: "none" }}
        >
            <Flex
                align="center"
                p="2"
                my="1"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    color: "teal",
                }}
                fontSize={'16px'}
                fontWeight={'500'}
                color={isActive ? "teal" : '#344054'}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        _groupHover={{
                            color: "teal",
                        }}
                        boxSize={5}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ onOpen, ...rest }) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={"white"}
            borderBottomWidth="1px"
            borderBottomColor={"gray.200"}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Logo />
        </Flex>
    );
};
