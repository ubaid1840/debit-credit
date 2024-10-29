import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import HomePage from "@/components/landingpage/Home";
import Head from "next/head";

export default function Home() {
  return (
  <>
  <Head>
			<link rel='icon' href='/favicon.ico' />
		</Head>
  <Header />
  <HomePage />
  </>
  );
}
