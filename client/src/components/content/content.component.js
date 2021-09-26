import { useState, useContext } from 'react'
import { AccountContext } from '../../contexts/account-context'
import { FunctionContext } from '../../contexts/function-context'
import { TabsContext } from '../../contexts/tabs-context'
import Tabs from '../tabs/tabs.component'
import { ContentWrapper, DappContentWrapper, InputWrapper } from './content.style'

const Content = () => {
  const { productOverview,  farmDetails, productDetails } = useContext(TabsContext)


  const { contract } = useContext(FunctionContext)
  const { web3Account } = useContext(AccountContext)
  const [tokenId, setTokenId] = useState('')
  const [lookUpId, setLookUpId] = useState('')


 


  // exchange stars state
  const [account2, setAccount2] = useState('')
  const [tokenId1, setTokenId1] = useState('')
  const [tokenId2, setTokenId2] = useState('')


  // transfer star state
  const [recipient, setRecipient] = useState('')

 


  const lookUpStar = async() => {
    try{
      const result = await contract.methods.lookUpTokenIdToStarInfo(lookUpId).call()
      setLookUpId('')

    } catch(err) {
      console.log(err)
    }
  }

  const handleExchangeStars = async() => {
    try {
      await contract.methods.exchangeStars(tokenId1, account2, tokenId2, web3Account).send({ from: web3Account })
      setTokenId1('')
      setTokenId2('')
      account2('')
    } catch(err) {
      console.log(err)
    }
  }

 



  return (
    <ContentWrapper>
      <Tabs />
      {/* <span></span> */}
      <h2> Supply Chain Dapp </h2>
      <DappContentWrapper>

       
       
        <InputWrapper style={{display: productOverview ? 'flex' : 'none'}}>
          <input type="text" placeholder='Enter SKU' onChange={e => setTokenId(e.target.value) }  value={ tokenId } />
          <button onClick={ '' }>Overview</button>
        </InputWrapper>
      
        <InputWrapper style={{display: productOverview ? 'flex' : 'none'}}>
        
        </InputWrapper>
        <InputWrapper style={{display: productOverview ? 'flex' : 'none'}}>
        
        </InputWrapper>
       
        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="text" placeholder='Farm Name' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />
          <input type="text" placeholder='Farm Info' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />
          <input type="text" placeholder='Farm Latitude' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />
          <input type="text" placeholder='Farm Longitude' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />

          <button onClick={ lookUpStar }>Harvest</button>
        </InputWrapper>

        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />
          <button onClick={ lookUpStar }>Process</button>
        </InputWrapper>
        

        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />
          <button onClick={ lookUpStar }>Pack</button>
        </InputWrapper>
       
        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />
          <input type="number" placeholder='Enter Price' onChange={e => setLookUpId(e.target.value) }  value={ lookUpId } />
          <button onClick={ lookUpStar }>Put Up For Sale</button>
        </InputWrapper>


        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ handleExchangeStars }>Buy</button>
        </InputWrapper>

        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ handleExchangeStars }>Ship</button>
        </InputWrapper>

        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ handleExchangeStars }>Receive</button>
        </InputWrapper>

        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ handleExchangeStars }>Purchase</button>
        </InputWrapper>



        <InputWrapper style={{display: '' ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter tokenID...' onChange={e => setTokenId(e.target.value)} value={ tokenId }  />
          <input type="text" placeholder='Enter recipient address...' onChange={e => setRecipient(e.target.value) }  value={ recipient } />
          <button onClick={ '' }>Transfer Star</button>
        </InputWrapper>
      
      </DappContentWrapper>
    </ContentWrapper>
  )
}

export default Content
