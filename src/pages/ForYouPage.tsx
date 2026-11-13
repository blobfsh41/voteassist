
import storyImage from '../assets/story.png'
import { stories } from '../data/stories'
import Icon from '../components/Icon'
import Notice from '../components/Notice'
import { useState } from 'react'

export default function ForYouPage() {
  const [filter, setFilter] = useState('')
  const [openStory, setOpenStory] = useState<string | null>(null)

  const visibleStories = filter
    ? stories.filter(story =>
        story.source.toLowerCase().includes(filter.toLowerCase()),
      )
    : stories
    
  return (
    <main className="content for-you-page" data-node-id="5:704">
      <section className="intro">
        <div className="eyebrow">
          VOTEASSIST · 2026 VICTORIAN STATE ELECTION
        </div>
        <h1>
          Understand your choices.
          <br />
          Make your vote count.
        </h1>
        <p>
          Explore candidates, compare their policy positions, and understand
          how their priorities align with yours.
        </p>
        <div className="chips">
          {['Housing', 'Transport', 'Local spaces'].map(issue => (
            <button
              key={issue}
              className={filter === issue ? 'chip active' : 'chip'}
              onClick={() => setFilter(filter === issue ? '' : issue)}
            >
              {issue}
            </button>
          ))}
        </div>
      </section>

      {(!filter || filter === 'Housing') && (
        <article className="card featured" data-node-id="5:725">
          <div className="card-meta">
            <span>Lorem Daily - Housing</span>
            <span>Today</span>
          </div>
          <img
            className="story-image"
            src={storyImage}
            alt="A tree-lined Brunswick street with a tram"
          />
          <h2>New housing plan proposed for Brunswick precinct</h2>
          <p>
            A draft proposal would add more affordable homes near tram routes
            while keeping community spaces intact. Candidates are already
            responding with different ideas on density and resident input.
          </p>
          <div className="story-footer">
            <span>4 min read</span>
            <button
              className="text-link muted-link"
              onClick={() =>
                setOpenStory(openStory === 'featured' ? null : 'featured')
              }
            >
              Read story <Icon name="arrow" size={14} />
            </button>
          </div>
          {openStory === 'featured' && (
            <p className="expanded">
              This is an illustrative story created to show how local reporting
              could appear in VoteAssist.
            </p>
          )}
        </article>
      )}

      <section className="updates" data-node-id="5:737">
        <div className="section-heading">
          <h2>Latest updates</h2>
          <span>Illustrative news</span>
        </div>

        {visibleStories.map(story => (
          <article className="card news-card" key={story.title}>
            <div className="card-meta">
              <span>{story.source}</span>
              <span>{story.date}</span>
            </div>
            <h3>{story.title}</h3>
            <p>{story.text}</p>
            <button
              className="text-link muted-link"
              onClick={() =>
                setOpenStory(openStory === story.title ? null : story.title)
              }
            >
              Open article <Icon name="arrow" size={14} />
            </button>
            {openStory === story.title && (
              <p className="expanded">
                This is an illustrative update, not a real news article.
              </p>
            )}
          </article>
        ))}
      </section>

      <Notice news />
    </main>
  )
}
