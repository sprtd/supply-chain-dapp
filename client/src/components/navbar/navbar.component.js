import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/account-context'
import { NavBarWrapper, NavBarItems, Logo, Hamburger } from './navbar.style'

const Navbar = () => {
  const { web3Account } = useContext(AccountContext)
  const [toggleNav, setToggleNav] = useState(false)

  const handleToggle = () => setToggleNav(prev => !prev)

  return (
    <NavBarWrapper toggleNav={ toggleNav }>
      <Logo>
        <Link to='/'>StarNotary</Link>
      </Logo>
      <Hamburger  onClick={()  => {
        console.log('toggle clicked!', toggleNav)
        setToggleNav(prev => !prev)}
      }>
        <span ></span>
        <span></span>
        <span></span>
      </Hamburger >
      <NavBarItems toggleNav={ handleToggle }>
        <ul >
          <li>Profile</li>
          { web3Account ?  <li>{ web3Account.substring(0, 8) }</li> : <li>Connect Wallet</li> }
         
        </ul>
      </NavBarItems>
    </NavBarWrapper>
  )


}

export default Navbar
