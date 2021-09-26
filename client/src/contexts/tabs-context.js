import { useState, createContext } from 'react'


export const TabsContext = createContext()


const TabsContextProvider = ({ children }) => {

  const [productOverview, setProductOverview] = useState(true)
  const [farmDetails, setFarmDetails] = useState(false)
  const [productDetails, setProductDetails] = useState(false)


  const handleProductOverview = () => {
    setProductOverview(true)
    setFarmDetails(false)
    setProductDetails(false)
  }

  const handleFarmDetails = () => {
    setFarmDetails(true)
    setProductOverview(false)
    setProductDetails(false)
  }
  

  const handleProductDetails = () => {
    setProductDetails(true)
    setProductOverview(false)
    setFarmDetails(false)
  }

 
  
  return(
    <TabsContext.Provider 
      value={{ 
        handleProductOverview, 
        productOverview,
        handleFarmDetails,
        farmDetails,
        handleProductDetails,
        productDetails,
      }}
    >
      { children }
    </TabsContext.Provider>
  )

}

export default TabsContextProvider