'use client'

import Hero from '@/components/Hero'
import Roof from '@/components/Roof'

export default function RoofPage() {
  return (
    <>
      <Hero title="Drawing on canvas 2D Roof" />
      <div className="flex flex-col justify-center my-8">
        <Roof />
      </div>
    </>
  )
}
