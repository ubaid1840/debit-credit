import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import HomePage from "@/components/landingpage/Home";

export default function Home() {
  return (
  <>
  <Header />
  <HomePage />
  </>
  );
}
