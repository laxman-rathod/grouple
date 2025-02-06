import { onAuthenticatedUser } from "@/actions/auth.actions"
import { onGetAffiliateInfo } from "@/actions/groups.actions"
import CreateGroup from "@/components/forms/create-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { redirect } from "next/navigation"

type Props = Promise<{
  searchParams: { [affiliate: string]: string }
}>

const GroupCreatePage = async ({ params }: { params: Props }) => {
  const { searchParams } = await params
  const user = await onAuthenticatedUser()
  const affiliate = await onGetAffiliateInfo(searchParams?.affiliate)

  if (!user || !user.id) return redirect("/sign-in")

  return (
    <>
      <div className="px-7 flex flex-col">
        <h5 className="font-bold text-base text-themeTextWhite">
          Payment Method
        </h5>
        <p className="text-themeTextGray leading-tight">
          Free for 14 days, then $99/month. Cancel anytime. All features.
          Unlimited everything. No hidden fees.
        </p>
        {affiliate.status === 200 && (
          <div className="w-full mt-5 flex justify-center items-center gap-x-2 italic text-themeTextGray text-sm">
            You were reffered by
            <Avatar>
              <AvatarImage
                src={affiliate.user?.Group?.User.image as string}
                alt="User"
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            {affiliate.user?.Group?.User.firstname}{" "}
            {affiliate.user?.Group?.User.lastname}
          </div>
        )}
      </div>

      <CreateGroup
        userId={user.id}
        affiliate={affiliate.status === 200 ? true : false}
        stripeId={affiliate.user?.Group?.User.stripeId || ""}
      />
    </>
  )
}

export default GroupCreatePage
