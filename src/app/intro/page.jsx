'use client'

import Hero from '@/components/Hero'
import Intro from '@/components/Intro'

export default function IntroPage() {
  return (
    <>
      <Hero title="Drawing on canvas 2D Intro" />
      <div className="container flex flex-wrap items-center justify-between mx-auto p-4 m-4 border">
        <Intro />
      </div>
    </>
  )
}
