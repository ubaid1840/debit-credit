"use client";
import Loading from "@/app/loading";
import Sidebar from "@/components/sidebar";
import Button from "@/components/ui/Button";
import { AddValue, DeleteValue, GetValueAll } from "@/config/functions";
import GetLinkItems from "@/utils/SidebarItems";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Text,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const cancelRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    GetValueAll("users").then((val) => {
      if (val.type) {
        setUsers(val.data);
      } else {
        toast({
          title: "Failed",
          description: val.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    });
  }

  const handleAddUser = () => {

    const temp = users.filter((item)=> item.email.toLowerCase() === newUser.email.toLowerCase())
    if(temp.length > 0){
      setLoading(false)
      toast({
        title: "Failed",
        description: "User already exists",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      AddValue("users", {
        name: newUser.name,
        email: newUser.email.toLowerCase(),
        role: "admin",
      }).then((val) => {
        setLoading(false);
        if (val.type) {
          setUsers((prevState) => {
            const newState = [...prevState];
            newState.push({ ...newUser, id: val.data.id });
            return newState;
          });
          toast({
            title: "Success",
            description: val.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Failed",
            description: val.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
    }

   
  };

  const handleDeleteUser = (userId) => {

    DeleteValue("users", userId).then((val) => {
      setLoading(false)
      if (val.type) {
        setUsers(users.filter((user) => user.id !== userId));
        toast({
          title: "Success",
          description: val.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Failed",
          description: val.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    });
  };

  return (
    <Sidebar LinkItems={GetLinkItems("superadmin")}>
      {loading ? (
        <Loading />
      ) : (
        <Box
          minH="100vh"
          p={8}
          bg={"gray.100"}
          color={"gray.800"}
        >
          <Heading
            as="h1"
            size="xl"
            mb={8}
            textAlign="center"
            color={"teal.600"}
          >
            User Management
          </Heading>

          <Box
            bg={"white"}
            borderRadius="lg"
            boxShadow="md"
            p={8}
            overflowX={"auto"}
          >
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              mb={6}
            >
              <Text fontSize="lg" fontWeight="bold">
                User List
              </Text>
              <Button
                colorScheme="teal"
                leftIcon={<FaPlus />}
                onClick={() => {
                  setNewUser({ email: "", name: "" });
                  onOpen();
                }}
              >
                Add User
              </Button>
            </Stack>

            <Table variant="simple" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Stack direction="row" spacing={2}>
                        <IconButton
                          icon={<FaTrash />}
                          colorScheme="red"
                          variant="outline"
                          aria-label="Delete User"
                          onClick={() => {
                            setLoading(true)
                            handleDeleteUser(user.id)}}
                        />
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add New User
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack align={"flex-start"} gap={2}>
                <Text>Name</Text>
                <Input
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                />
                <Text>Email</Text>
                <Input
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prevState) => ({
                      ...prevState,
                      email: e.target.value,
                    }))
                  }
                />
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="teal"
                onClick={() => {
                  setLoading(true);
                  onClose()
                  handleAddUser();
                }}
                ml={3}
              >
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Sidebar>
  );
}
