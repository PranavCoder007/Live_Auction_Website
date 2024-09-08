import './Navbar.css'

const Navbar = () => {
  return (
    <div className='nav'>
      <div className='nav-logo'>Auction</div>
      <ul className='nav-menu'>
        <li>Home</li>
        <li>About</li>
        <li className='nav-contact'>Contact us</li>
      </ul>
    </div>
  )
}

export default Navbar
