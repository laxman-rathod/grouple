import { onAuthenticatedUser } from "@/actions/auth.actions"
import {
  onGetAllGroupMembers,
  onGetGroupChannels,
  onGetGroupInfo,
  onGetGroupSubscriptions,
  onGetUserGroups,
} from "@/actions/groups.actions"
import SideBar from "@/components/global/sidebar"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { redirect } from "next/navigation"

interface GroupLayoutProps {
  children: React.ReactNode
  params: { groupid: string }
}

const GroupLayout = async ({ children, params }: GroupLayoutProps) => {
  const query = new QueryClient()
  const user = await onAuthenticatedUser()

  if (!user.id) {
    redirect("/sign-in")
  }

  // Group info
  await query.prefetchQuery({
    queryKey: ["group-info"],
    queryFn: () => onGetGroupInfo(params.groupid),
  })

  // User groups
  await query.prefetchQuery({
    queryKey: ["user-groups"],
    queryFn: () => onGetUserGroups(user.id as string),
  })

  // Group channels
  await query.prefetchQuery({
    queryKey: ["group-channels"],
    queryFn: () => onGetGroupChannels(params.groupid),
  })

  // Group subscriptions
  await query.prefetchQuery({
    queryKey: ["group-subscriptions"],
    queryFn: () => onGetGroupSubscriptions(params.groupid),
  })

  // Member chats
  await query.prefetchQuery({
    queryKey: ["member-chats"],
    queryFn: () => onGetAllGroupMembers(params.groupid),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen md:pt-5">
        <SideBar groupid={params.groupid} userid={user.id} />
      </div>
    </HydrationBoundary>
  )
}

export default GroupLayout
