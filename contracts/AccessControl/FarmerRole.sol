// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

import './Roles.sol';

contract FarmerRole {
  using Roles for Roles.Role;
  Roles.Role private farmers;

  event FarmerAdded(address indexed account);
  event FarmerRemoved(address indexed account);

  modifier onlyFarmer() {
    require(isFarmer(msg.sender), 'only farmer can call function');
    _;
  }

  constructor() {
    _addFarmer(msg.sender);
  }

  function isFarmer(address _account) public view returns(bool) {
    return farmers.hasRole(_account);

  }

  function _addFarmer(address _account) internal {
    farmers.add(_account);
    emit FarmerAdded(_account);
  }

  function addFarmer(address _account) external onlyFarmer {
    _addFarmer(_account);
  }

  function _revokeFarmer(address _account) internal {
    farmers.remove(_account);
    emit FarmerRemoved(_account);
  }

  function removeFarmer(address _account) external onlyFarmer {
    _revokeFarmer(_account);

  }

  


}


