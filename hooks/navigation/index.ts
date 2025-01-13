import { onCreateNewChannel } from "@/actions/channels.actions"
import { onGetGroupChannels } from "@/actions/groups.actions"
import { IGroupInfo, IGroups } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export const useNavigation = () => {
  const pathname = usePathname()
  const [section, setSection] = useState<string>(pathname)
  const onSetSection = (page: string) => setSection(page)
  return { section, onSetSection }
}

export const useSideBar = (groupId: string) => {
  const { data: groups } = useQuery({ queryKey: ["user-groups"] }) as {
    data: IGroups
  }

  const { data: groupInfo } = useQuery({ queryKey: ["group-info"] }) as {
    data: IGroupInfo
  }

  const { data: channels } = useQuery({
    queryKey: ["group-channels"],
    queryFn: () => onGetGroupChannels(groupId),
  })

  const client = useQueryClient()

  // We use useMutation to optimistically add a channel once the mutation is setteled or completed we invalidate the group-channel query add trigger a refetch, this makes the optimistic ui seamless.

  const { mutate, variables, isPending, isError } = useMutation({
    mutationFn: (data: {
      id: string
      name: string
      icon: string
      createdAt: Date
      groupId: string | null
    }) =>
      onCreateNewChannel(groupId, {
        id: data.id,
        name: data.name,
        icon: data.icon,
      }),
    onSettled: async () => {
      return await client.invalidateQueries({ queryKey: ["group-channels"] })
    },
  })

  if (isPending) {
    toast("Success", { description: "Channel created" })
  }

  if (isError) {
    toast("Error", { description: "Failed to create channel" })
  }

  return { groupInfo, groups, mutate, channels, isPending, variables }
}
