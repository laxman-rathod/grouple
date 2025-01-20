"use client"

import { useInfiniteScroll } from "@/hooks/infinite-scroll"
import { InfiniteScrollObserverProps } from "@/types"
import { Skeleton } from "../skeleton"

export const InfiniteScrollObserver = ({
  children,
  action,
  identifier,
  paginate,
  search,
  loading,
}: InfiniteScrollObserverProps) => {
  const { observerElement, isFetching } = useInfiniteScroll(
    action,
    identifier,
    paginate,
    search,
  )

  return (
    <>
      {children}
      <div ref={observerElement}>
        {isFetching && <Skeleton element={loading || "CARD"} />}
      </div>
    </>
  )
}
