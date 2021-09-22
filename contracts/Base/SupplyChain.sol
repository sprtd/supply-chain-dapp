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
  
  modifier sold(uint _sku) {
    require(items[_sku].itemState == State.Sold, 'not in sold state');
    _;
  }
  
  modifier shipped(uint _sku) {
    require(items[_sku].itemState == State.Shipped, 'not in shipped state');
    _;
  }
  

  modifier paidEnough(uint _price) {
    require(msg.value >= _price, 'amount paid must be higher than item price');
    _;
  }
  
  event ItemHarvested(uint upc, uint timestamp);
  event ItemProcessed(uint upc, uint timestamp);
  event ItemPacked(uint upc, uint timestamp);
  event ItemPutUpForSale(uint upc, uint timestamp);


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
  
  
  function transferOwnershipToAccount(address _account) public onlyOwner {
    owner = _account;
    transferOwnership(_account);
     
  }

  // harvest 
  function harvestItem(
    address _originFarmerID, 
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
      originFarmerID: _originFarmerID,
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


  function fetchFarmDetails(uint _upc) public view returns (
    uint itemSKU,
    // uint itemUPC,

    address ownerID,
    address originFarmerID,
    string memory originFarmInfo,
    string memory originFarmName,
    string memory originFarmLatitude,
    string memory originFarmLongitude
  ){
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
