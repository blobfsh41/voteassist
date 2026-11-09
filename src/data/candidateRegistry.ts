import { validateCandidateRegistry } from './candidateRegistryValidation'

const errors = validateCandidateRegistry()

if (errors.length > 0) {
  throw new Error(errors.join('\n'))
}