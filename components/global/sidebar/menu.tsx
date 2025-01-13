"use client"

import { SIDEBAR_SETTINGS_MENU } from "@/constants/menus"
import { useChannelInfo } from "@/hooks/channels"
import { cn } from "@/lib/utils"
import { SideBarMenuProps } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SideBarMenu = ({
  userId,
  groupId,
  loading,
  channels,
  groupUserId,
  optimisticChannel,
}: SideBarMenuProps) => {
  const pathname = usePathname()
  const currentPage = pathname.split("/").pop()

  const {
    channel: current,
    onEditChannel,
    channelRef,
    inputRef,
    variables,
    isPending,
    edit,
    icon,
    onSetIcon,
    triggerRef,
    onChannelDelete,
    deleteVariables,
  } = useChannelInfo()

  if (pathname.includes("settings")) {
    return (
      <div className="flex flex-col">
        {SIDEBAR_SETTINGS_MENU.map((setting) =>
          setting.integration ? (
            userId === groupUserId && (
              <Link
                className={cn(
                  "flex gap-x-2 items-center font-semibold rounded-xl text-themeTextGray hover:bg-themeGray p-2",
                  currentPage === "settings"
                    ? !setting.path && "text-white"
                    : currentPage === setting.path && "text-white",
                )}
                href={`/group/${groupId}/settings/${setting.path}`}
                key={setting.id}
              >
                {setting.icon} {setting.label}
              </Link>
            )
          ) : (
            <Link
              className={cn(
                "flex gap-x-2 items-center font-semibold rounded-xl text-themeTextGray hover:bg-themeGray p-2",
                currentPage === "settings"
                  ? !setting.path && "text-white"
                  : currentPage === setting.path && "text-white",
              )}
              href={`/group/${groupId}/settings/${setting.path}`}
              key={setting.id}
            >
              {setting.icon} {setting.label}
            </Link>
          ),
        )}
      </div>
    )
  }

  return <div>SideBarMenu</div>
}

export default SideBarMenu
