"use client"
import UserContextProvider from "@/store/context/UserContext"
import { ChakraProvider } from "@chakra-ui/react"
import { PrimeReactProvider } from 'primereact/api'

export default function Providers({ children }) {

    return (
        <PrimeReactProvider>
            <ChakraProvider >
                <UserContextProvider>
                    {children}
                </UserContextProvider>
            </ChakraProvider>
        </PrimeReactProvider>
    )
}