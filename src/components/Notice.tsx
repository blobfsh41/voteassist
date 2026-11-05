import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import type { ResourceSection } from '../types'
import Icon from './Icon'

type NoticeProps = {
  section: ResourceSection
}

function Notice({ section }: NoticeProps) {
  return (
    <div id={section.id}>
      <Icon name={section.icon} className="icon" />
      <h2>{section.title}</h2>
      <p>{section.description}</p>
      <ul>
        {section.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.image && (
                <img
                  className={link.image === 'vite' ? 'logo' : 'button-icon'}
                  src={link.image === 'vite' ? viteLogo : reactLogo}
                  alt=""
                />
              )}
              {link.icon && <Icon name={link.icon} className="button-icon" />}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Notice