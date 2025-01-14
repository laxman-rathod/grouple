import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface InitialStatePops {
  isSearching?: boolean
  status?: number | undefined
//   data: GroupStateProps[] 
  data: GroupStateProps[] 
  debounce?: string
}

const InitialState: InitialStatePops = {
  isSearching: false,
  status: undefined,
  data: [],
  debounce: "",
}

export const Search = createSlice({
  name: "search",
  initialState: InitialState,
  reducers: {
    onSearch: (state, action: PayloadAction<InitialStatePops>) => {
      return { ...action.payload }
    },
    onClearSearch: (state) => {
      state.data = []
      state.isSearching = false
      state.status = undefined
      state.debounce = ""
    },
  },
})

export const { onSearch, onClearSearch } = Search.actions
export default Search.reducer
