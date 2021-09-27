import { useState, useContext } from 'react'
import { AccountContext } from '../../contexts/account-context'
import { FunctionContext } from '../../contexts/function-context'
import { TabsContext } from '../../contexts/tabs-context'
import Tabs from '../tabs/tabs.component'

import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'


import { ContentWrapper, DappContentWrapper, InputWrapper, OverviewWrapper, ProductWrapper, ToolTip } from './content.style'
import { toWei, fromWei } from '../../utils/conversion'

const Content = () => {
  const { productOverview,  farmDetails, productDetails } = useContext(TabsContext)
  const [farmResult, setFarmResult] = useState('')
  const [productResult, setProductResult] = useState('')

  const { itemSKU, originFarmName, originFarmInfo, originFarmerID, ownerID,  originFarmLatitude, originFarmLongitude,  } = farmResult
  const { productPrice, productNotes: fetchedProductNotes, status, distributorID, retailerID, consumerID } = productResult


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
  
  const initialFarmerState =  {
    SKU: '', 
    address: ''
  }

  
  const [tokenId1, setTokenId1] = useState('')
  
  
  
  /* Handle Add Farmer ************************ */
  const [farmer, setFarmer] = useState(initialFarmerState)
  const handleAddFarmerChange = e => {
    const { name, value } = e.target
    setFarmer(prev => ({...prev, [name]: value}))
  }
  
    
  const addFarmerAccount  = async () => {
    try {
      await contract.methods.addFarmerAccount(farmer.SKU, farmer.address).send({from: web3Account})

    } catch(err) {
      console.log(err)
    }
  }

  
  
  /* Handle Harvest ************************ */
  const [harvestData, setHarvestData] = useState(initialHarvestState)
  const { farmName, farmInfo, farmLatitude, farmLongitude, productNotes } = harvestData

  const handleChange = e => {
    const { value, name } = e.target
    setHarvestData(prev => ({...prev, [name]: value}))
  }

  const handleHarvest = async() => {
    try {
      await contract.methods.harvestItem(farmName, farmInfo, farmLatitude, farmLongitude, productNotes).send({ from: web3Account })
      setHarvestData(initialHarvestState)
  
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



  
  /* Handle Process Item ************************ */
  const [processSKU, setProcessSKU] = useState('')
  
  const handleProcess  = async () => {
    try {
      const fetchedFarmDetails = await contract.methods.processItem(processSKU).send({from: web3Account})
      console.log('fetched details', fetchedFarmDetails)
      setFarmResult(fetchedFarmDetails)

    } catch(err) {
      console.log(err)
    }
  }


  
  /* Handle Pack Item ************************ */
  const [packSKU, setPackSKU] = useState('')

  const handlePack  = async () => {
    try {
      const fetchedFarmDetails = await contract.methods.packItem(packSKU).send({from: web3Account})
      console.log('fetched details', fetchedFarmDetails)
      setFarmResult(fetchedFarmDetails)

    } catch(err) {
      console.log(err)
    }
  }
  
 
  /* Handle Set Up For Sale ************************ */
  const initialForSaleState = {
    SKU: '', 
    price: ''
  }

  const [forSale, setForSale] = useState(initialForSaleState)

  const handleForSaleChange = e => {
    const { name, value } = e.target
    setForSale(prev => ({...prev, [name]: value}))
  }

  const handleForSale = async () => {
    try {
      await contract.methods.putUpItemForSale(forSale.SKU, toWei(forSale.price)).send({from: web3Account})
   

    } catch(err) {
      console.log(err)
    }
  }



  /* Handle Add Distributor ************************ */

  const [distributor, setDistributor] = useState('')

  const addDistributorAccount  = async () => {
    try {
      await contract.methods.enableDistributor(distributor).send({from: web3Account})

    } catch(err) {
      console.log(err)
    }
  }


  
  /* Handle Buy Item ************************ */
  const initialBuyState = {
    SKU: '', 
    price: ''
  }
  const [buySKU, setBuySKU] = useState(initialBuyState)

  const handleBuyChange = e => {
    const { name, value } = e.target
    setBuySKU(prev => ({...prev, [name]: value}))
  }

  const handleBuy = async () => {
    try {
      await contract.methods.buyItem(buySKU.SKU).send({from: web3Account, value: toWei(buySKU.price)})
    } catch(err) {
      console.log(err)
    }
  }



  /* Handle Add Retailer ************************ */
  const initialRetailerState = {
    SKU: '',
    address: ''
  }

  const [retailer, setRetailer] = useState(initialRetailerState)

  const handleRetailerChange = e => {
    const { name, value } = e.target
    setRetailer(prev => ({...prev, [name]: value}))
  }
  
  const addRetailerAccount  = async () => {
    try {
      const result = await contract.methods.enableRetailerAccount(retailer.SKU, retailer.address).send({from: web3Account})
      console.log('result here', result)

    } catch(err) {
      console.log(err)
    }
  }



  /* Handle Ship Item ************************ */
  const [shipSKU, setShipSKU] = useState(initialBuyState)

  const handleShip = async () => {
    try {
      const shipResult = await contract.methods.shipItem(shipSKU).send({from: web3Account})
      console.log('ship result here', shipResult)
    } catch(err) {
      console.log(err)
    }
  }

  /* Handle Receive Item ************************ */
  const [receiveSKU, setReceiveSKU] = useState(initialBuyState)

  const handleReceive = async () => {
    try {
    const receivedResult = await contract.methods.receiveItem(receiveSKU).send({from: web3Account})
    console.log('ship result here', receivedResult)
    } catch(err) {
      console.log(err)
    }
  }


   /* Handle Add Consumer ************************ */
  const initialConsumerState = {
    SKU: '',
    address: ''
  }

  const [consumer, setConsumer] = useState(initialConsumerState)

  const handleConsumerChange = e => {
    const { name, value } = e.target
    setConsumer(prev => ({...prev, [name]: value}))
  }
  
  const addConsumerAccount = async () => {
    try {
      const result = await contract.methods.enableConsumerAccount(consumer.SKU, consumer.address).send({from: web3Account})
      console.log('result here', result)

    } catch(err) {
      console.log(err)
    }
  }


    /* Handle Purchase Item ************************ */
    const [purchaseSKU, setPurchaseSKU] = useState(initialBuyState)

    const handlePurchase = async () => {
      try {
      const receivedResult = await contract.methods.purchaseItem(purchaseSKU).send({from: web3Account})
      console.log('ship result here', receivedResult)
      } catch(err) {
        console.log(err)
      }
    }
  

  

 





  return (
    <ContentWrapper>
      <Tabs />
      <DappContentWrapper>

        <InputWrapper style={{display: productOverview ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Enter SKU to get farm and product details </ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={e => setSKU(e.target.value) }  value={ sku } />
          </Tippy>
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
          { status ? <p>Status: { status }</p> : null}
          { productPrice ? <p>Product Price: { fromWei(productPrice) }ETH</p> : null}
          { fetchedProductNotes ? <p>Product Notes: { fetchedProductNotes }</p> : null }
          { ownerID ? <p>Owner: { ownerID.substring(0, 30) }</p> : null }
          { distributorID ? <p>Distributor: { distributorID.substring(0, 30) }</p> : null}
          { retailerID ? <p>Retailer: { retailerID.substring(0, 30) }</p> : null }
          { consumerID ? <p>Consumer: { consumerID.substring(0, 30) }</p> : null }
        </OverviewWrapper >
  
   
        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Only owner can add farmer</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={ handleAddFarmerChange } name='SKU' value={ farmer.SKU } /> 
             
          </Tippy>
            <input type="text" placeholder='Enter Prospective Farmer Address' onChange={ handleAddFarmerChange } name='address'  value={ farmer.address } />

            
          <button onClick={ addFarmerAccount }>Add Farmer</button>
        </InputWrapper>
      
        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Only farmer can harvest item</ToolTip>}>
            <input type="text" placeholder='Farm Name' onChange={handleChange } name='farmName'  value={ farmName } />
          </Tippy>
          <input type="text" placeholder='Farm Info' onChange={ handleChange } name='farmInfo' value={ farmInfo } />
          <input type="text" placeholder='Farm Latitude' onChange={ handleChange } name='farmLatitude'  value={ farmLatitude } />
          <input type="text" placeholder='Farm Longitude' onChange={ handleChange } name='farmLongitude'  value={ farmLongitude } />
          <input type="text" placeholder='Product Notes' onChange={ handleChange } name='productNotes'  value={ productNotes } />
          <button onClick={ handleHarvest }>Harvest</button>
        </InputWrapper>

        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Only farmer can process item</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={e => setProcessSKU(e.target.value) }  value={ processSKU } />
          </Tippy>
          <button onClick={ handleProcess }>Process</button>
        </InputWrapper>
      

        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <Tippy content={ <ToolTip>Only farmer can pack item</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={e => setPackSKU(e.target.value) }  value={ packSKU } />
          </Tippy>
          <button onClick={ handlePack }>Pack</button>
        </InputWrapper>
       
        <InputWrapper style={{display: farmDetails ? 'flex' : 'none'}}>
          <Tippy content={ <ToolTip>Only farmer can put item for sale</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={ handleForSaleChange }  name='SKU' value={ forSale.SKU } />
          </Tippy>
          <input type="number" placeholder='Enter Price in ETH' onChange={ handleForSaleChange } name='price'  value={ forSale.price } />
          <button onClick={ handleForSale }>Put Up For Sale</button>
        </InputWrapper>



   
        
        {/* Product ************************ ************************ ************************  */}

        <ProductWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Only owner can add distributor. <br /> Then switch to Distributor to buy </ToolTip>}>
            <input type="text" placeholder='Enter Prospective Distributor Address' onChange={e => setDistributor(e.target.value) }  value={ distributor } />
          </Tippy>
          
          <button onClick={ addDistributorAccount }>Add Distributor</button>

          <Tippy content={<ToolTip>Only distributor can buy</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={handleBuyChange}  name='SKU' value={ buySKU.SKU }  style={{marginTop: '20vh'}}/>
          </Tippy>
          <input type="number" placeholder='Enter Amount in ETH' onChange={handleBuyChange} name='price' value={ buySKU.price }  />
          <button onClick={ handleBuy }>Buy</button>
        </ProductWrapper>

        <ProductWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Only owner can add retailer</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={ handleRetailerChange } name='SKU' value={ retailer.SKU } />
          </Tippy>
          <input type="text" placeholder='Enter Prospective Retailer Address' onChange={ handleRetailerChange } name='address'  value={ retailer.address } />
          {console.log('retailer here', retailer)}
          <button onClick={ addRetailerAccount }>Add Retailer</button>

          <Tippy content={<ToolTip>Only distributor can ship</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={e => setShipSKU(e.target.value) }  value={ shipSKU }  style={{marginTop: '20vh'}}/>
          </Tippy>
          <button onClick={ handleShip }>Ship</button>
        </ProductWrapper>

       

        <ProductWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Only retailer can receive item</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={e => setReceiveSKU(e.target.value) }  value={ receiveSKU } />
          </Tippy>
          {console.log('receive sku', receiveSKU)}
          <button onClick={ handleReceive }>Receive</button>
        </ProductWrapper>

        <ProductWrapper style={{display: productDetails ? 'flex' : 'none'}}>
          <Tippy content={<ToolTip>Only deployer can add consumer</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={ handleConsumerChange } name='SKU' value={ consumer.SKU } />
          </Tippy>
          <input type="text" placeholder='Enter Prospective Consumer Address' onChange={ handleConsumerChange } name='address'  value={ consumer.address } />
          <button onClick={ addConsumerAccount }>Add Consumer</button>

          <Tippy content={<ToolTip>Only deployer can purchase item</ToolTip>}>
            <input type="number" placeholder='Enter SKU' onChange={e => setPurchaseSKU(e.target.value) }  value={ purchaseSKU }  style={{marginTop: '20vh'}}/>
          </Tippy>
          <button onClick={ handlePurchase }>Purchase</button>
        </ProductWrapper>


      </DappContentWrapper>
    </ContentWrapper>
  )
}

export default Content
