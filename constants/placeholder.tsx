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
import { v4 } from "uuid"

export type CreateGroupPlaceholderProps = {
  id: string
  label: string
  icon: JSX.Element
}

export const CREATE_GROUP_PLACEHOLDER: CreateGroupPlaceholderProps[] = [
  {
    id: v4(),
    label: "Highly engaging",
    icon: <MegaPhone />,
  },
  {
    id: v4(),
    label: "Easy to setup",
    icon: <Heart />,
  },
  {
    id: v4(),
    label: "Group chat and posts",
    icon: <Chat />,
  },
  {
    id: v4(),
    label: "Students can create teams within Groups",
    icon: <Grid />,
  },
  {
    id: v4(),
    label: "Gamification",
    icon: <Document />,
  },
  {
    id: v4(),
    label: "Host unlimited courses",
    icon: <Courses />,
  },
  {
    id: v4(),
    label: "White-labeling options",
    icon: <WhiteLabel />,
  },
]
