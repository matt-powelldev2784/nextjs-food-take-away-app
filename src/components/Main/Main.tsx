import Image from 'next/image'
import { ReactNode } from 'react'

interface HomePageProps {
  children: ReactNode
}

export const Main = ({ children }: HomePageProps) => {
  return (
    <main className="relative w-screen min-h-screen min-w-[280px] top-[3rem]">
      <div className="absolute w-full h-full z-0 ">
        <Image
          src="/curry_platter_bg.jpg"
          fill
          style={{ objectFit: 'cover' }}
          alt="Indian Platter"
        />
      </div>
      <section className="relative flex w-full min-h-screen flex-col items-center justify-center py-6">
        {children}
      </section>
    </main>
  )
}