import { useState, createContext } from 'react'

export const AccountContext = createContext()


const AccountContextProvider = ({ children }) => {

  const [ error, setError ] = useState({
    isError: false,
    msg: ''
  })

  const [lootOwner, setLootOwner] = useState('')

  const [web3Account, setWeb3Account] = useState()

  const setAccountDetails = payload => {
    setWeb3Account(payload)   

  }

  const setErrorState = payload => {
    setError(payload)
  }

  const handleOwner = payload => {
    setLootOwner(payload)
  }

  return(
    <AccountContext.Provider value={{ web3Account, setAccountDetails, setErrorState, error, handleOwner, lootOwner }}>
      { children }
    </AccountContext.Provider>

  )
}


export default AccountContextProvider