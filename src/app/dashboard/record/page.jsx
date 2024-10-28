"use client";
import {
  Box,
  FormLabel,
  Heading,
  Stack,
  Text,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Spacer,
  useToast,
  VStack,
  Input,
  Spinner,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Textarea,
} from "@chakra-ui/react";
import { Calendar } from "primereact/calendar";
import { useEffect, useRef, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";
import Button, { GhostButton } from "@/components/ui/Button";
import moment from "moment";
import { DeleteValue, GetValueAll } from "@/config/functions";
import {
  and,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { FaEdit, FaTrash } from "react-icons/fa";

const TransactionFilter = () => {
  const [transactions, setTransactions] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allBanks, setAllbanks] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();
  const cancelRef = useRef(null);
  const [bankAccount, setBankAccount] = useState({
    name: "",
    account: "All",
    title: "",
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleFilter = () => {
    fetchData();
  };

  async function handleFilterAll() {
    getDocs(
      query(
        collection(db, "record"),
        and(
          where(
            "date",
            ">=",
            moment(new Date(startDate)).startOf("day").valueOf()
          ),
          where("date", "<=", moment(new Date(endDate)).endOf("day").valueOf())
        )
      )
    )
      .then((snapshot) => {
        let list = [];
        snapshot.forEach((docs) => {
          list.push({ ...docs.data(), id: docs.id });
        });
        setLoading(false);
        setTransactions(list);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  async function fetchBanks() {
    GetValueAll("banks").then((val) => {
      setLoading(false);
      if (val.type) {
        const uniqueArray = Array.from(
          new Map(val.data.map((item) => [item.name, item])).values()
        );
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

  async function fetchData() {
    GetValueAll(
      "record",
      moment(new Date(startDate)).startOf("day").valueOf(),
      moment(new Date(endDate)).endOf("day").valueOf(),
      bankAccount.name,
      bankAccount.account
    ).then((val) => {
      setLoading(false);
      if (val.type) {
        setTransactions(val.data);
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

  function downloadCSV(data) {
    const headers =
      ["name", "account", "title", "type", "amount", "note", "date"].join(",") +
      "\n";
    const rows = data
      .map((row) => {
        const formattedDate = moment(new Date(row.date)).format("DD/MM/YY");
        return `"${row.name}","${row.account.toString()}","${row.title}","${
          row.type
        }","${row.amount}","${row.note}", ${formattedDate}`;
      })
      .join("\n");
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const RenderEachRow = ({ transaction }) => {
    const [rowLoading, setRowLoading] = useState(false);

    const handleDeleteTransaction = (tId) => {
      DeleteValue("record", tId).then((val) => {
        setRowLoading(false);
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

    return (
      <Tr key={transaction.id}>
        <Td>{transaction.name}</Td>
        <Td>{transaction.account}</Td>
        <Td>{transaction.title}</Td>
        <Td>{transaction.amount}</Td>
        <Td>{transaction.type}</Td>
        <Td>{transaction.madeBy}</Td>
        <Td>{moment(new Date(transaction.date)).format("DD/MM/YYYY")}</Td>
        <Td>{transaction.note}</Td>
        <Td>
          {rowLoading ? (
            <Spinner size={"sm"} />
          ) : (
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
                  setRowLoading(true);
                  handleDeleteTransaction(transaction.id);
                }}
              />
            </Stack>
          )}
        </Td>
      </Tr>
    );
  };

  return (
    <Sidebar LinkItems={GetLinkItems("dashboard")}>
      <Box minH="100vh" p={8} bg={"gray.100"} color={"gray.800"}>
        <Heading as="h1" size="xl" mb={8} textAlign="center" color={"teal.600"}>
          Transaction Filter
        </Heading>

        <Box bg={"white"} borderRadius="lg" boxShadow="md" p={8} mb={8}>
          <Stack spacing={4}>
            <VStack align={"flex-start"} gap={1} w={"100%"}>
              <Text fontSize={"14px"}>Start date</Text>
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  placeholder="Select Start Date"
                  dateFormat="mm/dd/yy"
                  showIcon
                />
              </Box>
            </VStack>
            <VStack align={"flex-start"} gap={1} w={"100%"}>
              <Text fontSize={"14px"}>End date</Text>
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
                  value={endDate}
                  onChange={(e) => setEndDate(e.value)}
                  placeholder="Select End Date"
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
                  if (e.target.value === "All") {
                    setBankAccount({ account: e.target.value });
                  } else {
                    const temp = allBanks.filter(
                      (item) => item.account === e.target.value
                    );
                    setBankAccount({
                      name: temp[0].name,
                      account: temp[0].account,
                      title: temp[0].title,
                    });
                  }
                }}
              >
                <option value={"All"}>{"All"}</option>
                {allBanks.map((eachBank, index) => (
                  <option key={index} value={eachBank.account}>
                    {eachBank.title}
                  </option>
                ))}
              </Select>
            </VStack>
            {bankAccount.account && bankAccount.account !== "All" && (
              <>
                <VStack align={"flex-start"} gap={1}>
                  <Text fontSize={"14px"}>Bank name</Text>
                  <Input value={bankAccount?.name} onChange={(e) => {}} />
                </VStack>

                <VStack align={"flex-start"} gap={1}>
                  <Text fontSize={"14px"}>Bank account#</Text>
                  <Input value={bankAccount?.account} onChange={(e) => {}} />
                </VStack>
              </>
            )}
            <Button
              isLoading={loading}
              isDisabled={allBanks.length === 0}
              colorScheme="teal"
              onClick={() => {
                setTransactions([]);
                if (bankAccount?.account === "All") {
                  setLoading(true);
                  handleFilterAll();
                } else {
                  setLoading(true);
                  handleFilter();
                }
              }}
            >
              Filter Records
            </Button>
          </Stack>
        </Box>

        <Box
          bg={"white"}
          borderRadius="lg"
          boxShadow="md"
          p={8}
          overflowX={"auto"}
        >
          <HStack w={"100%"}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Filtered Transaction List
            </Text>
            <Spacer />
            <Button onClick={() => downloadCSV(transactions)}>
              Export to CSV
            </Button>
          </HStack>
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
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <RenderEachRow key={index} transaction={transaction} />
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center">
                    No transactions found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

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
                    <option key={index} value={eachBank?.account}>
                      {eachBank?.title}
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
                >
                  <option value="">Select transaction type</option>
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
                isDisabled={!selectedRecord?.type}
                isLoading={loading}
                colorScheme="teal"
                onClick={() => {
                  setLoading(true);
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

export default TransactionFilter;
