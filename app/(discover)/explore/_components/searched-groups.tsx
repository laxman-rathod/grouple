import { Loader } from "@/components/global/loader"
import { GroupStateProps } from "@/types"
import GroupCard from "./group-card"
import { NoResults } from "@/components/global/search/no-results"
import { InfiniteScrollObserver } from "@/components/global/infinite-scroll"
import { PaginatedGroups } from "./paginated-groups"

interface Props {
  searching: boolean
  data: GroupStateProps[]
  query?: string
}
export const SearchGroups = ({ searching, data, query }: Props) => {
  return (
    <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6 mt-36">
      <Loader loading={searching} className="lg:col-span-3 md:col-span-2">
        {data.length > 0 ? (
          data.map((group: any) => <GroupCard key={group.id} {...group} />)
        ) : (
          <NoResults />
        )}
      </Loader>
      {data.length > 5 && (
        <InfiniteScrollObserver
          action="GROUPS"
          identifier={query as string}
          paginate={data.length}
          search
        >
          <PaginatedGroups />
        </InfiniteScrollObserver>
      )}
    </div>
  )
}
