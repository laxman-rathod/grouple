"use client"

import { onGetPaginatedPosts, onSearch } from "@/actions/groups.actions"
import { onInfiniteScroll } from "@/redux/slices/infinite-scroll-slice"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

export const useInfiniteScroll = (
  action: "GROUPS" | "POSTS" | "CHANNELS",
  identifier: string,
  paginate: number,
  search?: boolean,
  query?: string,
) => {
  const observerElement = useRef<HTMLDivElement>(null)
  const dispatch: AppDispatch = useDispatch()
  const { data } = useAppSelector((state) => state.infiniteScrollReducer)

  const {
    isFetching,
    isFetched,
    data: paginatedData,
    refetch,
  } = useQuery({
    queryKey: ["infinite-scroll"],
    queryFn: async () => {
      if (search) {
        let response

        switch (action) {
          case "GROUPS":
            response = await onSearch(
              action,
              query as string,
              paginate + data.length,
            )
            return response.groups && response.groups.length > 0
              ? response.groups
              : null

          case "POSTS":
            response = await onGetPaginatedPosts(
              identifier,
              paginate + data.length,
            )
            return response.posts && response.posts.length > 0
              ? response.posts
              : null

          // WIP: implement search for channels
          // case "CHANNELS":
          //   response = await onSearchGroups(
          //     action,
          //     query as string,
          //     paginate + data.length,
          //   )
          //   return response.channels && response.channels.length > 0
          //     ? response.channels
          //     : null

          default:
            return null
        }
      }
    },
    enabled: false,
  })

  if (isFetched && paginatedData) {
    dispatch(onInfiniteScroll({ data: paginatedData }))
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) refetch()
    })
    observer.observe(observerElement.current as Element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return { observerElement, isFetching }
}
