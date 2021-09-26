import { useState, useContext } from 'react'
import { AccountContext } from '../../contexts/account-context'
import { FunctionContext } from '../../contexts/function-context'
import { TabsContext } from '../../contexts/tabs-context'
import Tabs from '../tabs/tabs.component'
import { ContentWrapper, DappContentWrapper, InputWrapper, OverviewWrapper } from './content.style'

const Content = () => {
  const { productOverview,  farmDetails, productDetails } = useContext(TabsContext)
  const [farmResult, setFarmResult] = useState('')
  const [productResult, setProductResult] = useState('')


  const { contract } = useContext(FunctionContext)
  const { web3Account } = useContext(AccountContext)
  const [sku, setSKU] = useState('')


  const initialHarvestState = {
    farmName: '',
    farmInfo: '', 
    farmLatitude: '',
    farmLongitude: '',
    productNotes: ''
  }

  const initialForSaleState = {
    SKU: '', 
    price: ''
  }


  // harvest state
  const [harvestData, setHarvestData] = useState(initialHarvestState)


  const handleChange = e => {
    const { value, name } = e.target
    setHarvestData(prev => ({...prev, [name]: value}))
    
  }


  const handleProcess = e => {
    
  }
 
  const { farmName, farmInfo, farmLatitude, farmLongitude, productNotes } = harvestData

 


  // exchange stars state
  const [tokenId1, setTokenId1] = useState('')




  // harvest item function 
  const handleHarvest = async() => {
    try {
      await contract.methods.harvestItem(farmName, farmInfo, farmLatitude, farmLongitude, productNotes).send({ from: web3Account })
  
    } catch(err) {
      console.log(err)
    }
  }
  
  // overview
  const handleOverview = async () => {
    try {
      const fetchedFarmDetails = await contract.methods.fetchFarmDetails(sku).call()
      const fetchedProductDetails = await contract.methods.fetchProductDetails(sku).call()
      console.log('fetched details', fetchedFarmDetails)
      setFarmResult(fetchedFarmDetails)
      setProductResult(fetchedProductDetails)
    

    } catch(err) {
      console.log(err)
    }
  }

  const { itemSKU, originFarmName, originFarmInfo, originFarmerID, ownerID,  originFarmLatitude, originFarmLongitude,  } = farmResult
  const { itemUPC, productNotes: fetchedProductNotes, status, distributorID, retailerID, consumerID } = productResult

 



  return (
    <ContentWrapper>
      <Tabs />
      <DappContentWrapper>

       
       
        <InputWrapper style={{display: productOverview ? 'flex' : 'none'}}>
          <input type="text" placeholder='Enter SKU' onChange={e => setSKU(e.target.value) }  value={ sku } />
          <button onClick={ handleOverview }>Overview</button>
        </InputWrapper>

        <OverviewWrapper style={{display: productOverview ? 'flex' : 'none'}}>
          <h3>Farm Overview</h3>
          { itemSKU ? <p>SKU: { itemSKU }</p> : null}
          { originFarmName ? <p>Farm Name: { originFarmName }</p> : null}
          { originFarmerID ? <p>Farmer:  { originFarmerID.substring(0, 30) }</p> : null}
          { originFarmInfo ? <p>Farm Info: { originFarmInfo }</p> : null}
          { originFarmLatitude ? <p>Farm Latitude: { originFarmLatitude }</p> : null}
          { originFarmLongitude ? <p>Farm Longitude: { originFarmLongitude }</p> : null}
   
        </OverviewWrapper >

        <OverviewWrapper style={{display: productOverview ? 'flex' : 'none'}}>
          <h3>Product Overview</h3>
          { originFarmName ? <p>UPC: { itemUPC }</p> : null}
          { status ? <p>Status: { status }</p> : null}
          { fetchedProductNotes ? <p>Product Notes: { fetchedProductNotes }</p> : null }
          { ownerID ? <p>Owner: { ownerID.substring(0, 30) }</p> : null }
          { distributorID ? <p>Distributor: { distributorID.substring(0, 30) }</p> : null}
          { retailerID ? <p>Retailer: { retailerID.substring(0, 30) }</p> : null }
          { consumerID ? <p>Consumer: { consumerID.substring(0, 30) }</p> : null }
        </OverviewWrapper >
  
       
        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="text" placeholder='Farm Name' onChange={handleChange } name='farmName'  value={ farmName } />
          <input type="text" placeholder='Farm Info' onChange={ handleChange } name='farmInfo' value={ farmInfo } />
          <input type="text" placeholder='Farm Latitude' onChange={ handleChange } name='farmLatitude'  value={ farmLatitude } />
          <input type="text" placeholder='Farm Longitude' onChange={ handleChange } name='farmLongitude'  value={ farmLongitude } />
          <input type="text" placeholder='Product Notes' onChange={ handleChange } name='productNotes'  value={ productNotes } />
          {console.log(harvestData)}
          <button onClick={ handleHarvest }>Harvest</button>
        </InputWrapper>

        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setSKU(e.target.value) }  value={ sku } />
          <button onClick={ '' }>Process</button>
        </InputWrapper>
        

        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setSKU(e.target.value) }  value={ sku } />
          <button onClick={ '' }>Pack</button>
        </InputWrapper>
       
        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setSKU(e.target.value) }  value={ sku } />
          <input type="number" placeholder='Enter Price' onChange={e => setSKU(e.target.value) }  value={ sku } />
          <button onClick={ ''}>Put Up For Sale</button>
        </InputWrapper>


        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ '' }>Buy</button>
        </InputWrapper>

        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ '' }>Ship</button>
        </InputWrapper>

        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ '' }>Receive</button>
        </InputWrapper>

        <InputWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <input type="number" placeholder='Enter SKU' onChange={e => setTokenId1(e.target.value) }  value={ tokenId1 } />
          <button onClick={ '' }>Purchase</button>
        </InputWrapper>



      
      </DappContentWrapper>
    </ContentWrapper>
  )
}

export default Content
