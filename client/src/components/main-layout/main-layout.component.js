import { useContext, useEffect } from 'react'
// import { AccountContext } from '../../contexts/account-context'
// import { FunctionContext } from '../../contexts/function-context'
import { getWeb3 } from '../../utils/getWeb3'
import Content from '../content/content.component'
import { MainLayoutWrapper } from './main-layout.style'

const MainLayout = () => {
  // const { setWeb3Details } = useContext(AccountContext)
  // const { setContractInstance } = useContext(FunctionContext)

 

  useEffect(() => {
    // enableWeb3()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
   <MainLayoutWrapper>
     <Content />
   </MainLayoutWrapper>
  )
}

export default MainLayout
