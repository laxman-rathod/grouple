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
import { Navbar } from "../_components/navbar"

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
        <div className="md:ml-[300px] flex flex-col flex-1 bg-[#101011] md:rounded-tl-xl overflow-y-auto border-l-[1px] border-t-[1px] border-[#28282D]">
          <Navbar groupId={params.groupid} userId={user.id} />
          {children}
          {/* <MobileNav groupId={params.groupid} /> */} {/* WIP: Mobile Nav */}
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default GroupLayout
