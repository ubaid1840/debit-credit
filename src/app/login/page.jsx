"use client";
import Button from '@/components/ui/Button';
import useCheckSession from '@/config/checkSession';
import { auth } from '@/config/firebase';
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
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const checkSession = useCheckSession()

  useEffect(() => {
      checkSession()
  }, [])

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(()=>{
      setLoading(false)
      toast({
        title: "Success",
        description: "Welcome back to money manager",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if(email === 'superadmin@gmail.com'){
          router.push("/superadmin")
      } else {
        router.push("/dashboard")
      }
    }).catch((e)=>{
      setLoading(false)
      toast({
        title: "Failed",
        description: e.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    })
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={'gray.100'}
      color={'gray.800'}
    >
      <Box
        maxW="md"
        w="full"
        p={8}
        mx="auto"
        borderRadius="lg"
        bg={'white'}
        boxShadow="lg"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={6} color={'teal.600'}>
          Welcome Back
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
              bg={'gray.50'}
              color={'gray.800'}
              _placeholder={{ color: 'gray.500' }}
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
              bg={'gray.50'}
              color={'gray.800'}
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>
          <Button
          isLoading={loading}
          isDisabled={!email || !password}
            colorScheme="teal"
            variant="solid"
            onClick={()=>{
              setLoading(true)
              handleLogin()
            }}
            size="lg"
            fontSize="md"
          >
            Sign In
          </Button>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Don’t have an account? <Button as={Link} href="/signup" variant="link" color="teal.500">Sign up</Button>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
