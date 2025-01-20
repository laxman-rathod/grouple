"use client"

import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { SignInSchema } from "../../components/forms/sign-in/schema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { SignUpSchema } from "@/components/forms/sign-up/schema"
import { onSignUpUser } from "@/actions/auth.actions"
import { OAuthStrategy } from "@clerk/types"

export const useAuthSignIn = () => {
  const { isLoaded, setActive, signIn } = useSignIn()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onBlur",
  })

  const router = useRouter()
  const onClerkAuth = async (email: string, password: string) => {
    if (!isLoaded)
      return toast("Error", {
        description: "Oops! something went wrong",
      })
    try {
      const authenticated = await signIn.create({
        identifier: email,
        password,
      })

      if (authenticated.status === "complete") {
        reset()
        await setActive({ session: authenticated.createdSessionId })
        toast("Success", {
          description: "Welcome back!",
        })
        router.push("/callback/sign-in")
      }
    } catch (error: any) {
      if (error.errors[0].code === "form_password_incorrect")
        toast("Error", {
          description: "Incorrect email or password, try again.",
        })
    }
  }

  const { mutate: InitiateLoginFlow, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      onClerkAuth(email, password),
  })

  const onAuthenticateUser = handleSubmit(async (values) => {
    InitiateLoginFlow({ email: values.email, password: values.password })
  })

  return {
    onAuthenticateUser,
    isPending,
    register,
    errors,
  }
}

export const useAuthSignUp = () => {
  const { setActive, isLoaded, signUp } = useSignUp()
  const [creating, setCreating] = useState<boolean>(false)
  const [verifying, setVerifying] = useState<boolean>(false)
  const [code, setCode] = useState<string>("")

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
  })

  const router = useRouter()

  const onGenerateCode = async (email: string, password: string) => {
    if (!isLoaded)
      return toast("Error", {
        description: "Oops! something went wrong",
      })
    try {
      if (email && password) {
        await signUp.create({
          emailAddress: getValues("email"),
          password: getValues("password"),
        })

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
        setVerifying(true)
      } else {
        return toast("Error", {
          description: "No fields must be empty",
        })
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2))
      toast("Error", {
        description: error.message || "Incorrect email or password, try again.",
      })
    }
  }

  const onInitiateUserRegistration = handleSubmit(async (values) => {
    if (!isLoaded)
      return toast("Error", {
        description: "Oops! something went wrong",
      })

    try {
      setCreating(true)
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status !== "complete") {
        // setCreating(false) FIX: this is not working
        return toast("Error", {
          description: "Oops! something went wrong, status in complete",
        })
      }

      if (completeSignUp.status === "complete") {
        if (!signUp.createdUserId) {
          return
        }
        const user = await onSignUpUser({
          firstname: values.firstname,
          lastname: values.lastname,
          clerkId: signUp.createdUserId,
          image: "",
        })

        reset()

        if (user.status === 200) {
          toast("Success", { description: user.message })
          await setActive({ session: completeSignUp.createdSessionId })
          router.push("/group/create")
        }

        if (user.status !== 200) {
          toast("Error", { description: user.message + "action failed" })
          router.refresh
        }

        setCreating(false)
        setVerifying(false)
      } else {
        console.log(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2))
      toast("Error", { description: error.message })
    }
  })

  return {
    onGenerateCode,
    onInitiateUserRegistration,
    register,
    errors,
    verifying,
    creating,
    code,
    setCode,
    getValues,
  }
}

export const useGoogleAuth = () => {
  const { signIn, isLoaded: LoadedSignIn } = useSignIn()
  const { signUp, isLoaded: LoadedSignUp } = useSignUp()

  const signInWith = (strategy: OAuthStrategy) => {
    if (!LoadedSignIn) return
    try {
      return signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/callback",
        redirectUrlComplete: "/callback/sign-in",
      })
    } catch (error: any) {
      console.error(error)
      toast("Error", {
        description: error.message || "Oops! something went wrong",
      })
    }
  }

  const signUpWith = (strategy: OAuthStrategy) => {
    if (!LoadedSignUp) return
    try {
      return signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/callback",
        redirectUrlComplete: "/callback/complete",
      })
    } catch (error: any) {
      console.error(error)
      toast("Error", { description: "Oops! something went wrong" })
    }
  }

  return { signUpWith, signInWith }
}
