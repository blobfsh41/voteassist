
export function changeCandidateSelection(
  current: string[],
  column: number,
  candidateId: string,
): string[] {
  if (candidateId === '') {
    return current.filter((_, index) => index !== column)
  }

  if (column === current.length) {
    if (current.length >= 2 || current.includes(candidateId)) {
      return current
    }

    return [...current, candidateId]
  }

  if (column < 0 || column >= current.length) {
    return current
  }

  if (current.some((id, index) => index !== column && id === candidateId)) {
    return current
  }

  return current.map((candidate, index) =>
    index === column ? candidateId : candidate,
  )
}
