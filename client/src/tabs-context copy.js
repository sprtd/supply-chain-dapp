import { useState, createContext } from 'react'


export const TabsContext = createContext()


const TabsContextProvider = ({ children }) => {

  const [createStar, setCreateStar] = useState(true)
  const [lookUpStar, setLookUpStar] = useState(false)
  const [exchangeStar, setExchangeStar] = useState(false)
  const [transferStar, setTransferStar] = useState(false)


  const handleCreateStar = () => {
    setCreateStar(true)
    setLookUpStar(false)
    setExchangeStar(false)
    setTransferStar(false)
  }

  const handleLookUpStar = () => {
    setLookUpStar(true)
    setCreateStar(false)
    setExchangeStar(false)
    setTransferStar(false)
  }

  const handleExchangeStar = () => {
    setExchangeStar(true)
    setCreateStar(false)
    setLookUpStar(false)
    setTransferStar(false)
  }

  const handleTransferStar = () => {
    setTransferStar(true)
    setCreateStar(false)

    setLookUpStar(false)
    setExchangeStar(false)


  }
  
  return(
    <TabsContext.Provider 
      value={{ 
        handleCreateStar, 
        createStar,
        handleLookUpStar,
        lookUpStar,
        handleExchangeStar,
        exchangeStar,
        handleTransferStar,
        transferStar
      }}
    >
      { children }
    </TabsContext.Provider>
  )

}

export default TabsContextProvider