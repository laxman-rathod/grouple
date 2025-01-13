"use server"

import prisma from "@/lib/prisma"
import { onAuthenticatedUser } from "./auth.actions"

export const onGetChannelInfo = async (channelId: string) => {
  try {
    const user = await onAuthenticatedUser()
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        posts: {
          take: 3,
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
        },
      },
    })

    if (channel && channel.posts.length > 0) {
      return {
        status: 200,
        message: "Channel info fetched successfully.",
        channel,
      }
    }

    return { status: 404, message: "Channel not found." }
  } catch (error: any) {
    return {
      status: 400,
      message: error.message || "Something went wrong.",
    }
  }
}

export const onCreateNewChannel = async (
  groupId: string,
  data: { id: string; name: string; icon: string },
) => {
  try {
    const channel = await prisma.group.update({
      where: { id: groupId },
      data: {
        channel: { create: { ...data } },
      },
      select: { channel: true },
    })

    if (channel && channel.channel.length > 0) {
      return {
        status: 200,
        message: "Channel created successfully.",
        channel: channel.channel,
      }
    }

    return { status: 404, message: "Channel could not be created." }
  } catch (error: any) {
    return { status: 400, message: error.message || "Faild to create channel." }
  }
}

export const onUpdateChannelInfo = async (
  channelId: string,
  name?: string,
  icon?: string,
) => {
  const data: { name?: string; icon?: string } = {}

  try {
    if (!name && !icon) {
      return { status: 400, message: "No data provided." }
    }

    if (name) {
      data.name = name
    }
    if (icon) {
      data.icon = icon
    }

    const channel = await prisma.channel.update({
      where: { id: channelId },
      data,
    })

    if (channel && channel.id) {
      return {
        status: 200,
        message: "Channel updated successfully.",
        channel, // TODO: Check if this is correct
      }
    }

    return { status: 404, message: "Channel could not be updated! Try again." }
  } catch (error: any) {
    return { status: 400, message: error.message || "Faild to update channel." }
  }
}

export const onDeleteChannel = async (channelId: string) => {
  try {
    const channel = await prisma.channel.delete({ where: { id: channelId } })

    if (channel && channel.id) {
      return {
        status: 200,
        message: "Channel deleted successfully.",
      }
    }

    return { status: 404, message: "Channel could not be deleted! Try again." }
  } catch (error: any) {
    return { status: 400, message: error.message || "Faild to delete channel." }
  }
}
