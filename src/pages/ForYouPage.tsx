
import { candidates } from '../data/candidates'
import { electorates } from '../data/electorates'

export default function ForYouPage() {
  return (
    <main className="content for-you-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow">
            VOTEASSIST / 2026 VICTORIAN STATE ELECTION
          </span>

          <h1>
            Your vote.
            <br />
            Your priorities.
            <br />
            <span>Make an informed choice.</span>
          </h1>

          <p>
            Understand the candidates contesting your electorate.
            Compare their positions on the issues that matter to you,
            using evidence rather than political advertising.
          </p>
        </div>

        <aside className="home-hero-aside">
          <span className="home-aside-label">THE PURPOSE</span>
          <p>
            Politics can be difficult to navigate. VoteAssist is
            designed to make candidate policies easier to understand
            and compare.
          </p>
          <div className="home-aside-rule" />
          <span className="home-aside-foot">
            Independent in presentation. Evidence-led in assessment.
          </span>
        </aside>
      </section>

      <section className="home-overview">
        <div className="home-section-heading">
          <div>
            <span className="eyebrow">GETTING STARTED</span>
            <h2>Three steps to a clearer choice.</h2>
          </div>
          <p>
            Start with your electorate, identify your priorities,
            then examine the candidates.
          </p>
        </div>

        <div className="home-steps">
          <article className="home-step">
            <span className="home-step-number">01</span>
            <h3>Choose your electorate</h3>
            <p>
              Find the candidates contesting your Victorian
              Legislative Assembly district.
            </p>
          </article>

          <article className="home-step">
            <span className="home-step-number">02</span>
            <h3>Set your priorities</h3>
            <p>
              Tell VoteAssist which policy positions you support
              and how important each issue is to you.
            </p>
          </article>

          <article className="home-step">
            <span className="home-step-number">03</span>
            <h3>Compare the candidates</h3>
            <p>
              Examine published policy assessments, their supporting
              evidence and areas where information is unavailable.
            </p>
          </article>
        </div>
      </section>

      <section className="home-data">
        <div>
          <span className="eyebrow">THE ELECTION</span>
          <h2>Start with the candidates.</h2>
          <p>
            VoteAssist uses Victorian Electoral Commission
            nomination information as its starting point.
            Candidate policy positions are assessed separately
            and are only displayed when published.
          </p>
        </div>

        <div className="home-data-stat">
          <strong>{candidates.length.toLocaleString('en-AU')}</strong>
          <span>Assembly candidate records</span>
          <div className="home-data-divider" />
          <strong>{electorates.length}</strong>
          <span>Assembly electorates</span>
        </div>
      </section>

      <section className="home-principles">
        <span className="eyebrow">OUR APPROACH</span>
        <h2>Information, not persuasion.</h2>

        <div className="home-principles-grid">
          <div>
            <h3>Evidence matters</h3>
            <p>
              Policy assessments must be supported by sources.
              A candidate's position should never be guessed from
              their party affiliation.
            </p>
          </div>

          <div>
            <h3>Unknown means unknown</h3>
            <p>
              Missing evidence is not the same as disagreement.
              Unassessed positions should remain clearly identified.
            </p>
          </div>

          <div>
            <h3>You make the decision</h3>
            <p>
              VoteAssist helps you understand differences between
              candidates. It does not tell you who to vote for.
            </p>
          </div>
        </div>
      </section>

      <p className="home-disclaimer">
        VoteAssist is an independent information tool, not an
        official electoral service or a source of voting advice.
        Candidate nomination information and policy assessments
        have separate sources and review processes.
      </p>
    </main>
  )
}
