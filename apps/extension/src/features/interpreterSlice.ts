import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface InterpreterState {
  enabled: boolean
  autoRun: boolean
  provider: 'openai' | 'anthropic' | 'local'
  apiKey: string
  model: string
  prompt: string
}

const initialState: InterpreterState = {
  enabled: false,
  autoRun: false,
  provider: 'openai',
  apiKey: '',
  model: 'gpt-4o',
  prompt: 'Summarize this article in 3 bullet points.',
}

const interpreterSlice = createSlice({
  name: 'interpreter',
  initialState,
  reducers: {
    setInterpreter: (state, action: PayloadAction<Partial<InterpreterState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setInterpreter } = interpreterSlice.actions
export default interpreterSlice.reducer
