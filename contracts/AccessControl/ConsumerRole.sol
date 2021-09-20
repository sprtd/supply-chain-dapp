// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

import './Roles.sol';

contract ConsumerRole {
  using Roles for Roles.Role;
  Roles.Role private consumers;

  event ConsumerAdded(address indexed account, uint timestamp);
  event ConsumerRemoved(address indexed account, uint timestamp);

  modifier onlyConsumer() {
    require(isConsumer(msg.sender), 'only consumer');
    _;
  }

  function isConsumer(address _account) public view returns(bool) {
    return consumers.hasRole(_account);
  }


  constructor() {
    _addConsumer(msg.sender);
  }

  function _addConsumer(address _account) internal {
    consumers.add(_account);
  }

  function enableConsumer(address _account) public onlyConsumer {
    _addConsumer(_account);
    emit ConsumerAdded(_account, block.timestamp);
  }

  function _revokeConsumer(address _account) internal {
    consumers.remove(_account);

  }

  function revokeConsumer(address _account) public onlyConsumer {
    _addConsumer(_account);
    emit ConsumerRemoved(_account, block.timestamp);
  }

}