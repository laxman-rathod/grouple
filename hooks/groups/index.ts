"use client"

import {
  onGetGroupInfo,
  onSearchGroups,
  onUpdateGroupSettings,
} from "@/actions/groups.actions"
import { supabaseClient } from "@/lib/utils"
import { onOnline } from "@/redux/slices/online-member-slice"
import { onClearSearch, onSearch } from "@/redux/slices/search-slice"
import { AppDispatch } from "@/redux/store"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { JSONContent } from "novel"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { GroupSettingsSchema } from "@/components/forms/group-settings/schema"
import { toast } from "sonner"
import { upload } from "@/lib/uploadcare"
import { useRouter } from "next/navigation"
import { GroupSettingsTypes } from "@/constants/groups"

export const useGroupChatOnline = (userId: string) => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const channel = supabaseClient.channel("tracking")

    channel
      .on("presence", { event: "sync" }, () => {
        const state: any = channel.presenceState()
        console.log(state)
        for (const user in state) {
          dispatch(
            onOnline({ members: [{ id: state[user][0].member.userId }] }),
          )
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ member: { userId } })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [])
}

export const useSearch = (search: "GROUPS" | "POSTS") => {
  const [query, setQuery] = useState<string>("")
  const [debounce, setDebounce] = useState<string>("")

  const dispatch: AppDispatch = useDispatch()

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value)

  useEffect(() => {
    const delayInputTimeId = setTimeout(() => {
      setDebounce(query)
    }, 1000)

    return () => clearTimeout(delayInputTimeId)
  }, [query, 1000])

  const { data, refetch, isFetched, isFetching } = useQuery({
    queryKey: ["search-data", debounce],
    queryFn: async ({ queryKey }) => {
      if (search === "GROUPS") {
        const groups = await onSearchGroups(search, queryKey[1])
        return groups
      }
      if (search === "POSTS") {
        const posts = await onSearchGroups(search, queryKey[1])
        return posts
      }
    },
    enabled: false,
  })

  if (isFetching) {
    dispatch(onSearch({ isSearching: true, data: [] }))
  }

  if (isFetched) {
    dispatch(
      onSearch({
        isSearching: false,
        status: data?.status as number,
        data: data?.groups || data?.posts || [],
        debounce,
      }),
    )
  }

  useEffect(() => {
    if (debounce) {
      refetch()
    }
    if (!debounce) {
      dispatch(onClearSearch())

      return () => {
        debounce
      }
    }
  }, [debounce])

  return { query, onSearchQuery }
}

export const useGroupSettings = (groupId: string) => {
  const { data } = useQuery({
    queryKey: ["group-info"],
    queryFn: () => onGetGroupInfo(groupId),
  })

  const jsonContent = data?.group?.jsonDescription
    ? JSON.parse(data?.group?.jsonDescription as string)
    : undefined

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    data?.group?.description || undefined,
  )
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<z.infer<typeof GroupSettingsSchema>>({
    resolver: zodResolver(GroupSettingsSchema),
    mode: "onChange",
  })

  const [previewIcon, setPreviewIcon] = useState<string | undefined>(undefined)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const previews = watch(({ thumbnail, icon }) => {
      if (!icon) return // FIX: This is a temporary fix for the issue
      if (icon[0]) {
        setPreviewIcon(URL.createObjectURL(icon[0]))
      }
      if (thumbnail[0]) {
        setPreviewThumbnail(URL.createObjectURL(thumbnail[0]))
      }
    })

    return () => previews.unsubscribe()
  }, [watch])

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsondescription", JsonContent)
    setValue("description", onDescription)
  }

  useEffect(() => {
    onSetDescriptions()

    return () => {
      onSetDescriptions()
    }
  }, [onJsonDescription, onDescription])

  const updateSettings = async (
    groupId: string,
    type: GroupSettingsTypes,
    file?: File | undefined,
    value?: string | undefined,
  ) => {
    try {
      const uploaded = file ? await upload.uploadFile(file) : undefined
      const updated = await onUpdateGroupSettings(
        groupId,
        type,
        file ? uploaded?.uuid! : value!,
        `/group/${groupId}/settings`,
      )

      if (updated.status === 200) {
        return toast("Success", {
          description: updated.message,
        })
      }

      return toast("Error", { description: updated.message })
    } catch (error: any) {
      return toast("Error", {
        description:
          error.message || "An error occurred while updating settings.",
      })
    }
  }

  const { mutate: update, isPending } = useMutation({
    mutationKey: ["group-settings"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      const tasks = []

      switch (true) {
        case values.thumbnail && values.thumbnail.length > 0:
          tasks.push(updateSettings(groupId, "IMAGE", values.thumbnail[0]))
          break
        case values.icon && values.icon.length > 0:
          tasks.push(updateSettings(groupId, "ICON", values.icon[0]))
          break
        case !!values.name:
          tasks.push(updateSettings(groupId, "NAME", undefined, values.name))
          break
        case !!values.description:
          tasks.push(
            updateSettings(
              groupId,
              "DESCRIPTION",
              undefined,
              values.description,
            ),
          )
          break
        case !!values.jsondescription:
          tasks.push(
            updateSettings(
              groupId,
              "JSONDESCRIPTION",
              undefined,
              values.jsondescription,
            ),
          )
          break
        case !!values.htmldescription:
          tasks.push(
            updateSettings(
              groupId,
              "HTMLDESCRIPTION",
              undefined,
              values.htmldescription,
            ),
          )
          break
        default:
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
      }

      if (tasks.length > 0) {
        await Promise.all(tasks)
      }
    },
  })

  const router = useRouter()
  const onUpdate = handleSubmit(async (values) => update(values))
  if (data?.status !== 200) router.push(`/group/create`)

  return {
    data,
    errors,
    register,
    onUpdate,
    isPending,
    previewIcon,
    previewThumbnail,
    onJsonDescription,
    setJsonDescription,
    setOnDescription,
    onDescription,
  }
}
