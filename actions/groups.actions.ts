"use server"

import { CreateGroupSchema } from "@/components/forms/create-group/schema"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { onAuthenticatedUser } from "./auth.actions"
import { revalidatePath } from "next/cache"
import { GroupSettingsTypes } from "@/constants/groups"

export const onGetAffiliateInfo = async (id: string) => {
  try {
    const affiliateInfo = await prisma.affiliate.findUnique({
      where: { id },
      select: {
        Group: {
          select: {
            User: {
              select: {
                firstname: true,
                lastname: true,
                image: true,
                id: true,
                stripeId: true,
              },
            },
          },
        },
      },
    })

    if (affiliateInfo) {
      return { status: 200, message: "Affiliate found", user: affiliateInfo }
    }

    return { status: 404, message: "Affiliate not found" }
  } catch (error: any) {
    return { status: 400, message: error.message }
  }
}

export const onCreateNewGroup = async (
  userId: string,
  data: z.infer<typeof CreateGroupSchema>,
) => {
  try {
    const created = await prisma.user.update({
      where: { id: userId },
      data: {
        group: {
          create: {
            ...data,
            affiliate: {
              create: {},
            },
            member: {
              create: {
                userId: userId,
              },
            },
            channel: {
              create: [
                {
                  id: uuidv4(),
                  name: "general",
                  icon: "general",
                },
                {
                  id: uuidv4(),
                  name: "announcements",
                  icon: "announcement",
                },
              ],
            },
          },
        },
      },
      select: {
        id: true,
        group: {
          select: {
            id: true,
            channel: {
              select: {
                id: true,
              },
              take: 1,
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    })

    if (created) {
      return {
        status: 200,
        data: created,
        message: "Group created successfully",
      }
    }
  } catch (error: any) {
    return { status: 400, message: error.message || "Failed to create group" }
  }
}

export const onGetGroupInfo = async (groupId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    })

    if (group) {
      return {
        status: 200,
        message: "Group found",
        group,
        groupOwner: user.id === group.userId ? true : false,
      }
    }

    return {
      status: 404,
      message: "Group not found",
    }
  } catch (error: any) {
    return { status: 400, message: error.message || "Failed to get group" }
  }
}

export const onGetUserGroups = async (id: string) => {
  try {
    const groups = await prisma.user.findUnique({
      where: { id },
      select: {
        group: {
          select: {
            id: true,
            name: true,
            icon: true,
            channel: { where: { name: "general" }, select: { id: true } },
          },
        },
        membership: {
          select: {
            Group: {
              select: {
                id: true,
                name: true,
                icon: true,
                channel: { where: { name: "general" }, select: { id: true } },
              },
            },
          },
        },
      },
    })

    if (groups && (groups.group.length > 0 || groups.membership.length > 0)) {
      return {
        status: 200,
        message: "User Groups found",
        groups: groups.group,
        members: groups.membership,
      }
    }

    return { status: 404, message: "User groups not found" }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to get user groups",
    }
  }
}

export const onGetGroupChannels = async (groupId: string) => {
  try {
    const channels = await prisma.channel.findMany({
      where: { groupId },
      orderBy: { createdAt: "asc" },
    })

    if (channels && channels.length > 0) {
      return {
        status: 200,
        message: "Group channels found",
        channels,
      }
    }

    return {
      status: 404,
      message: "Group channels not found",
    }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to get group channels",
    }
  }
}

export const onGetGroupSubscriptions = async (groupId: string) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { groupId },
      orderBy: { createdAt: "desc" },
    })

    const count = await prisma.members.count({ where: { groupId } })

    if (subscriptions && subscriptions.length > 0) {
      return {
        status: 200,
        message: "Group subscriptions found",
        subscriptions,
        count,
      }
    }

    return {
      status: 404,
      message: "Group subscriptions not found",
    }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to get group subscriptions",
    }
  }
}

export const onGetAllGroupMembers = async (groupId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const members = await prisma.members.findMany({
      where: { groupId, NOT: { userId: user.id } },
      include: { User: true },
    })

    if (members && members.length > 0) {
      return {
        status: 200,
        message: "Group members found",
        members,
      }
    }

    return {
      status: 404,
      message: "Group members not found",
    }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to get group members",
    }
  }
}

export const onSearchQueries = async (
  mode: "GROUPS" | "POSTS" | "CHANNELS",
  query: string,
  paginate: number = 0,
) => {
  try {
    let result
    let message

    switch (mode) {
      case "GROUPS":
        result = await prisma.group.findMany({
          where: { name: { contains: query, mode: "insensitive" } },
          take: 6,
          skip: paginate,
        })
        message = result.length > 0 ? "Groups found" : "Groups not found"
        return {
          status: result.length > 0 ? 200 : 404,
          message,
          groups: result,
        }

      case "POSTS":
        result = await prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 6,
          skip: paginate,
        })
        message = result.length > 0 ? "Posts found" : "Posts not found"
        return { status: result.length > 0 ? 200 : 404, message, posts: result }

      case "CHANNELS":
        result = await prisma.channel.findMany({
          where: { name: { contains: query, mode: "insensitive" } },
          take: 6,
          skip: paginate,
        })
        message = result.length > 0 ? "Channels found" : "Channels not found"
        return {
          status: result.length > 0 ? 200 : 404,
          message,
          channels: result,
        }

      default:
        return { status: 400, message: "No results found" }
    }
  } catch (error: any) {
    return { status: 400, message: error.message || "Failed to search" }
  }
}

export const onUpdateGroupSettings = async (
  groupId: string,
  type: GroupSettingsTypes,
  content: string,
  path: string,
) => {
  const validTypes = [
    "IMAGE",
    "ICON",
    "NAME",
    "DESCRIPTION",
    "JSONDESCRIPTION",
    "HTMLDESCRIPTION",
  ]

  if (!validTypes.includes(type)) {
    return {
      status: 400,
      message: "Invalid type",
    }
  }

  const getKey = (type: string): string => {
    switch (type) {
      case "IMAGE":
        return "thumbnail"
      case "HTMLDESCRIPTION":
        return "htmlDescription"
      case "JSONDESCRIPTION":
        return "jsonDescription"
      default:
        return type.toLowerCase()
    }
  }

  const data = {
    [getKey(type)]: content,
  }

  try {
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data,
    })

    if (updatedGroup) {
      revalidatePath(path)
      return {
        status: 200,
        message: "Group settings updated successfully",
      }
    }
    return { status: 404, message: "Group not found" }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to update group settings",
    }
  }
}

export const onGetExploreGroup = async (category: string, paginate: number) => {
  if (!category) {
    return {
      status: 400,
      message: "Category is required",
    }
  }

  try {
    const groups = await prisma.group.findMany({
      where: { category, NOT: { description: null, thumbnail: null } },
      take: 6,
      skip: paginate,
    })

    if (groups && groups.length > 0) {
      return { status: 200, message: "Groups found", groups }
    }

    return { status: 404, message: "Groups not found" }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to get explore group",
    }
  }
}

export const onGetPaginatedPosts = async (
  identifier: string,
  paginate: number,
) => {
  const user = await onAuthenticatedUser()

  try {
    const posts = await prisma.post.findMany({
      where: { channelId: identifier },
      skip: paginate,
      take: 2,
      orderBy: { createdAt: "desc" },
      include: {
        channel: {
          select: { name: true },
        },
        author: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: { userId: user.id! },
          select: { userId: true, id: true },
        },
      },
    })

    if (posts && posts.length > 0) {
      return { status: 200, message: "Posts found", posts }
    }

    return { status: 404, message: "Posts not found" }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to get posts",
    }
  }
}
