import { onSignInUser, onSignUpUser } from "@/actions/auth.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteSignIn = async () => {
  const user = await currentUser()
  if (!user || !user.id) {
    return redirect("/sign-in")
  }

  const authenticated = await onSignInUser(user.id)

  if (authenticated.status === 200) {
    return redirect("/group/create")
  }

  if (authenticated.status === 207) {
    return redirect(
      `/group/${authenticated.groupId}/channel/${authenticated.channelId}`,
    )
  }

  const signedIn = await onSignUpUser({
    firstname: user.firstName!,
    lastname: user.lastName!,
    image: user?.imageUrl,
    clerkId: user.id,
  })

  if (signedIn.status === 200) {
    return redirect("/group/create")
  }

  return redirect("/sign-in")
}

export default CompleteSignIn
