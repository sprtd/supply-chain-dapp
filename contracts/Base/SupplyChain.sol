// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

contract SupplyChain {
  address owner;
  uint upc;
  uint sku;

  enum State {
    Unassigned, 
    Harvested, 
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
    address farmID;
    string originFarmInformation;
    string originFarmLatitude;
    string originFarmLongitude;
    uint productID;
    string productNotes;
    uint productPrice;
    State itemState;
    address distributorID;
    address retailerID;
  }


  mapping(uint => Item) items;
}
