import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface InitialStateProps {
  members: { id: string }[]
}

const InitialState: InitialStateProps = { members: [] }

export const OnlineTracking = createSlice({
  name: "online",
  initialState: InitialState,
  reducers: {
    onOnline: (state, action: PayloadAction<InitialStateProps>) => {
      // Check for duplicates
      const list = state.members.find((data: any) =>
        action.payload.members.find((payload: any) => data.id === payload.id),
      )

      if (!list) {
        state.members = [...state.members, ...action.payload.members]
      }
    },

    onOffline: (state, action: PayloadAction<InitialStateProps>) => {
      // Look for member and remore them
      state.members = state.members.filter((member) =>
        action.payload.members.find((m) => member.id !== m.id),
      )
    },
  },
})

export const { onOnline, onOffline } = OnlineTracking.actions
export default OnlineTracking.reducer
