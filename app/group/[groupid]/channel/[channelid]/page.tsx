import { onAuthenticatedUser } from "@/actions/auth.actions"
import { onGetChannelInfo } from "@/actions/channels.actions"
import { onGetGroupInfo } from "@/actions/groups.actions"
import { currentUser } from "@clerk/nextjs/server"
import { QueryClient } from "@tanstack/react-query"

type Params = Promise<{
  channelid: string
  groupid: string
}>

// WIP: Complete the group channel page

const GroupChannelPage = async ({ params }: { params: Params }) => {
  const { channelid, groupid } = await params
  const client = new QueryClient()
  const user = await currentUser()
  const authUser = await onAuthenticatedUser()

  // Channel info
  await client.prefetchQuery({
    queryKey: ["channel-info"],
    queryFn: () => onGetChannelInfo(channelid),
  })

  // About group info
  await client.prefetchQuery({
    queryKey: ["about-group-info"],
    queryFn: () => onGetGroupInfo(groupid),
  })

  return <div>GroupChannelPage</div>
}

export default GroupChannelPage
