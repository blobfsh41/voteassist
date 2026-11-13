import { describe, expect, it } from "vitest";
import type { CandidatePolicyAssessment } from "./candidatePolicyAssessments";
import {
	approveAssessment,
	publishAssessment,
	rejectAssessment,
} from "./candidatePolicyAssessmentWorkflow";

const REVIEWED_AT = "2025-01-15";

function makeAssessment(
	overrides: Record<string, unknown> = {},
): CandidatePolicyAssessment {
	return {
		id: "assessment-1",
		candidateId: "candidate-1",
		policyId: "housing-supply",
		status: "draft",
		score: 0,
		rationale: "Initial assessment",
		assessedAt: REVIEWED_AT,
		evidence: [
			{ source: "Source one", url: "https://example.com/one" },
			{ source: "Source two", url: "https://example.com/two" },
		] as unknown as CandidatePolicyAssessment["evidence"],
		...overrides,
	} as CandidatePolicyAssessment;
}

describe("candidate policy assessment workflow", () => {
	it("changes a draft assessment to reviewed", () => {
		expect(
			approveAssessment(makeAssessment(), "reviewer-1", REVIEWED_AT),
		).toMatchObject({
			status: "reviewed",
		});
	});

	it("records the reviewer and review date", () => {
		expect(
			approveAssessment(makeAssessment(), "reviewer-1", REVIEWED_AT),
		).toMatchObject({
			reviewStatus: "approved",
			review: {
				reviewer: "reviewer-1",
				reviewedAt: REVIEWED_AT,
				decision: "approved",
			},
		});
	});

	it("rejects approval of a non-draft assessment", () => {
		expect(() =>
			approveAssessment(
				makeAssessment({ status: "reviewed" }),
				"reviewer-1",
				REVIEWED_AT,
			),
		).toThrow();
	});

	it("changes a reviewed assessment to published", () => {
		const reviewed = approveAssessment(
			makeAssessment(),
			"reviewer-1",
			REVIEWED_AT,
		);

		expect(
			publishAssessment(reviewed),
		).toMatchObject({ status: "published" });
	});

	it("rejects publishing with fewer than two evidence sources", () => {
		expect(() =>
			publishAssessment(
				approveAssessment(
					makeAssessment({
						evidence: [{ source: "Only source", url: "https://example.com/one" }],
					}),
					"reviewer-1",
					REVIEWED_AT,
				),
			),
		).toThrow();
	});

	it("rejects publishing an unapproved assessment", () => {
		expect(() => publishAssessment(makeAssessment())).toThrow();
	});

	it("records a rejection and its reason", () => {
		expect(
			rejectAssessment(
				makeAssessment(),
				"reviewer-1",
				REVIEWED_AT,
				"Insufficient support for the claim",
			),
		).toMatchObject({
			status: "rejected",
			reviewStatus: "rejected",
			review: {
				reviewer: "reviewer-1",
				reviewedAt: REVIEWED_AT,
				decision: "rejected",
			},
			rejectionReason: "Insufficient support for the claim",
		});
	});

	it("rejects a missing rejection reason", () => {
		expect(() =>
			rejectAssessment(makeAssessment(), "reviewer-1", REVIEWED_AT, ""),
	).toThrow();
	});

	it("rejects rejecting a non-draft assessment", () => {
		expect(() =>
			rejectAssessment(
				makeAssessment({ status: "reviewed" }),
				"reviewer-1",
				REVIEWED_AT,
				"Needs revision",
			),
		).toThrow();
	});
});
