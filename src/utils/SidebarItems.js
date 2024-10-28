"use client"
import { BsBuildings, BsClipboardCheck } from "react-icons/bs";
import { GoGraph, GoPeople } from "react-icons/go";
import { PiSuitcaseThin } from "react-icons/pi";
import { CiCalendar, CiClock2, CiHeart, CiStar, CiViewTable } from "react-icons/ci";
import { PiHandCoins } from "react-icons/pi";
import { BiPieChartAlt2, BiMessageRoundedDetail } from "react-icons/bi";
import { FaFile, FaRegFileAlt } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { IoMdBook } from "react-icons/io";
import { RiFirstAidKitLine, RiHome2Line } from "react-icons/ri";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { usePathname } from "next/navigation";

const GetLinkItems = (role) => {
    const pathname = usePathname()
    switch (role) {
        case 'superadmin':
            return [
                {
                    name: "User Management",
                    icon: GoPeople,
                    path: `/superadmin/usermanagement`,
                },
                {
                    name: "Bank Management",
                    icon: BsBuildings,
                    path: `/superadmin/bankmanagement`,
                },

            ];
            case 'dashboard':
            return [
                {
                    name: "New Entry",
                    icon: BsClipboardCheck,
                    path: `/dashboard/entry`,
                },
                {
                    name: "Record",
                    icon: GoGraph,
                    path: `/dashboard/record`,
                },
                {
                    name: "Balance Sheet",
                    icon: FaRegFileAlt,
                    path: `/dashboard/balancesheet`,
                },
                {
                    name: "Balance List",
                    icon: GiSettingsKnobs,
                    path: `/dashboard/balancelist`,
                },
            ];
            
        default:
            return [];
    }
};

export default GetLinkItems;
