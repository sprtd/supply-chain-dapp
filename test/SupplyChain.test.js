
const SupplyChain = artifacts.require('SupplyChain')
let supplyChain, accounts, deployer, farmer, distributor, retailer, consumer, randomAccount

// harvest parameters
let originFarmerID
let originFarmName = 'Alpha Farm 1'
let originFarmInfo = 'Mechanized Apple Farming'
let originFarmLatitude = process.env.LATITUDE
let originFarmLongitude = process.env.LONGITUDE
let productNotes = 'Large-scale harvest'

// conversion helpers
const toWei = payload => web3.utils.toWei(payload.toString(), 'ether')
const fromWei = payload => web3.utils.fromWei(payload.toString(), 'ether')


contract('Supply Chain', async accountsPayload => {
  accounts = accountsPayload
  deployer = accounts[0]
  farmer = accounts[1]
  distributor = accounts[2]
  retailer = accounts[3]
  consumer = accounts[4]
  randomAccount = accounts[5]
  
  originFarmerID = farmer


  before(async() => {
    supplyChain = await SupplyChain.deployed()
    
  })

  contract('Deployment', () => {
    it('Sets sku to 0 and deployer as owner', async() => {
      const skuCount = await supplyChain.getTotalItems()
      const deployerAccount = await supplyChain.getOwner()
      assert.equal(skuCount.toNumber(), 0)
      assert.equal(deployerAccount, deployer)
    })
  })

  contract('Revert Non-Farmer', () => {
    // harvest parameters
    let ownerID = deployer
    let originFarmerID = deployer
    let originFarmerID2 = farmer
   
    
    it('Disallows non-farmer attempt to harvest farm produce', async() => {
      const REVERT  = 'Returned error: VM Exception while processing transaction: revert only farmer can call function'
      try {
        await supplyChain
          .harvestItem(originFarmerID, originFarmName, originFarmInfo, originFarmLatitude, originFarmLongitude, productNotes, { from: distributor })
        throw null
        
      } catch(err) {
        assert(err.message.startsWith(REVERT), `Expected ${REVERT} but got ${err.message} instead`) 
      } 
    })
  })

  contract('Supply Chain Phases', () => {
    it('Allows farmer to harvest farm produce', async () => {
      const sku = 1

      // transfer ownership to farmer
      await supplyChain.transferOwnershipToAccount(farmer, {from: deployer})

      // add farmer address as farmerID
      await supplyChain.addFarmer(farmer, {from: deployer})
      
      // event
      let eventEmitted = false
      await supplyChain.ItemHarvested((err, res) => {
        eventEmitted = true
      })
     
      await supplyChain
        .harvestItem(farmer, originFarmName, originFarmInfo, originFarmLatitude, originFarmLongitude, productNotes,  {from: farmer})
      const harvestFarmDetails = await supplyChain.fetchFarmDetails.call(sku)
      const { 
        itemSKU, 
        ownerID: harvestOwnerID, 
        originFarmerID: harvestOriginFarmerID, 
        originFarmName: harvestOriginFarmName,
        originFarmInfo: harvestOriginFarmInfo,
        originFarmLatitude: harvestOriginFarmLatitude,
        originFarmLongitude: harvestOriginFarmLongitude
      } = harvestFarmDetails

      const harvestProductDetails = await supplyChain.fetchProductDetails.call(sku)
      const { itemUPC, productNotes: harvestProductNotes, status } = harvestProductDetails

    
      // farm 
      assert.equal(itemSKU, sku)
      assert.equal(harvestOwnerID, farmer)
      assert.equal(harvestOriginFarmerID, farmer)
      assert.equal(harvestOriginFarmName, originFarmName)
      assert.equal(harvestOriginFarmInfo, originFarmInfo)
      assert.equal(harvestOriginFarmLatitude, originFarmLatitude)
      assert.equal(harvestOriginFarmLongitude, originFarmLongitude)

      // product
      assert.equal(itemUPC, sku)
      assert.equal(harvestProductNotes, productNotes)
      assert.equal(status, 'Harvested')
      assert.equal(eventEmitted, true, 'Error: ItemHarvested event not emitted')
    })

    it('Allows farmer to process farm produce to product', async () => {

      // event
      let eventEmitted = false
      await supplyChain.ItemPacked((err, res) => eventEmitted = true)


      const sku = 1
      await supplyChain.processItem(sku, {from: farmer})
      const harvestProductDetails = await supplyChain.fetchProductDetails(sku)
      const { status } = harvestProductDetails

      // product
      assert.equal(status, 'Processed')
      assert.equal(eventEmitted, true, 'Error: ItemProcessed event not emitted')
    })

    // pack item
    it('Allows farmer to pack product', async () => {
      let eventEmitted = false
      await supplyChain.ItemPacked((err, res) => eventEmitted = true)
      const sku = 1
      await supplyChain.packItem(sku, {from: farmer})
      
      const harvestProductDetails = await supplyChain.fetchProductDetails(sku)
      const { status } = harvestProductDetails
      
      // product
      assert.equal(status, 'Packed')
    })
    
    it('Allows farmer put up processed product for sale', async() => {

      let eventEmitted = false
      await supplyChain.ItemPutUpForSale((err, res) => eventEmitted = true)

      const sku = 1
      const itemPrice = toWei(1)
      await supplyChain.putUpItemForSale(sku, itemPrice, {from: farmer})
      
      const harvestProductDetails = await supplyChain.fetchProductDetails(sku)
    

      const { status, productPrice } = harvestProductDetails
      assert.equal(status, 'For Sale')
      assert.equal(fromWei(productPrice), 1 )
      assert.equal(eventEmitted, true, 'Error: ItemPutUpForSale not emitted')
    })
  })

  

  
})

