"use client";
import Button from "@/components/ui/Button";
import useCheckSession from "@/config/checkSession";
import { auth, db } from "@/config/firebase";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const checkSession = useCheckSession()

  useEffect(() => {
      checkSession()
  }, [])

  async function handleSignUp() {
    if(email === 'superadmin@gmail.com'){
      setLoading(false)
      toast({
        title: "Failed",
        description: "Cannot signup superadmin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      await getDocs(query(collection(db, "users"), where("email", "==", email)))
      .then((snapshot) => {
        let list = [];
        snapshot.forEach((docs) => {
          list.push(docs.data());
        });
        if (list.length > 0) {
          createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            setLoading(false)
            toast({
              title: "Success",
              description: "Welcome to money manager",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          
              router.push("/dashboard");
            
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
        } else {
          setLoading(false)
          toast({
            title: "Failed",
            description: "User already exists",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
         
        }
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
    }
  
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.100", "gray.800")}
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
          Create an Account
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
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="teal.400"
              bg={"gray.50"}
              color={"gray.800"}
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>
          <FormControl id="confirm-password">
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              focusBorderColor="teal.400"
              bg={"gray.50"}
              color={"gray.800"}
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>
          <Button
            isDisabled={
              !email ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword
            }
            isLoading={loading}
            colorScheme="teal"
            variant="solid"
            onClick={() => {
              setLoading(true);
              handleSignUp();
            }}
            size="lg"
            fontSize="md"
          >
            Sign Up
          </Button>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Already have an account?{" "}
            <Button as={Link} href="/login" variant="link" color="teal.500">
              Sign In
            </Button>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default SignUp;
