import Link from "next/link"
import { Message } from "@/icons"
import { UserAvatar } from "./user"
import { Notification } from "./notification"

interface UserWidgetProps {
  userId?: string
  groupId: string
  image: string
}
export const UserWidget = ({ userId, groupId, image }: UserWidgetProps) => {
  return (
    <div className="gap-5 items-center hidden md:flex">
      <Notification />
      <Link href={`/group/${groupId}/messages`}>
        <Message />
      </Link>
      <UserAvatar userId={userId} groupId={groupId} image={image} />
    </div>
  )
}
