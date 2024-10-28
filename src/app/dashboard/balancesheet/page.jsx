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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TransactionFilter = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allBanks, setAllbanks] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [bankAccount, setBankAccount] = useState({
    name: "",
    account: "",
    title: "",
  });

  useEffect(() => {
    fetchBanks();
  }, []);

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

  async function handleFilter() {
    GetValueAll(
      "record",
      moment(new Date(startDate)).startOf("day").valueOf(),
      moment(new Date(endDate)).endOf("day").valueOf(),
      bankAccount.name,
      bankAccount.account
    ).then((val) => {
      setLoading(false);
      if (val.type) {
        console.log(val.data);
        const temp = [...val.data];
        temp.sort((a, b) => a.date - b.date);
        let startingBalance = allBanks.filter(
          (item) => item.account === bankAccount.account
        )[0].initial;
        let finalData = [];
        temp.map((item) => {
          finalData.push({
            ...item,
            balance:
              item.type == "Credit"
                ? startingBalance + item.amount
                : startingBalance - item.amount,
          });
          startingBalance = finalData[0].balance;
        });
        console.log(finalData);
        setTransactions([...finalData]);
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

  const RenderEachRow = ({ transaction }) => {
    return (
      <Tr key={transaction.id}>
        <Td>{moment(new Date(transaction?.date)).format("DD/MM/YYYY")}</Td>
        <Td>{transaction?.type}</Td>
        <Td>{transaction?.note}</Td>
        <Td>{transaction?.amount}</Td>
        <Td>{transaction?.balance}</Td>
      </Tr>
    );
  };

  return (
    <Sidebar LinkItems={GetLinkItems("dashboard")}>
      <Box minH="100vh" p={8} bg={"gray.100"} color={"gray.800"}>
        <Heading as="h1" size="xl" mb={8} textAlign="center" color={"teal.600"}>
          Balance Sheet
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
                  if (e.target.value) {
                    const temp = allBanks.filter(
                      (item) => item.account === e.target.value
                    );
                    setBankAccount({
                      name: temp[0].name,
                      account: temp[0].account,
                      title: temp[0].title,
                    });
                  } else {
                    setBankAccount({
                      name: "",
                      account: "",
                      title: "",
                    });
                  }
                }}
              >
                <option value={""}>{"Select Bank Title"}</option>
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
              isDisabled={allBanks.length === 0 || !bankAccount.account}
              colorScheme="teal"
              onClick={() => {
                setTransactions([]);
                setLoading(true);
                handleFilter();
              }}
            >
              Show balance sheet
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
              Balance List
            </Text>
            <Spacer />
            <Button
              isDisabled={transactions.length === 0}
              onClick={() => {
                const finalData = [];
                transactions.map((item) => {
                  finalData.push({
                    ...item,
                    debit: item.type === "Debit" ? "Debit" : "",
                    credit: item.type === "Credit" ? "Credit" : "",
                  });
                });
                generatePDF(finalData, bankAccount, startDate, endDate, allBanks.filter((item)=> item.account === transactions[0].account)[0].initial);
              }}
            >
              Export to PDF
            </Button>
          </HStack>
          <Table variant="simple" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Note</Th>
                <Th>Amount</Th>
                <Th>Balance</Th>
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
    </Sidebar>
  );
};

const generatePDF = (transactions, bank, start, end, startingBalance) => {
  const bankDetails = {
    title: bank.title,
    name: bank.name,
    account: bank.account,
    startDate: moment(new Date(start)).format("DD/MM/YYYY"),
    endDate: moment(new Date(end)).format("DD/MM/YYYY"),
  };

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Adding a header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(bankDetails.title, pageWidth / 2, 15, { align: "center" });

  // Bank information
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Bank Name: ${bankDetails.name}`, 10, 30);
  doc.text(`Account Number: ${bankDetails.account}`, 10, 40);
  doc.text(`Start Date: ${bankDetails.startDate}`, 10, 50);
  doc.text(`End Date: ${bankDetails.endDate}`, 10, 60);
  doc.text(`Starting Balance: ${startingBalance}`, 10, 70);

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(10, 75, pageWidth - 10, 75);

  // Prepare table data
  const tableColumns = ["Date", "Note", "Debit", "Credit", "Amount", "Balance"];
  const tableRows = transactions.map(({ date, note, debit, credit, amount, balance }) => [
    moment(new Date(date)).format("DD/MM/YYYY"),
    note,
    debit ? debit : "-",
    credit ? credit : "-",
    amount.toFixed(2),
    balance.toFixed(2),
  ]);

  // Add table with enhanced styling
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 80,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontSize: 12 },
    bodyStyles: { fontSize: 10, cellPadding: 3 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: 10, right: 10 },
    styles: { overflow: "linebreak", cellPadding: 2, halign: "center" },
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: "right" });
  }

  // Save the PDF with a nice filename
  doc.save(`Bank_Statement_${bankDetails.name}_${bankDetails.startDate}-${bankDetails.endDate}.pdf`);
};

export default TransactionFilter;
