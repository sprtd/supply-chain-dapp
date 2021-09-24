// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

import '../AccessControl/FarmerRole.sol';
import '../AccessControl/DistributorRole.sol';
import '../AccessControl/RetailerRole.sol';
import '../AccessControl/ConsumerRole.sol';

import '../Core/Ownable.sol';


contract SupplyChain is FarmerRole, DistributorRole, RetailerRole, ConsumerRole, Ownable {

  address deployer;
  address owner;
  uint upc;
  uint sku;



  enum State {
    Unassigned, 
    Harvested, 
    Processed,
    Packed,
    ForSale,
    Sold,
    Shipped,
    Received,
    Purchased
  }

  State constant defaultState = State.Unassigned;


  struct Item {
      uint sku;
      uint upc;
      address ownerID;
      address originFarmerID;
      string originFarmName;
      string originFarmInfo;
      string originFarmLatitude;
      string originFarmLongitude;
      uint productID;
      string productNotes;
      uint productPrice;
      State itemState;
      address distributorID;
      address retailerID;
      address consumerID;
  }

  mapping(uint => Item) items;
  mapping(uint => string[]) itemsHistory;
  
  
 modifier notZeroAddress(address _account) {
     require(_account != address(0), 'cannot be black hole account');
     _;
 }
  
  modifier checkSKU(uint _sku) {
      require(_sku > 0, 'sku cannot be 0');
      _;
  }

  modifier verifyCaller(address _account) {
      require(msg.sender == _account, 'unauthorized');
      _;
  }

  modifier harvested(uint _sku) {
    require(items[_sku].itemState == State.Harvested, 'not in harvested state');
    _;
  }

  modifier processed(uint _sku) {
    require(items[_sku].itemState == State.Processed, 'not in processed state');
    _;
  }

  modifier packed(uint _sku) {
    require(items[_sku].itemState == State.Packed, 'not in packed state');
    _;
  }
  
  modifier forSale(uint _sku) {
      require(items[_sku].itemState == State.ForSale, 'status: not up for sale');
      _;
  }
  
    modifier paidEnough(uint _price) {
    require(msg.value >= _price, 'amount paid must be higher than item price');
    _;
  }
  
  modifier checkValue(uint _sku) {
      _;
      address distributor = items[_sku].distributorID;
    uint price = items[_sku].productPrice;
    uint amountToRefund = msg.value - price;
    (bool success,) = payable(distributor).call{value: amountToRefund}('');
    require(success, 'failed to send ether');
  }
  
  modifier sold(uint _sku) {
      require(items[_sku].itemState == State.Sold, 'not in sold state');
      _;
  }
  
  modifier shipped(uint _sku) {
      require(items[_sku].itemState == State.Shipped, 'not in shipped state');
      _;
  }
  


  event ItemHarvested(uint sku, uint timestamp);
  event ItemProcessed(uint sku, uint timestamp);
  event ItemPacked(uint sku, uint timestamp);
  event ItemPutUpForSale(uint sku, uint timestamp);
  event ItemSold(uint sku, uint timestamp);
  event ItemShipped(uint sku, uint timestamp);
  event ItemReceived(uint sku, uint timestamp);


  constructor() {
    deployer = msg.sender;
    owner = msg.sender;
    sku = 0;
    upc = 0;
  }

  function kill() public {
    if(msg.sender == owner) {
      selfdestruct(payable(owner));
    }
  }
  
  
  function addFarmerAccount(uint _sku, address _account) public onlyOwner checkSKU(_sku) notZeroAddress(_account) {
    _addFarmer(_account);
    items[_sku].ownerID = _account;
    transferOwnershipToAccount(_account);
      
  }
  
  
  
  function transferOwnershipToAccount(address _account) public onlyOwner notZeroAddress(_account) {
    owner = _account;
    transferOwnership(_account);
  }
  
  function transferOwnershipToDistributor(uint _sku, address _account) notZeroAddress(_account) public {
    address distributor = items[_sku].distributorID;
    require(_account == distributor, 'must be distributor already');
    owner = distributor;
      
  }

  // enable retailser
  function enableRetailerAccount(uint _sku, address _account) public onlyDistributor checkSKU(_sku) notZeroAddress(_account)  {
    enableRetailer(_account);
    items[_sku].retailerID = _account;
  }


  // transfer ownership to retailer
  function transferOwnershipToRetailer(uint _sku, address _account)  public notZeroAddress(_account) onlyDistributor {
    address retailer = items[_sku].retailerID;
    require(_account == retailer, 'must be an existing retailer');
    owner = retailer;
    items[_sku].ownerID = retailer;
  }
  
  
  
  
  
  // harvest 
  function harvestItem(
    string memory _originFarmName, 
    string memory _originFarmInfo, 
    string memory _originFarmLatitude, 
    string memory _originFarmLongitude, 
    string memory _productNotes
  )  public  onlyFarmer {
    sku += 1;
    uint productID = upc + sku;
    items[sku] = Item({
      sku: sku,
      upc: sku,
      ownerID: owner,
      originFarmerID: owner,
      originFarmName: _originFarmName,
      originFarmInfo: _originFarmInfo,
      originFarmLatitude: _originFarmLatitude,
      originFarmLongitude: _originFarmLongitude,
      productID: productID,
      productNotes: _productNotes,
      productPrice: 0,
      itemState: State.Harvested,
      distributorID: address(0),
      retailerID: address(0),
      consumerID: address(0)
    });
    
  
    emit ItemHarvested(sku, block.timestamp);
  }

  // process 
  function processItem(uint _sku) public checkSKU(_sku) harvested(_sku) onlyFarmer {
    items[_sku].itemState = State.Processed;
    emit ItemProcessed(_sku, block.timestamp);
  }

  // pack
    function packItem(uint _sku) public checkSKU(_sku) processed(_sku) onlyFarmer {
    items[_sku].itemState = State.Packed;
    emit ItemPacked(_sku, block.timestamp);
  }
  
    function putUpItemForSale(uint _sku, uint _price) public packed(_sku) onlyFarmer {
    items[_sku].itemState = State.ForSale;
    items[_sku].productPrice = _price;
    emit ItemPutUpForSale(_sku, block.timestamp);
  }
  
  function buyItem(uint _sku) public payable forSale(_sku) paidEnough(items[_sku].productPrice) checkValue(_sku) onlyDistributor {
    address distributor = msg.sender;
    items[_sku].distributorID = distributor;
    address farmer = items[_sku].originFarmerID;
    uint price = items[_sku].productPrice;
    items[_sku].itemState = State.Sold;
    (bool succes, ) = payable(farmer).call{value: price}('');
    require(succes, 'failed to send ether to farmer');
    items[_sku].ownerID = distributor;
    transferOwnershipToDistributor(_sku, distributor);
    emit ItemSold(_sku, block.timestamp);
  }

  function shipItem(uint _sku) public sold(_sku)  onlyDistributor {
      
    address retailer = items[_sku].retailerID;
    items[_sku].itemState = State.Shipped;
    transferOwnershipToRetailer(_sku, retailer);
    emit ItemShipped(_sku, block.timestamp);
  }
  
  function receiveItem(uint _sku) public shipped(_sku) onlyRetailer {
    items[_sku].itemState = State.Received;
    emit ItemReceived(_sku, block.timestamp);
      
  }
      
    
  
  function getItemStatus(uint _sku) public checkSKU(_sku) view returns(string memory status) {
    uint itemStatus = uint(items[_sku].itemState);
    if(itemStatus == 0) {
        status = 'Unassigned';
    } else if(itemStatus == 1) {
        status = 'harvested';
    } else if(itemStatus == 2) {
        status = 'Processed';
        
    }  else if(itemStatus == 3) {
        status = 'Packed';
    }
    else if(itemStatus == 4) {
        status = 'For Sale';
    } else if(itemStatus == 5) {
        status = 'Sold';
    } else if(itemStatus == 6) {
        status = 'Shipped';
    } else if(itemStatus == 7) {
        status = 'Received';
    } else if(itemStatus == 8) {
        status = 'Purchased';
    }
    
  }
  
    
  function getTotalItems() public view returns(uint) {
    return sku;
  }
  
  
  function getOwner() public view returns(address) {
    return owner;
  }

  function getItemOwner(uint _sku) checkSKU(_sku) public view returns(address) {
    return items[_sku].ownerID;
  }


  function fetchFarmDetails(uint _upc)  public view returns (
    uint itemSKU,
    address ownerID,
    address originFarmerID,
    string memory originFarmInfo,
    string memory originFarmName,
    string memory originFarmLatitude,
    string memory originFarmLongitude
  ){
    require(_upc > 0, 'sku cannot be 0');
    return (
      items[_upc].sku,
      items[_upc].ownerID,
      items[_upc].originFarmerID,
      items[_upc].originFarmInfo,
      items[_upc].originFarmName,
      items[_upc].originFarmLatitude,
      items[_upc].originFarmLongitude
    );
      
  }
  
  
    
  function fetchProductDetails(uint _upc)  public checkSKU(_upc) view returns (
    uint itemSKU,
    uint itemUPC,
    uint productID,
    string memory productNotes,
    uint productPrice,
    string memory status,
    address distributorID,
    address retailerID,
    address consumerID
    ) {
      itemSKU = items[_upc].sku;
      itemUPC = items[_upc].upc;
      productID = items[_upc].productID;
      productNotes = items[_upc].productNotes;
      productPrice = items[_upc].productPrice;
      uint itemState = uint(items[_upc].itemState);
      if(itemState == 0) {
          status = 'Unassigned';
      } else if(itemState == 1) {
          status = 'Harvested';
      } else if(itemState == 2) {
          status = 'Processed';
      }
      else if(itemState == 3) {
          status = 'Packed';
      } else if(itemState == 4) {
          status = 'For Sale';
      } else if(itemState == 5) {
          status = 'Sold';
      } else if(itemState == 6) {
          status = 'Shipped';
      } else if(itemState == 7) {
          status = 'Received';
      } else if(itemState == 8) {
          status = 'Purchased';
      }
      distributorID = items[_upc].distributorID;
      retailerID = items[_upc].retailerID;
      consumerID = items[_upc].consumerID;
  }

    
    


}
