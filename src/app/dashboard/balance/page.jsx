"use client";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css"; 
import "primeicons/primeicons.css"; 
import Sidebar from "@/components/sidebar";
import GetLinkItems from "@/utils/SidebarItems";
import { GetValueAll } from "@/config/functions";
import Loading from "@/app/loading";

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function calculateTotals(transactions) {
    return Object.values(
      transactions.reduce((acc, transaction) => {
        const { account, name, title, type, amount } = transaction;
        if (!acc[account]) {
          acc[account] = {
            account,
            name,
            title,
            totalDebit: 0,
            totalCredit: 0,
          };
        }
        if (type === "Debit") {
          acc[account].totalDebit += amount;
        } else if (type === "Credit") {
          acc[account].totalCredit += amount;
        }

        return acc;
      }, {})
    );
  }

  async function fetchData() {
    GetValueAll("record").then((val) => {
      setLoading(false);
      if (val.type) {
        const result = calculateTotals(val.data);
        setTransactions(result);
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

  return (
    <Sidebar LinkItems={GetLinkItems("dashboard")}>
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
            Balance List
          </Heading>

          <Box bg={"white"} borderRadius="lg" boxShadow="md" p={8}>
            <Table variant="simple" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Bank</Th>
                  <Th>Account</Th>
                  <Th>Title</Th>
                  <Th>Totle Credit</Th>
                  <Th>Totle Debit</Th>
                  <Th>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <Tr key={transaction.id}>
                      <Td>{transaction.name}</Td>
                      <Td>{transaction.account}</Td>
                      <Td>{transaction.title}</Td>
                      <Td>{transaction.totalCredit}</Td>
                      <Td>{transaction.totalDebit}</Td>
                      <Td>
                        {transaction.totalCredit - transaction.totalDebit}
                      </Td>
                      {/* <Td>{transaction.madeBy}</Td> */}
                    </Tr>
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
      )}
    </Sidebar>
  );
}
