// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

import './Roles.sol';


contract DistributorRole {
  using Roles for Roles.Role;
  Roles.Role private distributors;

  event DistributorAdded(address indexed account, uint timestamp);
  event DistributorRemoved(address indexed account, uint timestamp);

  modifier onlyDistributor() {
    require(isDistributor(msg.sender), 'unauthorized distributor');
    _;
  }

  constructor() {
    _addDistributor(msg.sender);
  }


  function isDistributor(address _account) public view returns(bool) {
    return distributors.hasRole(_account);
  }

  function _addDistributor(address _account) internal {
    distributors.add(_account);

  }

  function enableDistributor(address _account) public onlyDistributor {
    _addDistributor(_account);
    emit DistributorAdded(_account, block.timestamp);
  }

  function _revokeDistributor(address _account) internal {
    distributors.remove(_account);
  }

  function revokeDistributor(address _account) public onlyDistributor {
    _revokeDistributor(_account);
    emit DistributorRemoved(_account, block.timestamp);
  }
}