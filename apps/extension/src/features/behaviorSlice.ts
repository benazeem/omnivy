import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface BehaviorState {
  saveBehavior: 'popup' | 'background'
  openBehavior: 'popup' | 'sidebar'
  language: string
  saveImages: boolean
  addLinksInFooter: boolean
}

const initialState: BehaviorState = {
  saveBehavior: 'popup',
  openBehavior: 'popup',
  language: 'en',
  saveImages: false,
  addLinksInFooter: false,
}

const behaviorSlice = createSlice({
  name: 'behavior',
  initialState,
  reducers: {
    setBehavior: (state, action: PayloadAction<Partial<BehaviorState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setBehavior } = behaviorSlice.actions
export default behaviorSlice.reducer
