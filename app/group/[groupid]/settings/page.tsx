import GroupSettingsForm from "@/components/forms/group-settings"
import { Group } from "lucide-react"

const GroupSettingsPage = ({ params }: { params: { groupid: string } }) => {
  return (
    <div className="flex flex-col w-full h-full gap-10 px-16 overflow-auto">
      <div className="flex flex-col">
        <h3 className="text-3xl font-bold">Group Settings</h3>
        <p className="text-sm text-themeTextGray">
          Adjust your group settings here. These settings might take time to
          reflect on the explore page.
        </p>
      </div>
      <GroupSettingsForm></GroupSettingsForm>
    </div>
  )
}

export default GroupSettingsPage
