import { IconDropDownProps } from "@/types"
import { DropDown } from "../drop-down"
import { IconRenderer } from "../icon-renderer"
import { cn } from "@/lib/utils"
import { ICON_LIST } from "@/constants/icons"

const IconDropDown = ({
  icon,
  ref,
  page,
  channelId,
  onSetIcon,
  currentIcon,
}: IconDropDownProps) => {
  return (
    <DropDown
      ref={ref}
      title="Pick your icon"
      trigger={
        <span>
          <IconRenderer
            icon={icon}
            mode={page === channelId ? "LIGHT" : "DARK"}
          />
        </span>
      }
    >
      <div id="icon-list" className="flex gap-x-2">
        {ICON_LIST.map(
          (icons) =>
            icons.icon !== icon && (
              <span
                key={icons.id}
                className={cn(
                  currentIcon === icons.icon ? "bg-themeGray" : "",
                  "p-2 rounded-lg",
                )}
                onClick={() => onSetIcon(icons.icon)}
              >
                <IconRenderer
                  icon={icons.icon}
                  mode={page === channelId ? "LIGHT" : "DARK"}
                />
              </span>
            ),
        )}
      </div>
    </DropDown>
  )
}

export default IconDropDown
