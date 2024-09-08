import './Hero.css'
import arrow from '../../assets/ic.png'
import '../../pages/Login'
import { Link, useNavigate } from 'react-router-dom'


const Hero = ({heroData,setHeroCount,heroCount}) => {
  const navigate= useNavigate()
  return (
    <div className='hero'>
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className='auction' id='form' onClick={()=> navigate('/Login')}>
        <p>Let's start with the Auction</p>
        <img src={arrow} alt=''/>  
      </div>
      <div className='hero-dot-play'>
        <ul className="hero-dots">
            <li onClick={()=>setHeroCount(0)} className={heroCount===0?'hero-dot orange':"hero-dot"}></li>
            <li onClick={()=>setHeroCount(1)} className={heroCount===1?'hero-dot orange':"hero-dot"}></li>
            <li onClick={()=>setHeroCount(2)} className={heroCount===2?'hero-dot orange':"hero-dot"}></li>
            <li onClick={()=>setHeroCount(3)} className={heroCount===3?'hero-dot orange':"hero-dot"}></li>
        </ul>
      </div>
    </div>
  )
}

export default Hero
