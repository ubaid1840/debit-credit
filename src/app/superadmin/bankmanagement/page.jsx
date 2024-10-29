"use client";
import {
  Box,
  FormLabel,
  Heading,
  Input,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";
import Button from "@/components/ui/Button";
import { AddValue, DeleteValue, GetValueAll } from "@/config/functions";
import Loading from "@/app/loading";

export default function Page() {
  const [banks, setBanks] = useState([]);
  const [newBank, setNewBank] = useState({
    name: "",
    account: "",
    title: "",
    initial: "",
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    GetValueAll("banks").then((val) => {
      setLoading(false);
      if (val.type) {
        setBanks(val.data);
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

  function clearAll() {
    setNewBank({ account: "", name: "", title: "" });
  }
  const handleAddBank = () => {
    const temp = banks.filter((item) => {
      if (item.name == newBank.name && item.account == newBank.account) {
        return item;
      }
    });
    if (temp.length > 0) {
      setLoading(false);
      toast({
        title: "Failed",
        description: "Bakn with same account already exists",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      AddValue("banks", {
        name: newBank.name.toLocaleUpperCase(),
        account: newBank.account,
        title: newBank.title,
        initial: newBank.initial ? Number(newBank.initial) : 0,
      }).then((val) => {
        setLoading(false);
        if (val.type) {
          setBanks((prevState) => {
            const newState = [...prevState];
            newState.push({
              name: newBank.name.toLocaleUpperCase(),
              account: newBank.account,
              title: newBank.title,
              id: val.data.id,
              initial: newBank.initial ? Number(newBank.initial) : 0,
            });
            return newState;
          });
          toast({
            title: "Success",
            description: val.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          clearAll();
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

  const handleRemoveBank = (bankId) => {
    DeleteValue("banks", bankId).then((val) => {
      setLoading(false);
      if (val.type) {
        setBanks(banks.filter((item) => item.id !== bankId));
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
  };

  return (
    <Sidebar LinkItems={GetLinkItems("superadmin")}>
      {loading ? (
        <Loading />
      ) : (
        <Box minH="100vh" p={8} bg={"gray.100"} color={"gray.800"}>
          <Heading
            as="h1"
            size="xl"
            mb={8}
            textAlign="center"
            color={"teal.600"}
          >
            Manage Banks
          </Heading>

          <Box bg={"white"} borderRadius="lg" boxShadow="md" p={8} mb={8}>
            <Stack spacing={4}>
              <FormLabel>Add New Bank</FormLabel>
              <Input
                placeholder="Enter bank name"
                value={newBank.name}
                onChange={(e) =>
                  setNewBank((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Enter bank title"
                value={newBank.title}
                onChange={(e) =>
                  setNewBank((prevState) => ({
                    ...prevState,
                    title: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Enter bank account number"
                value={newBank.account}
                onChange={(e) =>
                  setNewBank((prevState) => ({
                    ...prevState,
                    account: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Enter starting balance"
                type="number"
                value={newBank.initial}
                onChange={(e) =>
                  setNewBank((prevState) => ({
                    ...prevState,
                    initial: e.target.value,
                  }))
                }
              />
              <Button
                isDisabled={!newBank.account || !newBank.name || !newBank.title}
                colorScheme="teal"
                onClick={() => {
                  setLoading(true);
                  handleAddBank();
                }}
              >
                Add Bank
              </Button>
            </Stack>
          </Box>

          <Box bg={"white"} borderRadius="lg" boxShadow="md" p={8}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Existing Banks
            </Text>
            {banks.length > 0 ? (
              <Table variant="simple" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Bank Name</Th>
                    <Th>Account#</Th>
                    <Th>Title</Th>
                    <Th>Starting Balance</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {banks.map((bank, index) => (
                    <Tr key={index}>
                      <Td>{bank.name}</Td>
                      <Td>{bank.account}</Td>
                      <Td>{bank.title}</Td>
                      <Td>{bank.initial}</Td>
                      <Td>
                        <IconButton
                          aria-label="Delete Bank"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => {
                            setLoading(true);
                            handleRemoveBank(bank.id);
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No banks added yet.</Text>
            )}
          </Box>
        </Box>
      )}
    </Sidebar>
  );
}
