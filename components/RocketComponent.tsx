import { Rocket, RocketIcon, SpaceIcon } from 'lucide-react'
import React from 'react'

type Props = {
    degrees: number
}

const RocketComponent = ({degrees}: Props) => {
  return (
    <div className='rocket-shadow'>
      <RocketIcon size={40} className='fill-purple-700 stroke-black outline-none' style={{
        transform: `rotate(${-45 - degrees/3}deg)`,
        transition: 'all',
        animationDuration: '10ms',
      }}/>
    </div>
  )
}

export default RocketComponent