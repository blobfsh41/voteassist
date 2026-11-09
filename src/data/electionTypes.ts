export type ElectionType = 'federal' | 'state' | 'local' | 'other'

export type ElectionStatus = 'upcoming' | 'active' | 'completed'

export interface Election {
  id: string
  name: string
  type: ElectionType
  jurisdiction: string
  electionDate: string | null
  status: ElectionStatus
  electorateIds: string[]
}

export type ElectorateType = 'federal' | 'state' | 'local' | 'other'

export interface Electorate {
  id: string
  name: string
  type: ElectorateType
  jurisdiction: string
}