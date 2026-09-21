type Props = {
  eyebrow?: string
  title: string
  intro?: string | null
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, intro, align = 'left' }: Props) {
  return (
    <div className={align === 'center' ? 'section-heading mx-auto text-center' : 'section-heading'}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  )
}
