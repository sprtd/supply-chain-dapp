const SupplyChain = artifacts.require('SupplyChain')
let supplyChain, accounts, deployer, addr1, addr2, addr3

// harvest parameters
let originFarmerID
let originFarmName = 'Alpha Farm 1'
let originFarmInfo = 'Mechanized Apple Farming'
let originFarmLatitude = '9.059530059530'
let originFarmLongitude = '7.469260'
let productNotes = 'Large-scale harvest'

// conversion helpers
const toWei = payload => web3.utils.toWei(payload.toString(), 'ether')
const fromWei = payload => web3.utils.fromWei(payload, 'ether')


contract('Supply Chain', async accountsPayload => {
  accounts = accountsPayload
  deployer = accounts[0]
  addr1 = accounts[1]
  addr2 = accounts[2]
  addr3 = accounts[3]
  originFarmerID = deployer

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

  contract('Revert Non-Owner', () => {
    // harvest parameters
    let ownerID = deployer
    let originFarmerID = deployer
    let originFarmerID2 = addr1
   
    
    it('Disallows non-owner attempt to harvest farm produce', async() => {
      const REVERT  = 'Returned error: VM Exception while processing transaction: revert only owner can call function'
      try {
        await supplyChain
          .harvestItem(originFarmerID, originFarmName, originFarmInfo, originFarmLatitude, originFarmLongitude, productNotes, { from: addr1 })
        throw null
        
      } catch(err) {
        assert(err.message.startsWith(REVERT), `Expected ${REVERT} but got ${err.message} instead`) 
      } 
    })
  })

  contract('Harvest Farm Produce', () => {
    it('Allows owner harvest farm produce', async () => {
      const sku = 1
      await supplyChain
        .harvestItem(originFarmerID, originFarmName, originFarmInfo, originFarmLatitude, originFarmLongitude, productNotes, { from: deployer})
      const harvestFarmDetails = await supplyChain.fetchFarmDetails(sku)
      const { 
        itemSKU, 
        ownerID: harvestOwnerID, 
        originFarmerID: harvestOriginFarmerID, 
        originFarmName: harvestOriginFarmName,
        originFarmInfo: harvestOriginFarmInfo,
        originFarmLatitude: harvestOriginFarmLatitude,
        originFarmLongitude: harvestOriginFarmLongitude
      } = harvestFarmDetails

      const harvestProductDetails = await supplyChain.fetchProductDetails(sku)
      const { itemUPC, productNotes: harvestProductNotes, status } = harvestProductDetails

    
      // farm 
      assert.equal(itemSKU, sku)
      assert.equal(harvestOwnerID, deployer)
      assert.equal(harvestOriginFarmName, originFarmName)
      assert.equal(harvestOriginFarmInfo, originFarmInfo)
      assert.equal(harvestOriginFarmLatitude, originFarmLatitude)
      assert.equal(harvestOriginFarmLongitude, originFarmLongitude)

      // product
      assert.equal(itemUPC, sku)
      assert.equal(harvestProductNotes, productNotes)
      assert.equal(status, 'Harvested')
    })
  })

  
})

