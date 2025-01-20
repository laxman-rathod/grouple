import { useAppSelector } from "@/redux/store"
import GroupCard from "./group-card"

export const PaginatedGroups = () => {
  const { data } = useAppSelector((state) => state.infiniteScrollReducer)

  return data.map((data: any) => <GroupCard key={data.id} {...data} />)
}
