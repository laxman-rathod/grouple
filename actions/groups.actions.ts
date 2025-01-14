"use server"

import { CreateGroupSchema } from "@/components/forms/create-group/schema"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { onAuthenticatedUser } from "./auth.actions"

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

export const onSearchGroups = async (
  mode: "GROUPS" | "POSTS",
  query: string,
  paginate?: number,
) => {
  try {
    if (mode === "GROUPS") {
      const fetchedGroups = await prisma.group.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        take: 6,
        skip: paginate || 0,
      })

      if (fetchedGroups && fetchedGroups.length > 0) {
        return {
          status: 200,
          message: "Groups found",
          groups: fetchedGroups,
        }
      }

      return { status: 404, message: "Group not found" }
    }

    if (mode === "POSTS") {
      const fetchedPosts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 6,
        skip: paginate || 0,
      })

      if (fetchedPosts && fetchedPosts.length > 0) {
        return {
          status: 200,
          message: "Posts found",
          posts: fetchedPosts,
        }
      }

      return { status: 404, message: "Post not found" }
    }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Failed to search groups",
    }
  }
}
