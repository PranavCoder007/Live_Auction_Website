import { useEffect, useState } from "react";
import Background from "../components/Background/Background";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";

const Hompage = () => {
  let heroData = [
    {text1: "Never Stop", text2:"PLAYING"},
    {text1: "Never stop", text2:"CREATING A TEAM"},
    {text1: "Never Stop", text2:"HAVING FUN"},
    {text1: "Indulge into our", text2:"AUCTION"},
  ]
  const [heroCount, setHeroCount] = useState(0);

  useEffect(()=>{
    setInterval(()=>{
        setHeroCount((count)=>{return count ===3 ? 0:count+1})
    },4000);
  },[])

  return (
    <div>
      <Background heroCount={heroCount}/>
      <Navbar/>
      <Hero
        heroData={heroData[heroCount]}
        heroCount={heroCount}
        setHeroCount={setHeroCount}
      />
    </div>
  )
}

export default Hompage
