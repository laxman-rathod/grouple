import {
  AffiliateDuoToneBlack,
  Buisness,
  Chat,
  Courses,
  CreditCard,
  Document,
  Explore,
  GlobeDuoToneBlack,
  Home,
  IDuotoneBlack,
  PersonalDevelopment,
  ZapDouToneBlack,
} from "@/icons"
import { JSX } from "react"

export type MenuProps = {
  id: number
  label: string
  icon: JSX.Element
  path: string
  section?: boolean
  integration?: boolean
}

export type GroupMenuProps = {
  id: number
  label: string
  icon: JSX.Element
  path: string
}

export const LANDING_PAGE_MENU: MenuProps[] = [
  {
    id: Math.random() * 1000,
    label: "Home",
    icon: <Home />,
    path: "/",
    section: true,
  },
  {
    id: Math.random() * 1000,
    label: "Pricing",
    icon: <CreditCard />,
    path: "#pricing",
    section: true,
  },
  {
    id: Math.random() * 1000,
    label: "Explore",
    icon: <Explore />,
    path: "/explore",
  },
]
export const GROUP_PAGE_MENU: MenuProps[] = [
  {
    id: Math.random() * 1000,
    label: "Group",
    icon: <Home />,
    path: "/",
    section: true,
  },
  {
    id: Math.random() * 1000,
    label: "Courses",
    icon: <Courses />,
    path: "#pricing",
    section: true,
  },
  {
    id: Math.random() * 1000,
    label: "Events",
    icon: <Buisness />,
    path: "/explore",
  },
  {
    id: Math.random() * 1000,
    label: "Members",
    icon: <PersonalDevelopment />,
    path: "/explore",
  },
  {
    id: Math.random() * 1000,
    label: "About",
    icon: <Document />,
    path: "/explore",
  },
  {
    id: Math.random() * 1000,
    label: "Huddle",
    icon: <Chat />,
    path: "/explore",
  },
]

export const SIDEBAR_SETTINGS_MENU: MenuProps[] = [
  {
    id: Math.random() * 1000,
    label: "General",
    icon: <IDuotoneBlack />,
    path: "",
  },
  {
    id: Math.random() * 1000,
    label: "Subscriptions",
    icon: <CreditCard />,
    path: "subscriptions",
  },
  {
    id: Math.random() * 1000,
    label: "Affiliates",
    icon: <AffiliateDuoToneBlack />,
    path: "affiliates",
  },
  {
    id: Math.random() * 1000,
    label: "Domain Config",
    icon: <GlobeDuoToneBlack />,
    path: "domains",
  },
  {
    id: Math.random() * 1000,
    label: "Integration",
    icon: <ZapDouToneBlack />,
    path: "integrations",
    integration: true,
  },
]

type IntegrationsListItemProps = {
  id: string
  name: "stripe"
  logo: string
  description: string
  title: string
  modalDescription: string
}

export const INTEGRATION_LIST_ITEMS: IntegrationsListItemProps[] = [
  {
    id: `${Math.random() * 1000}`,
    name: "stripe",
    description:
      "Stripe is the fastest and easiest way to integrate payments and financial services into your software platform or marketplace.",
    logo: "914be637-39bf-47e6-bb81-37b553163945",
    title: "Connect Stripe Account",
    modalDescription:
      "The world's most successful platforms and marketplaces including Shopify and DoorDash, use Stripe Connect.",
  },
]