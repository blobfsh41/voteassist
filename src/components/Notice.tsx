
import Icon from './Icon'

export default function Notice({ news = false }: { news?: boolean }) {
  return (
    <div className="notice">
      <Icon name="info" size={16} />
      <p>
        {news
          ? 'Illustrative news only. Not real reporting or endorsements. For you pages are designed to show how local context and issue-based updates could appear in VoteAssist.'
          : 'Illustrative candidates and policies only. Not an official ballot or voting advice.'}
      </p>
    </div>
  )
}
