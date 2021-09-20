// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

import './Roles.sol';


contract RetailerRole {
  using Roles for Roles.Role;
  Roles.Role private retailers;

  event RetailerAdded(address indexed account, uint timestamp);
  event RetailerRemoved(address indexed account, uint timestamp);


  modifier onlyRetailer() {
    require(isRetailer(msg.sender), 'unauthorized retailer');
    _;

  }

  constructor() {
    _addRetailer(msg.sender);
  }

  function isRetailer(address _account) public view returns(bool) {
    return retailers.hasRole(_account);
  }

  function _addRetailer(address _account) internal {
    retailers.add(_account);
  }

  function enableRetailer(address _account) public onlyRetailer {
    _addRetailer(_account);
    emit RetailerAdded(_account, block.timestamp);

  }

  function _revokeRetailer(address _account) internal {
    retailers.remove(_account);
  }

  function revokeRetailer(address _account) public onlyRetailer {
    _revokeRetailer(_account);
    emit RetailerRemoved(_account, block.timestamp);
  }
  

}