type DiscoverLayoutProps = { children: React.ReactNode }

const DiscoverLayout = ({ children }: DiscoverLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-black pb-10">{children}</div>
  )
}

export default DiscoverLayout
