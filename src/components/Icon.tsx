type IconProps = {
  name: string
  className?: string
}

function Icon({ name, className }: IconProps) {
  return (
    <svg className={className} role="presentation" aria-hidden="true">
      <use href={`/icons.svg#${name}`}></use>
    </svg>
  )
}

export default Icon