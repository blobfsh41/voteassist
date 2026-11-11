import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as XLSX from 'xlsx'

type RawCandidate = {
  rawName: string
  party: string
}

type ParsedSection = {
  sourceName: string
  kind: 'district' | 'region'
  declaredCount: number | null
  candidates: RawCandidate[]
}

const EXPECTED = {
  reportCandidates: 1037,
  districts: 88,
  assemblyCandidates: 734,
  regions: 8,
  councilCandidates: 303,
}

function cell(row: unknown[], index: number): string {
  return String(row[index] ?? '').trim()
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function titleCasePart(part: string): string {
  if (!part) return part

  const lower = part.toLowerCase()

  if (lower.length > 2 && lower.startsWith('mc')) {
    return `Mc${lower[2].toUpperCase()}${lower.slice(3)}`
  }

  if (lower.length > 3 && lower.startsWith('mac')) {
    return `Mac${lower[3].toUpperCase()}${lower.slice(4)}`
  }

  return lower[0].toUpperCase() + lower.slice(1)
}

function titleCaseName(value: string): string {
  return value
    .toLowerCase()
    .split(/(\s+|-|')/)
    .map(part =>
      part === '-' || part === "'" || /^\s+$/.test(part)
        ? part
        : titleCasePart(part),
    )
    .join('')
}

function displayCandidateName(rawName: string): string {
  const comma = rawName.indexOf(',')

  if (comma === -1) {
    // The VEC source contains two names without a comma. Preserve their
    // source word order rather than guessing which part is the surname.
    return titleCaseName(rawName)
  }

  const surname = rawName.slice(0, comma).trim()
  const givenNames = rawName.slice(comma + 1).trim()

  return `${titleCaseName(givenNames)} ${titleCaseName(surname)}`.trim()
}

function parseReport(rows: unknown[][]): {
  sections: ParsedSection[]
  reportedTotal: number | null
} {
  const sections: ParsedSection[] = []
  let current: ParsedSection | null = null
  let readingCandidates = false
  let reportedTotal: number | null = null

  for (const row of rows) {
    const first = cell(row, 0)
    const second = cell(row, 1)

    if (first.toLowerCase().startsWith('total candidates for all electorates')) {
      const parsed = Number(second.replace(/,/g, ''))
      reportedTotal = Number.isInteger(parsed) ? parsed : null
      continue
    }

    if (first.endsWith(' District') || first.endsWith(' Region')) {
      current = {
        sourceName: first,
        kind: first.endsWith(' District') ? 'district' : 'region',
        declaredCount: null,
        candidates: [],
      }
      sections.push(current)
      readingCandidates = false
      continue
    }

    if (!current) continue

    const countMatch = first.match(
      /^\((\d+)\s+vacanc(?:y|ies),\s*(\d+)\s+candidates?\)$/i,
    )

    if (countMatch) {
      current.declaredCount = Number(countMatch[2])
      continue
    }

    if (first.toLowerCase() === 'candidates') {
      readingCandidates = true
      continue
    }

    if (!readingCandidates) continue

    if (!first) {
      readingCandidates = false
      continue
    }

    // Only use candidate name and registered-party columns. Contact-person
    // names, phone numbers and email addresses are intentionally ignored.
    const registeredParty = cell(row, 4)

    current.candidates.push({
      rawName: first,
      party: registeredParty || 'Independent',
    })
  }

  return { sections, reportedTotal }
}

function validateReport(
  sections: ParsedSection[],
  reportedTotal: number | null,
): string[] {
  const errors: string[] = []
  const districts = sections.filter(section => section.kind === 'district')
  const regions = sections.filter(section => section.kind === 'region')
  const total = sections.reduce(
    (sum, section) => sum + section.candidates.length,
    0,
  )
  const assemblyTotal = districts.reduce(
    (sum, section) => sum + section.candidates.length,
    0,
  )
  const councilTotal = regions.reduce(
    (sum, section) => sum + section.candidates.length,
    0,
  )

  if (reportedTotal !== EXPECTED.reportCandidates) {
    errors.push(
      `Expected report total ${EXPECTED.reportCandidates}; found ${reportedTotal ?? 'no total'}.`,
    )
  }
  if (total !== EXPECTED.reportCandidates) {
    errors.push(`Expected ${EXPECTED.reportCandidates} parsed candidates; found ${total}.`)
  }
  if (districts.length !== EXPECTED.districts) {
    errors.push(`Expected ${EXPECTED.districts} districts; found ${districts.length}.`)
  }
  if (assemblyTotal !== EXPECTED.assemblyCandidates) {
    errors.push(
      `Expected ${EXPECTED.assemblyCandidates} Assembly candidates; found ${assemblyTotal}.`,
    )
  }
  if (regions.length !== EXPECTED.regions) {
    errors.push(`Expected ${EXPECTED.regions} regions; found ${regions.length}.`)
  }
  if (councilTotal !== EXPECTED.councilCandidates) {
    errors.push(
      `Expected ${EXPECTED.councilCandidates} Council candidates; found ${councilTotal}.`,
    )
  }

  for (const section of sections) {
    if (section.declaredCount === null) {
      errors.push(`Missing declared candidate count for ${section.sourceName}.`)
    } else if (section.declaredCount !== section.candidates.length) {
      errors.push(
        `${section.sourceName}: report declares ${section.declaredCount}, parsed ${section.candidates.length}.`,
      )
    }
    for (const candidate of section.candidates) {
      if (!candidate.rawName) {
        errors.push(`Blank candidate name in ${section.sourceName}.`)
      }
    }
  }

  return errors
}

function main() {
  const inputPath = process.argv[2]

  if (!inputPath) {
    throw new Error(
      'Usage: bun run scripts/import-vic2026-assembly.ts <path-to-vec-xls-or-xlsx>',
    )
  }

  const absoluteInputPath = resolve(inputPath)
  const workbook = XLSX.readFile(absoluteInputPath)
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    throw new Error('The VEC workbook contains no worksheets.')
  }

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
    header: 1,
    defval: '',
    raw: false,
  }) as unknown[][]

  const { sections, reportedTotal } = parseReport(rows)
  const errors = validateReport(sections, reportedTotal)

  if (errors.length > 0) {
    throw new Error(`VEC import validation failed:\n${errors.join('\n')}`)
  }

  const districtSections = sections.filter(
    section => section.kind === 'district',
  )

  const electorates = districtSections.map(section => {
    const name = section.sourceName.replace(/ District$/, '')
    return {
      id: `vic-2026-${slugify(name)}`,
      name,
      type: 'state' as const,
      jurisdiction: 'Victoria',
    }
  })

  const candidates = districtSections.flatMap(section => {
    const electorateName = section.sourceName.replace(/ District$/, '')
    const electorateId = `vic-2026-${slugify(electorateName)}`

    return section.candidates.map(candidate => ({
      id: `${electorateId}-${slugify(candidate.rawName)}`,
      name: displayCandidateName(candidate.rawName),
      party: candidate.party,
      electionId: 'vic-2026-state',
      electorateId,
      status: 'active' as const,
      policies: {},
    }))
  })

  const electorateIds = electorates.map(electorate => electorate.id)
  const candidateIds = candidates.map(candidate => candidate.id)
  const duplicateElectorateIds = electorateIds.filter(
    (id, index) => electorateIds.indexOf(id) !== index,
  )
  const duplicateCandidateIds = candidateIds.filter(
    (id, index) => candidateIds.indexOf(id) !== index,
  )

  if (duplicateElectorateIds.length > 0) {
    throw new Error(`Duplicate electorate IDs: ${duplicateElectorateIds.join(', ')}`)
  }
  if (duplicateCandidateIds.length > 0) {
    throw new Error(`Duplicate candidate IDs: ${duplicateCandidateIds.join(', ')}`)
  }
  if (candidates.some(candidate => !candidate.electorateId || !candidate.name || !candidate.party)) {
    throw new Error('A generated candidate is missing a required field.')
  }

  const election = {
    id: 'vic-2026-state',
    name: '2026 Victorian State Election',
    type: 'state' as const,
    jurisdiction: 'Victoria',
    electionDate: '2026-11-28',
    status: 'active' as const,
    electorateIds,
  }

  const outputDirectory = resolve('src/data/generated')
  mkdirSync(outputDirectory, { recursive: true })

  writeFileSync(
    resolve(outputDirectory, 'vic2026AssemblyElectorates.ts'),
    `// Generated from the VEC State Election 2026 nominations report (as at 9 Nov 2026).\n// Do not edit manually; rerun scripts/import-vic2026-assembly.ts.\nimport type { Electorate } from '../electionTypes'\n\nexport const vic2026AssemblyElectorates: Electorate[] = ${JSON.stringify(electorates, null, 2)}\n`,
  )

  writeFileSync(
    resolve(outputDirectory, 'vic2026AssemblyCandidates.ts'),
    `// Generated from the VEC State Election 2026 nominations report (as at 9 Nov 2026).\n// Contact-person names, phone numbers and email addresses are not imported.\n// Do not edit manually; rerun scripts/import-vic2026-assembly.ts.\nimport type { Candidate } from '../candidateTypes'\n\nexport const vic2026AssemblyCandidates: Candidate[] = ${JSON.stringify(candidates, null, 2)}\n`,
  )

  writeFileSync(
    resolve(outputDirectory, 'vic2026AssemblyElection.ts'),
    `// Generated from the VEC State Election 2026 nominations report (as at 9 Nov 2026).\n// Do not edit manually; rerun scripts/import-vic2026-assembly.ts.\nimport type { Election } from '../electionTypes'\n\nexport const vic2026AssemblyElection: Election = ${JSON.stringify(election, null, 2)}\n`,
  )

  console.log(
    `VEC import validated: ${electorates.length} districts, ${candidates.length} Assembly candidates.`,
  )
  console.log('Council data was validated but not imported.')
}

main()
