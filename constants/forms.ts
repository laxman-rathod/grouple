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
    id: `${Math.random() * 1000}`,
    inputType: "input",
    placeholder: "First name",
    name: "firstname",
    type: "text",
  },
  {
    id: `${Math.random() * 1000}`,
    inputType: "input",
    placeholder: "Last name",
    name: "lastname",
    type: "text",
  },
  {
    id: `${Math.random() * 1000}`,
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: `${Math.random() * 1000}`,
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
]

export const SIGN_IN_FORM: AuthFormProps[] = [
  {
    id: `${Math.random() * 1000}`,
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: `${Math.random() * 1000}`,
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
]
