import { useState, createContext } from 'react'

export const FunctionContext = createContext()


const FunctionContextProvider = ({ children }) => {
  const [adopters, setAdopters] = useState('')

  const [contract, setContract] = useState('')

  

  // set contract instance
  const setContractInstance = payload => {
    setContract(payload)
    
  }


  // get adopters array
  const getAdopters = payload => {
    setAdopters(payload)

  }

  return(
    <FunctionContext.Provider value={{ contract, setContractInstance, getAdopters, adopters }}>
      { children }
    </FunctionContext.Provider>

  )
}


export default FunctionContextProvider