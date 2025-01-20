"use client"

import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { Search } from "./slices/search-slice"
import { OnlineTracking } from "./slices/online-member-slice"
import { InfiniteScroll } from "./slices/infinite-scroll-slice"

//add all your reducers here
const rootReducer = combineReducers({
  searchReducer: Search.reducer,
  onlineTrackingReducer: OnlineTracking.reducer,
  infiniteScrollReducer: InfiniteScroll.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
//this useAppSelector has type definitions added
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
