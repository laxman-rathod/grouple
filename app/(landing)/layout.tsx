import LandingPageNavbar from "./_components/navbar/Index"

interface Props {
  children: React.ReactNode
}
const LandingPageLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col container relative">
      <LandingPageNavbar />
      {children}
    </div>
  )
}

export default LandingPageLayout