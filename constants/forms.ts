import { v4 } from "uuid"

export type AuthFormProps = {
  id: string
  type: "email" | "text" | "password"
  inputType: "select" | "input"
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  name: string
}
export const SIGN_UP_FORM: AuthFormProps[] = [
  {
    id: v4(),
    inputType: "input",
    placeholder: "First name",
    name: "firstname",
    type: "text",
  },
  {
    id: v4(),
    inputType: "input",
    placeholder: "Last name",
    name: "lastname",
    type: "text",
  },
  {
    id: v4(),
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: v4(),
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
]

export const SIGN_IN_FORM: AuthFormProps[] = [
  {
    id: v4(),
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: v4(),
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
]
