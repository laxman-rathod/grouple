import React from "react"

export interface IGroupInfo {
  status: number
  group:
    | {
        id: string
        name: string
        category: string
        thumbnail: string | null
        description: string | null
        gallery: string[]
        jsonDescription: string | null
        htmlDescription: string | null
        privacy: boolean
        active: boolean
        createdAt: Date
        userId: string
        icon: string
      }
    | undefined
}

export interface IChannels {
  id: string
  name: string
  icon: string
  createdAt: Date
  groupId: string | null
}

export interface IGroups {
  status: number
  groups:
    | {
        icon: string | null
        id: string
        name: string
      }[]
    | undefined
}

export interface SideBarMenuProps {
  channels: IChannels[]
  optimisticChannel:
    | {
        id: string
        name: string
        icon: string
        createdAt: Date
        groupId: string | null
      }
    | undefined
  loading: boolean
  groupId: string
  groupUserId: string
  userId: string
}

export interface IconDropDownProps {
  icon: string
  ref: React.RefObject<HTMLButtonElement | null>
  page?: string
  channelId: string
  currentIcon?: string
  onSetIcon(icon: string): void
}

export interface SearchProps {
  className?: string
  inputStyle?: string
  placeholder?: string
  searchType: "GROUPS" | "POSTS"
  iconStyle?: string
  glass?: boolean
}

export type GroupStateProps = {
  id: string
  name: string
  category: string
  createdAt: Date
  htmlDescription: string | null
  userId: string
  thumbnail: string | null
  description: string | null
  privacy: "PUBLIC" | "PRIVATE"
  jsonDescription: string | null
  gallery: string[]
}
