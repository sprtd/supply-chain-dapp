const SupplyChain = artifacts.require('SupplyChain')

module.exports = async deployer => {
  await deployer.deploy(SupplyChain)
  const supplyChain = await SupplyChain.deployed()
  console.log('supplyChian address: ', supplyChain.address)
}