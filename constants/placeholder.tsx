import {
  Chat,
  Courses,
  Document,
  Grid,
  Heart,
  MegaPhone,
  WhiteLabel,
} from "@/icons"
import { JSX } from "react"

export type CreateGroupPlaceholderProps = {
  id: string
  label: string
  icon: JSX.Element
}

export const CREATE_GROUP_PLACEHOLDER: CreateGroupPlaceholderProps[] = [
  {
    id: `${Math.random() * 1000}`,
    label: "Highly engaging",
    icon: <MegaPhone />,
  },
  {
    id: `${Math.random() * 1000}`,
    label: "Easy to setup",
    icon: <Heart />,
  },
  {
    id: `${Math.random() * 1000}`,
    label: "Group chat and posts",
    icon: <Chat />,
  },
  {
    id: `${Math.random() * 1000}`,
    label: "Students can create teams within Groups",
    icon: <Grid />,
  },
  {
    id: `${Math.random() * 1000}`,
    label: "Gamification",
    icon: <Document />,
  },
  {
    id: `${Math.random() * 1000}`,
    label: "Host unlimited courses",
    icon: <Courses />,
  },
  {
    id: `${Math.random() * 1000}`,
    label: "White-labeling options",
    icon: <WhiteLabel />,
  },
]
