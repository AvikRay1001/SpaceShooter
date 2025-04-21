import { Loader2, RocketIcon } from 'lucide-react';
import React from 'react'

type Props =  {
    info: any,
}

const GameInfoOverlay = ({info}: Props) => {
    const {isDetected, isLoading, isColliding, distance, livesRemainingstate, isGameOver} = info;
    const lives = [];
    for(let i = 0; i < livesRemainingstate; i++){
        lives.push(<RocketIcon key={i} size={20} className='fill-purple-700'/>)
    }

    return (
        <div className={`absolute z-30 h-screen w-screen flex items-center justify-center ${isColliding && 'border-[20px] border-red-600'}`}>
            {isLoading && <Loader2 size={80} color='black' className='animate-spin'/>}
            {!isLoading && !isDetected && !isGameOver && <div className='text-black animate-ping text-2xl font-extrabold'>P A U S E D</div>}
            {isGameOver && <div className='text-black animate-ping text-2xl font-extrabold'>GAME OVER</div>}
            <div className='fixed top-6 text-black right-6'>
                {`Distance: ${distance}`}
            </div>
            <div className='fixed top-12 text-black right-6 flex flex-row gap-1'>
                {lives}
            </div>
        </div>
    )
}

export default GameInfoOverlay
