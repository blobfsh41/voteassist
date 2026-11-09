import { candidates } from './candidates'
import { elections } from './elections'
import { electorates } from './electorates'

export function validateCandidateRegistry(): string[] {
  const errors: string[] = []

  const candidateIds = new Set<string>()
  const electionIds = new Set<string>()
  const electorateIds = new Set<string>()

  for (const election of elections) {
    if (electionIds.has(election.id)) {
      errors.push(`Duplicate election ID: ${election.id}`)
    }

    electionIds.add(election.id)
  }

  for (const electorate of electorates) {
    if (electorateIds.has(electorate.id)) {
      errors.push(`Duplicate electorate ID: ${electorate.id}`)
    }

    electorateIds.add(electorate.id)
  }

  for (const candidate of candidates) {
    if (candidateIds.has(candidate.id)) {
      errors.push(`Duplicate candidate ID: ${candidate.id}`)
    }

    candidateIds.add(candidate.id)

    if (candidate.electionId !== null) {
      if (!electionIds.has(candidate.electionId)) {
        errors.push(
          `${candidate.name} references unknown election: ${candidate.electionId}`,
        )
      }
    }

    if (candidate.electorateId !== null) {
      if (!electorateIds.has(candidate.electorateId)) {
        errors.push(
          `${candidate.name} references unknown electorate: ${candidate.electorateId}`,
        )
      }

      if (candidate.electionId === null) {
        errors.push(
          `${candidate.name} has an electorate but no election`,
        )
      }
    }

    if (candidate.electionId !== null && candidate.electorateId !== null) {
      const election = elections.find(
        (item) => item.id === candidate.electionId,
      )

      if (
        election &&
        !election.electorateIds.includes(candidate.electorateId)
      ) {
        errors.push(
          `${candidate.name}'s electorate is not included in election ${election.id}`,
        )
      }
    }
  }

  for (const election of elections) {
    for (const electorateId of election.electorateIds) {
      if (!electorateIds.has(electorateId)) {
        errors.push(
          `Election ${election.id} references unknown electorate: ${electorateId}`,
        )
      }
    }
  }

  return errors
}