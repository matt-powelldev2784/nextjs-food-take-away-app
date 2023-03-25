import Image from 'next/image'
import { ReactNode } from 'react'

interface HomePageProps {
  children: ReactNode
}

export const HomePage = ({ children }: HomePageProps) => {
  return (
    <section className="relative w-screen h-screen ">
      <div className="absolute w-full h-full z-0 ">
        <Image
          src="/indian-platter.jpg"
          fill
          style={{ objectFit: 'cover' }}
          alt="Indian Platter"
        />
      </div>
      <div className="absolute flex w-full h-full flex-col items-center justify-center">
        {children}
      </div>
    </section>
  )
}
