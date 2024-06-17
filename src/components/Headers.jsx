import Link from 'next/link'

export default function Headers() {
  return (
    <div className="w-full absolute z-10">
      <nav className="container relative flex flex-wrap items-center justify-between mx-auto p-8">
        <Link href="/" className="font-bold text-3xl">
          Home
        </Link>
        <div className="space-x-4 text-xl">
          <Link href="/intro">Intro</Link>
          <Link href="/roof">Roof</Link>
        </div>
      </nav>
    </div>
  )
}
