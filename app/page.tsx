"use client";

import BoulderComponent from "@/components/BoulderComponent";
import GameInfoOverlay from "@/components/GameInfoOverlay";
import HandRecognizer from "@/components/HandRecognizer";
import RocketComponent from "@/components/RocketComponent";
import { playBackground, playFX } from "@/utils/audiohandler";
import { useEffect, useRef, useState } from "react";

let generationInterval: any;
let removalInterval: any;
let isInvincible = false;
let distanceInterval: any;
let livesRemaining: number;

export default function Home() {
  const [rocketLeft, setrocketLeft] = useState(0);
  const [isDetected, setisDetected] = useState(false);
  const [degrees, setdegrees] = useState(0);
  const [boulders, setboulders] = useState<any[]>([])
  const [detectCollisionTrigger, setdetectCollisionTrigger] = useState<number>(0)
  const [isLoading, setisLoading] = useState(false);
  const [isColliding, setisColliding] = useState(false);
  const [distance, setdistance] = useState(0);
  const [livesRemainingstate, setlivesRemainingstate] = useState(0)
  const [isGameOver, setisGameOver] = useState(false);


  const rocketRef = useRef(null);
  const [rocket, setrocket] = useState<any>();
  useEffect(() => {
    setrocketLeft(window.innerWidth/2);
    livesRemaining = 3;
    setlivesRemainingstate(livesRemaining);
  }, [])


  useEffect(() => {
    if(isDetected && !isGameOver){
      distanceInterval = setInterval(()=>{
        setdistance((prev => prev+1))
      },100)
    }

    return () => {
      clearInterval(distanceInterval);
    }
  }, [isDetected, isGameOver])
  


  useEffect(() => {
    if(isDetected && !isGameOver){
    generationInterval = setInterval(()=>{
      setboulders(prevArr => {
        let retArr = [...prevArr];
        for(let i = 0; i < 4; i++){
          const now = Date.now();
          retArr = [...retArr,{
            timestamp: now,
            key: `${now}-${Math.random()}`,
          }];
        }
        return retArr;
      })
    }, 1000);

    removalInterval = setInterval(()=>{
      const now = Date.now();
      setboulders(prevArr => {
        return prevArr.filter((b) => {
          return (now - b.timestamp) < 5000;
        })
      })
    },5000)
  }

    return () => {
      clearInterval(generationInterval);
      clearInterval(removalInterval);
    }
  }, [isDetected, isGameOver])
  
  

  const setHandResults = (result: any) => {
    setisLoading(result.isLoading);
    setisDetected(result.isDetected);
    setdegrees(result.degrees);

    if(result.degrees && result.degrees !== 0){
      setdetectCollisionTrigger(Math.random);
      setrocketLeft((prev) => {
        const ret = prev - result.degrees/6;

        if(ret < 20){
          return prev;
        }

        if(ret >  window.innerWidth - 52){
          return prev;
        }
        return ret;
      })
    }
    setrocket((rocketRef.current as any).getBoundingClientRect());
  }

  const collisionHandler = () => {
    if(!isInvincible && !isGameOver){
      console.log("COLLISION");
      isInvincible = true;
      setisColliding(isInvincible);
      playFX();
      livesRemaining--;
      setlivesRemainingstate(livesRemaining);
      if(livesRemaining <= 0){
        setisGameOver(true);
      }
      setTimeout(() => {
        isInvincible = false;
        setisColliding(isInvincible);
      }, 1500);
    }

    
  }


  useEffect(() => {
    if(isDetected && !isGameOver){
      playBackground(false);
    }else{
      playBackground(true);
    }
  }, [isDetected, isGameOver])
  


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className={`absolute left-3 top-3 z-30 transition-all duration-500 ${isDetected ? 'w-24' : 'w-48'}`}>
        <HandRecognizer setHandResults={setHandResults}/>
      </div>
      <div ref={rocketRef} id="rocket-container" style={{
        position: "absolute",
        left: rocketLeft,
        transition: 'all',
        animationDuration: '10ms',
        marginTop: '500px',
      }}>
        <RocketComponent degrees={degrees}/>
      </div>
      <div className="absolute z-10 h-screen w-screen overflow-hidden">
        {boulders.map((b) => {
          return <BoulderComponent key={b.key} isMoving={isDetected} what={rocket} soWhat={collisionHandler} when={detectCollisionTrigger}/>
        })}
      </div>
      <GameInfoOverlay info={{isLoading, isDetected, isColliding, distance, livesRemainingstate, isGameOver}}/>
    </div>
  );
}
