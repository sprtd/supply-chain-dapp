
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
const ETHBalance = payload => web3.eth.getBalance(payload)



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
          .harvestItem(originFarmName, originFarmInfo, originFarmLatitude, originFarmLongitude, productNotes, { from: distributor })
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
        .harvestItem(originFarmName, originFarmInfo, originFarmLatitude, originFarmLongitude, productNotes,  {from: farmer})
      const harvestFarmDetails = await supplyChain.fetchFarmDetails.call(sku)
      const { 
        itemSKU, 
        ownerID: fetchedOwner, 
        originFarmerID: fetchedFarmer, 
        originFarmName: fetchedFatmName,
        originFarmInfo: fetchedFarmInfo,
        originFarmLatitude: fetchedFarmLatitude,
        originFarmLongitude: fetchedFarmLongitude
      } = harvestFarmDetails

      const harvestProductDetails = await supplyChain.fetchProductDetails.call(sku)
      const { itemUPC, productNotes: fetchedProductNotes, status } = harvestProductDetails

    
      // farm 
      assert.equal(itemSKU, sku)
      assert.equal(fetchedOwner, farmer)
      assert.equal(fetchedFarmer, farmer)
      assert.equal(fetchedFatmName, originFarmName)
      assert.equal(fetchedFarmInfo, originFarmInfo)
      assert.equal(fetchedFarmLatitude, originFarmLatitude)
      assert.equal(fetchedFarmLongitude, originFarmLongitude)

      // product
      assert.equal(itemUPC, sku)
      assert.equal(fetchedProductNotes, productNotes)
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

    it('Transfers item ownership to distributor after buying item', async() => {
      let eventEmitted = false
      await supplyChain.ItemSold((err, res) => eventEmitted = true)
      
      const sku = 1
      const payAmount = toWei(1)
      const farmerETHBalBefore = await web3.eth.getBalance(farmer) // farmer's ETH balance before sale

      await supplyChain.enableDistributor(distributor, {from: deployer})

      
      
      await supplyChain.buyItem(sku, {from: distributor, value: payAmount})
      
      const harvestFarmDetails = await supplyChain.fetchFarmDetails(sku)
      const harvestProductDetails = await supplyChain.fetchProductDetails(sku)
      const { ownerID } = harvestFarmDetails
      const { status } = harvestProductDetails

      const farmerETHBalAfter = await web3.eth.getBalance(farmer) // farmer ETH balance after sale
      
      console.log('owner balance after buy', fromWei(farmerETHBalAfter))
    
      const ethDiff = farmerETHBalAfter - farmerETHBalBefore
      console.log('eth diff', fromWei(ethDiff.toString()))

      assert.equal(fromWei(payAmount), fromWei(ethDiff.toString())) // difference between farmer's initial ETH balance and farmer's final ETH balance equals amount paid by distributor

      assert.equal(status, 'Sold') // item status is marked as sold
      assert.equal(ownerID, distributor)  // distributor is the new owner
      assert.equal(eventEmitted, true, 'Error: ItemSold not emitted') // event emitted
    })

    it('Ships and transfers ownership of item from distributor to retailer', async() => {
      let eventEmitted = false 
      await supplyChain.ItemShipped((err, res) => eventEmitted = true)

      const sku = 1
      await supplyChain.enableRetailerAccount(sku, retailer, {from: deployer})
      
      await supplyChain.shipItem(sku, {from: distributor})
      const farmDetails = await supplyChain.fetchFarmDetails(sku)
      const productDetails = await supplyChain.fetchProductDetails(sku)

      const { ownerID } = farmDetails
      const { status } = productDetails

      assert.equal(status, 'Shipped') // item status is marked as shipped
      assert.equal(ownerID, retailer)  // distributor is the new owner
      assert.equal(eventEmitted, true, 'Error: ItemSold not emitted') // event emitted



    })

    it('Enables retailer mark item as received', async() => {
      let eventEmitted = false
      
      const sku = 1
      
      await supplyChain.receiveItem(sku, {from: retailer})
      await supplyChain.ItemReceived((err, res) => eventEmitted = true)
      const productDetails = await supplyChain.fetchProductDetails(sku)

      const { status } = productDetails

      assert.equal(status, 'Received') // item status is marked as received
      assert.equal(eventEmitted, true, 'Error: ItemSold not emitted') // event emitted
    })


    it('Allows  consumer purchase item, mark item as purchased and becomes new item owner', async () => {
      let eventEmitted = false
      const sku = 1
      await supplyChain.enableConsumerAccount(sku, consumer, {from: deployer})

      await supplyChain.purchaseItem(sku, {from: consumer})
      await supplyChain.ItemPurchased((err, res) => eventEmitted = true)

      const farmDetails = await supplyChain.fetchFarmDetails(sku)
      const productDetails = await supplyChain.fetchProductDetails(sku)

      const { ownerID } = farmDetails
      const { status } = productDetails

      console.log('owner', ownerID)
      console.log('status', status)

  
      assert.equal(ownerID, consumer)
      assert.equal(status, 'Purchased') // item status is marked as received
      assert.equal(eventEmitted, true, 'Error: ItemPurchased not emitted') 
    })

    it('Allows anyone fetch farm details', async () => {
      const sku = 1
      
      const farmDetails = await supplyChain.fetchFarmDetails.call(sku, {from: randomAccount})
      const { 
        itemSKU, 
        ownerID: fetchedOwner, 
        originFarmerID: fetchedFarmer, 
        originFarmName: fetchedFarmName,
        originFarmInfo: fetchedFarmInfo,
        originFarmLatitude: fetchedFarmLatitude,
        originFarmLongitude: fetchedFarmLongitude
      } = farmDetails

      // farm details
      assert.equal(itemSKU, sku)
      assert.equal(fetchedFarmer, farmer)
      assert.equal(fetchedOwner, consumer)
      assert.equal(fetchedFarmName, originFarmName)
      assert.equal(fetchedFarmInfo, originFarmInfo)
      assert.equal(fetchedFarmLatitude, originFarmLatitude)
      assert.equal(fetchedFarmLongitude, originFarmLongitude)

    })
    
    
    it('Allows anyone fetch product details', async () => {
      const sku = 1
      const productDetails = await supplyChain.fetchProductDetails.call(sku, {from: randomAccount})
      const { itemUPC, productNotes: fetchedProductNotes, status, distributorID, retailerID, consumerID } = productDetails
      
      // product details
      assert.equal(itemUPC, sku)
      assert.equal(distributorID, distributor)
      assert.equal(retailerID, retailer)
      assert.equal(consumerID, consumer)
      assert.equal(fetchedProductNotes, productNotes)
      assert.equal(status, 'Purchased')
    })
  })
})

