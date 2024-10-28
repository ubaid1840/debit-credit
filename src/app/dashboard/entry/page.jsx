"use client";
import {
  Box,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
  useColorModeValue,
  useToast,
  HStack,
  VStack,
  Spinner,
  Textarea,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css"; 
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";
import Button, { GhostButton } from "@/components/ui/Button";
import { AddValue, DeleteValue, GetValueAll } from "@/config/functions";
import Loading from "@/app/loading";
import moment from "moment";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { UserContext } from "@/store/context/UserContext";

const TransactionEntry = () => {
  const [transactionType, setTransactionType] = useState("Credit");
  const [bankAccount, setBankAccount] = useState({
    name: "",
    account: "",
    title: "",
  });
  const [allBanks, setAllbanks] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const {state : UserState} = useContext(UserContext)

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    GetValueAll("banks").then((val) => {
      setLoading(false);
      if (val.type) {
        setAllbanks(val.data);
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
    setAmount("");
    setNote("");
  }

  const handleAddTransaction = () => {
    AddValue("record", {
      type: transactionType,
      name: bankAccount.name,
      account: bankAccount.account,
      note: note,
      date: new Date(date).getTime(),
      amount: Number(amount),
      title: bankAccount.title,
      madeBy : UserState.value.data.email
    }).then((val) => {
      setLoading(false);
      if (val.type) {
        clearAll();
        setTransactions((prevState) => {
          const newState = [...prevState];
          newState.push({
            type: transactionType,
            name: bankAccount.name,
            account: bankAccount.account,
            note: note,
            date: new Date(date).getTime(),
            id: val.data.id,
            amount: Number(amount),
            title: bankAccount.title,
            madeBy : UserState.value.data.email
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

  const handleDeleteTransaction = (tId) => {
    DeleteValue("record", tId).then((val) => {
      setLoading(false);
      if (val.type) {
        setTransactions(transactions.filter((item) => item.id !== tId));
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

  async function fetchBalance(val, startingBalance) {
    getDocs(query(collection(db, "record"), where("account", "==", val)))
      .then((snapshot) => {
        let list = [];
        snapshot.forEach((docs) => {
          list.push({ ...docs.data(), id: docs.id });
        });
        setBalanceLoading(false);
        if (list.length > 0) {
          let totalCredit = 0;
          let totalDebit = 0;
          list.map((item) => {
            if (item.type == "Debit") {
              totalDebit = totalDebit + Number(item.amount);
            }
            if (item.type == "Credit") {
              totalCredit = totalCredit + Number(item.amount);
            }
          });
          setBalance(startingBalance + totalCredit - totalDebit);
        }
      })
      .catch(() => {
        setBalanceLoading(false);
      });
  }

  async function handleEditEntry() {
    updateDoc(doc(db, "record", selectedRecord.id), {
      amount: Number(selectedRecord.amount),
      date: new Date(selectedRecord.date).getTime(),
      type: selectedRecord.type,
      note: selectedRecord.note,
      title : selectedRecord.title,
      name : selectedRecord.name,
      account : selectedRecord.account
    })
      .then(() => {
        setLoading(false);
        onClose();
        toast({
          title: "Success",
          description: "Enter edit succeessful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        let filterItems = [];

        transactions.map((item) => {
          if (item.id !== selectedRecord.id) {
            filterItems.push(item);
          }
        });
        filterItems.push(selectedRecord);
        setTransactions([...filterItems]);
      })
      .catch((e) => {
        setLoading(false);
        toast({
          title: "Failed",
          description: e.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }
  return (
    <Sidebar LinkItems={GetLinkItems("dashboard")}>
      {loading ? (
        <Loading />
      ) : (
        <Box
          minH="100vh"
          p={8}
          bg={"gray.100"}
          color={"gray.800"}
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
        >
          <Heading
            as="h1"
            size="xl"
            mb={8}
            textAlign="center"
            color={"teal.600"}
          >
            Transaction Entry
          </Heading>

          <Box
            w={"100%"}
            bg={"white"}
            borderRadius="lg"
            boxShadow="md"
            p={8}
            mb={8}
          >
            <Stack spacing={4}>
            <VStack align={"flex-start"} gap={1} w={"100%"}>
                <Text fontSize={"14px"}>Date</Text>
                <Box
                  border={"1px solid"}
                  borderColor={"#e2e8f0"}
                  rounded={4}
                  height={"40px"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  px={"10px"}
                  w={"100%"}
                >
                  <Calendar
                    style={{ width: "100%" }}
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    placeholder="Select Date"
                    dateFormat="mm/dd/yy"
                    showIcon
                  />
                </Box>
              </VStack>
              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Bank title</Text>
                <Select
                  isDisabled={allBanks.length === 0}
                  value={bankAccount.account}
                  onChange={(e) => {
                    if(e.target.value){
                      const temp = allBanks.filter(
                        (item) => item.account === e.target.value
                      );
                      setBalanceLoading(true);
                      fetchBalance(temp[0].account, temp[0].initial);
                      setBankAccount({
                        name: temp[0].name,
                        account: temp[0].account,
                        title: temp[0].title,
                      });
                    } else {
                      setBankAccount({account : "", name : "", title: ""})
                    }
                   
                  }}
                >
                  <option value={""}>{"Select bank title"}</option>
                  {allBanks.map((eachBank, index) => (
                    <option key={index} value={eachBank.account}>
                      {eachBank.title}
                    </option>
                  ))}
                </Select>
              </VStack>

              {bankAccount.account && (
                <>
                  <VStack align={"flex-start"} gap={1}>
                    <Text fontSize={"14px"}>Bank name</Text>
                    <Input value={bankAccount.name} onChange={(e) => {}} />
                  </VStack>

                  <VStack align={"flex-start"} gap={1}>
                    <Text fontSize={"14px"}>Bank account#</Text>
                    <Input value={bankAccount.account} onChange={(e) => {}} />
                  </VStack>

                  <VStack align={"flex-start"} gap={1}>
                    <Text fontSize={"14px"}>Total Balance</Text>
                    {balanceLoading ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <Input value={balance} onChange={(e) => {}} />
                    )}
                  </VStack>
                </>
              )}

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Amount</Text>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </VStack>

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Debit / Credit</Text>
                <Select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  placeholder="Select transaction type"
                >
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </Select>
              </VStack>

             

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Note</Text>
                <Textarea
                  height={"140px"}
                  resize={"none"}
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </VStack>

              <Button
                isDisabled={
                  !note ||
                  !transactionType ||
                  !date ||
                  !bankAccount.account ||
                  !amount
                }
                colorScheme="teal"
                onClick={() => {
                  setLoading(true);
                  handleAddTransaction();
                }}
              >
                Add Transaction
              </Button>
            </Stack>
          </Box>

          <Box
            bg={"white"}
            borderRadius="lg"
            boxShadow="md"
            p={8}
            width={"100%"}
            overflowX={"auto"}
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Transaction List
            </Text>
            <Table variant="simple" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Bank</Th>
                  <Th>Account</Th>
                  <Th>Title</Th>
                  <Th>Amount</Th>
                  <Th>Type</Th>
                  <Th>Made By</Th>
                  <Th>Date</Th>
                  <Th>Note</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions
                  .sort((a, b) => b.date - a.date)
                  .map((transaction) => (
                    <Tr key={transaction.id}>
                      <Td>{transaction.name}</Td>
                      <Td>{transaction.account}</Td>
                      <Td>{transaction.title}</Td>
                      <Td>{transaction.amount}</Td>
                      <Td>{transaction.type}</Td>
                      <Td>{transaction.madeBy}</Td>
                      <Td>
                        {moment(new Date(transaction.date)).format(
                          "DD/MM/YYYY"
                        )}
                      </Td>
                      <Td>{transaction.note}</Td>
                      <Td>
                        <Stack direction="row" spacing={2}>
                          <IconButton
                            icon={<FaEdit />}
                            colorScheme="blue"
                            variant="outline"
                            aria-label="Edit Transaction"
                            onClick={() => {
                              onOpen();
                              setSelectedRecord(transaction);
                            }}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            colorScheme="red"
                            variant="outline"
                            aria-label="Delete Transaction"
                            onClick={() => {
                              setLoading(true);
                              handleDeleteTransaction(transaction.id);
                            }}
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
              Edit Entry
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Bank Title</Text>
                <Select
                  isDisabled={allBanks.length === 0 || !selectedRecord}
                  value={selectedRecord?.account}
                  onChange={(e) => {
                    const temp = allBanks.filter(
                      (item) => item.account === e.target.value
                    );
                    setSelectedRecord((prevState) => ({
                      ...prevState,
                      name: temp[0].name,
                      account: temp[0].account,
                      title: temp[0].title,
                    }));
                  }}
                >
                  <option value={""}>{"Select bank title"}</option>
                  {allBanks.map((eachBank, index) => (
                    <option key={index} value={eachBank.account}>
                      {eachBank.title}
                    </option>
                  ))}
                </Select>
              </VStack>

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Bank name</Text>
                <Input
                  isDisabled
                  value={selectedRecord?.name}
                  onChange={(e) => {}}
                />
              </VStack>

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Bank account#</Text>
                <Input
                  isDisabled
                  value={selectedRecord?.account}
                  onChange={(e) => {}}
                />
              </VStack>

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Amount</Text>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={selectedRecord?.amount}
                  onChange={(e) =>
                    setSelectedRecord((prevState) => ({
                      ...prevState,
                      amount: e.target.value,
                    }))
                  }
                />
              </VStack>

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Debit / Credit</Text>
                <Select
                  value={selectedRecord?.type}
                  onChange={(e) =>
                    setSelectedRecord((prevState) => ({
                      ...prevState,
                      type: e.target.value,
                    }))
                  }
                  placeholder="Select transaction type"
                >
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </Select>
              </VStack>

              <VStack align={"flex-start"} gap={1} w={"100%"}>
                <Text fontSize={"14px"}>Date</Text>
                <Box
                  border={"1px solid"}
                  borderColor={"#e2e8f0"}
                  rounded={4}
                  height={"40px"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  px={"10px"}
                  w={"100%"}
                >
                  <Calendar
                    style={{ width: "100%" }}
                    value={
                      selectedRecord?.date ? new Date(selectedRecord?.date) : ""
                    }
                    onChange={(e) =>
                      setSelectedRecord((prevState) => ({
                        ...prevState,
                        tyle: e.value.getTime(),
                      }))
                    }
                    placeholder="Select Date"
                    dateFormat="dd/mm/yy"
                    showIcon
                  />
                </Box>
              </VStack>

              <VStack align={"flex-start"} gap={1}>
                <Text fontSize={"14px"}>Note</Text>
                <Textarea
                  height={"140px"}
                  resize={"none"}
                  placeholder="Note"
                  value={selectedRecord?.note}
                  onChange={(e) =>
                    setSelectedRecord((prevState) => ({
                      ...prevState,
                      note: e.target.value,
                    }))
                  }
                />
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <GhostButton onClick={onClose}>Cancel</GhostButton>
              <Button
                colorScheme="teal"
                onClick={() => {
                  setLoading(true);
                  onClose();
                  handleEditEntry();
                }}
                ml={3}
              >
                Edit & Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Sidebar>
  );
};

export default TransactionEntry;
