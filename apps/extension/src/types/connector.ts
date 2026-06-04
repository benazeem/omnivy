import type { CloudServiceId } from "."

export type CloudAction = 'sync-folders'


export interface CloudConnectorProps {
  cloud: CloudServiceId
  setCloud: (cloud: CloudServiceId | null) => void
}


export interface ActionState {
  action?: CloudAction
  status: 'idle' | 'running' | 'success' | 'error'
}
