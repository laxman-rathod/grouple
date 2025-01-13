import { v4 } from "uuid"

interface IconListProps {
  icon: string
  id: string
}

export const ICON_LIST: IconListProps[] = [
  {
    id: v4(),
    icon: "general",
  },
  {
    id: v4(),
    icon: "announcement",
  },
]
