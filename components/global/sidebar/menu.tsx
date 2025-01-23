"use client"

import { SIDEBAR_SETTINGS_MENU } from "@/constants/menus"
import { useChannelInfo } from "@/hooks/channels"
import { cn } from "@/lib/utils"
import { SideBarMenuProps } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import IconDropDown from "./icon-dropdown"
import { IconRenderer } from "../icon-renderer"
import { Input } from "@/components/ui/input"
import { Trash } from "lucide-react"

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

  return (
    <div className="flex flex-col">
      {channels && channels.length > 0 ? (
        <>
          {channels.map(
            (channel) =>
              channel.id !== deleteVariables?.id && (
                <Link
                  href={`/group/${channel.groupId}/channel/${channel.id}`}
                  id="channel-link"
                  key={channel.id}
                  className={cn(
                    "flex justify-between hover:bg-themeGray p-2 group rounded-lg items-center",
                    channel.id === current && edit && "bg-themeGray",
                  )}
                  {...(channel.name !== "general" &&
                    channel.name !== "announcements" && {
                      onDoubleClick: () => onEditChannel(channel.id),
                      ref: channelRef,
                    })}
                >
                  <div className="flex gap-x-2 items-center">
                    {channel.id === current && edit ? (
                      <IconDropDown
                        ref={triggerRef}
                        page={currentPage}
                        onSetIcon={onSetIcon}
                        channelId={channel.id}
                        icon={channel.icon}
                        currentIcon={icon}
                      />
                    ) : (
                      <IconRenderer
                        icon={channel.icon}
                        mode={currentPage === channel.id ? "LIGHT" : "DARK"}
                      />
                    )}
                    {channel.id === current && edit ? (
                      <Input
                        type="text"
                        ref={inputRef}
                        className="bg-transparent p-0 text-lg m-0 h-full"
                      />
                    ) : (
                      <p
                        className={cn(
                          "text-lg capitalize",
                          currentPage === channel.id
                            ? "text-white"
                            : "text-themeTextGray",
                        )}
                      >
                        {isPending && variables && current === channel.id
                          ? variables.name
                          : channel.name}
                      </p>
                    )}
                  </div>
                  {channel.name !== "general" &&
                    channel.name !== "announcements" &&
                    userId === groupUserId && (
                      <Trash
                        onClick={() => onChannelDelete(channel.id)}
                        className="group-hover:inline hidden content-end text-themeTextGray hover:text-gray-400"
                        size={16}
                      />
                    )}
                </Link>
              ),
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default SideBarMenu
