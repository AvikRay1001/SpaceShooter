import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';

type Props = {
  isMoving ?: boolean,
  what: any,
  soWhat: () => void,
  when: any;
}

const BoulderComponent = ({isMoving, what, soWhat, when}: Props) => {
    const [xState, setxState] = useState(0);
    const [yState, setyState] = useState(0);
    const [rotation, setrotation] = useState(0);
    const boulderRef = useRef(null);

    useEffect(() => {
      detectCollision();
    }, [when])

    const detectCollision = () => {
      if(boulderRef.current){
        const boulder = (boulderRef.current as any).getBoundingClientRect();
        const didCollide = boulder.left + 30 < what.right && boulder.right - 30 > what.left && boulder.bottom - 30 > what.top && boulder.top + 30 < what.bottom;
        if(didCollide){
          soWhat();
        }
      }
    }
    

    useEffect(() => {
      setxState(Math.random()* (window.innerWidth - 80));
      setyState(- Math.random()*100 - 100);
      setrotation(Math.random()*360);
    }, [])
    

  return (
    <div ref={boulderRef} className='boulder-shadow' style={{
        position: "absolute",
        left: xState,
        top: yState,
        animation: 'moveDown 10s linear forwards',
        animationPlayState: isMoving ? 'running' : 'paused',
    }}>
        <Image src={'/boulder.png'} width={60} height={60} alt={''} style={{
            rotate: `${rotation}deg`,
        }}/>
    </div>
  )
}


export default BoulderComponent;