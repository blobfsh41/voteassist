
type IconName =
  | 'pin'
  | 'arrow'
  | 'back'
  | 'search'
  | 'users'
  | 'columns'
  | 'info'
  | 'home'
  | 'tram'
  | 'scale'
  | 'check'
  | 'chevron'

export default function Icon({
  name,
  size = 18,
}: {
  name: IconName
  size?: number
}) {
  const paths: Record<IconName, React.ReactNode> = {
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    arrow: <><path d="M4 12h15M14 7l5 5-5 5"/></>,
    back: <><path d="M20 12H5M10 7l-5 5 5 5"/></>,
    search: <><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 4 4"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1"/></>,
    columns: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    home: <><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/></>,
    tram: <><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 11h14M9 3v8M8 19l-2 2M16 19l2 2M8 15h.01M16 15h.01"/></>,
    scale: <><path d="M12 3v17M7 21h10M4 7h16M6 7l-3 6h6L6 7Zm12 0-3 6h6l-3-6Z"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m7 10 5 5 5-5"/>,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
