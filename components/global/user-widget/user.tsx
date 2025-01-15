"use client"

import { supabaseClient } from "@/lib/utils"
import { onOffline } from "@/redux/slices/online-member-slice"
import { AppDispatch } from "@/redux/store"
import { useClerk } from "@clerk/nextjs"
import { useDispatch } from "react-redux"
import { DropDown } from "../drop-down"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Logout, Settings } from "@/icons"
import { Button } from "@/components/ui/button"

interface UserAvatarProps {
  image: string
  userId?: string
  groupId: string
}

export const UserAvatar = ({ image, userId, groupId }: UserAvatarProps) => {
  const { signOut } = useClerk()

  const untrackPresence = async () => {
    await supabaseClient.channel("tracking").untrack()
  }

  const dispatch: AppDispatch = useDispatch()

  const onLogout = async () => {
    await untrackPresence()
    dispatch(onOffline({ members: [{ id: userId! }] }))
    await signOut({ redirectUrl: "/" })
  }

  return (
    <DropDown
      title="Account"
      trigger={
        <Avatar className="cursor-pointer">
          <AvatarImage src={image} alt="user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      }
    >
      <Link href={`/group/${groupId}/settings`} className="flex gap-x-2 px-2">
        <Settings /> Settings
      </Link>
      <Button
        onClick={onLogout}
        variant="ghost"
        className="flex gap-x-3 px-2 justify-start w-full"
      >
        <Logout /> Logout
      </Button>
    </DropDown>
  )
}
