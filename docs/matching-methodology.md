# VoteAssist Matching Methodology

## 1. Overview
VoteAssist compares user policy preferences with candidate policy positions.

## 2. Preference model
- User policy scores: -2 to +2
- Candidate policy scores: -2 to +2
- Importance weights: 1 to 5

## 3. Stance distance
Weighted root mean square distance between user preferences
and candidate positions on assessed policies.

## 4. Weighted coverage
Proportion of total preference importance represented
by assessed candidate policies.

## 5. Eligibility
Candidates must meet the minimum weighted coverage
threshold of 60%.

## 6. Missing policy assessments
Missing assessments are excluded from stance distance,
but penalised in conservative matching bounds.

## 7. Match score
Match score is a transformation of policy distance into
a 0–100 alignment index. It is not a probability or a
percentage of policies agreed with.

## 8. Ranking modes
- Stance: ranks by assessed-policy distance.
- Conservative: ranks by worst-case alignment bound.

## 9. Limitations
- Candidate positions may be incomplete or uncertain.
- User preferences simplify complex policy views.
- Results depend on the policies included and their weights.
- Matching does not measure overall candidate quality.