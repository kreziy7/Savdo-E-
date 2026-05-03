export default function SectionHeader({ tag, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : ''
  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      {tag ? <span className="eyebrow">{tag}</span> : null}
      <h2 className="mt-5 font-syne text-4xl font-extrabold leading-tight text-white sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-[color:var(--text-muted)] sm:text-lg">{description}</p>
    </div>
  )
}
