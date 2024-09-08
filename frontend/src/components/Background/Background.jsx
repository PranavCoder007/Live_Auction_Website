import './Background.css'
import cricket from '../../assets/cricket.jpg'
import crickets from '../../assets/crickets.jpg'
import kabaddi from '../../assets/kabaddi.jpg'
import kabaddis from '../../assets/kabaddis.jpg'

const Background = ({heroCount}) => {
      if(heroCount===0)
      {
        return <img src={cricket} className='background fade-in' alt="" />
      }
      else if(heroCount===1)
      {
        return <img src={crickets} className='background fade-in' alt="" />
      }
      else if(heroCount===2)
      {
        return <img src={kabaddi} className='background fade-in' alt="" />
      }
      else if(heroCount===3)
      {
        return <img src={kabaddis} className='background fade-in' alt="" />
      }
}

export default Background
