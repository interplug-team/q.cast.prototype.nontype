'use client'

import Hero from '@/components/Hero'
import Roof from '@/components/Roof'
import Roof2 from '@/components/Roof2'

export default function RoofPage() {
  return (
    <>
      <Hero title="Drawing on canvas 2D Roof" />
      <div className="flex flex-col justify-center my-8">
        <Roof2 />
      </div>
    </>
  )
}
