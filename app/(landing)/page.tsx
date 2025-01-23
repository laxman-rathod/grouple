import dynamic from "next/dynamic"
import CallToAction from "./_components/call-to-action"
import DashboardSnippet from "./_components/dashboar-snippet"

const PricingSection = dynamic(
  () =>
    import("./_components/pricing").then(
      (component) => component.PricingSection,
    ),
  { ssr: true },
)

const Home = () => {
  return (
    <main className="md:px-10 py-20 flex flex-col gap-36">
      <div>
        <CallToAction />
        <DashboardSnippet />
      </div>
      <PricingSection />
    </main>
  )
}

export default Home
