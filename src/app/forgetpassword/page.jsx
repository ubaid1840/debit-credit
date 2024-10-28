"use client";
import Button from "@/components/ui/Button";
import useCheckSession from "@/config/checkSession";
import { auth } from "@/config/firebase";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const checkSession = useCheckSession();

  useEffect(() => {
    checkSession();
  }, []);

  const handleForgetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        toast({
          title: "Success",
          description: "Check email for password reset",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((e) => {
        setLoading(false)
        toast({
          title: "Failed",
          description: e.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={"gray.100"}
      color={"gray.800"}
    >
      <Box
        maxW="md"
        w="full"
        p={8}
        mx="auto"
        borderRadius="lg"
        bg={"white"}
        boxShadow="lg"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={6} color={"teal.600"}>
          Reset Password
        </Heading>
        <Stack spacing={5}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="teal.400"
              bg={"gray.50"}
              color={"gray.800"}
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>
          <Button
            isLoading={loading}
            colorScheme="teal"
            variant="solid"
            onClick={() => {
              setLoading(true);
              handleForgetPassword();
            }}
            size="lg"
            fontSize="md"
          >
            Send Reset Link
          </Button>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Remembered your password?{" "}
            <Button as={Link} href="/login" variant="link" color="teal.500">
              Log in
            </Button>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default ForgetPassword;
