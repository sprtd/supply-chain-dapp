// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

contract Ownable {
  address private origOwner;
  event TransferOwnership(address indexed oldOwner, address indexed newOwner);

  
  constructor() {
    origOwner = msg.sender;
    emit TransferOwnership(address(0), origOwner);

  }

  function ownerAccount() public view returns(address) {
    return origOwner;

  }

  function isOwner() public view returns(bool) {
    return msg.sender == origOwner;
  }
  
  modifier onlyOwner() {
    require(isOwner(), 'only owner can call function');
    _;
  }
  

  function _transferOwnership(address newOwner_) internal {
    require(newOwner_ != address(0), 'cannot transfer to addr 0');
    origOwner = newOwner_;
    emit TransferOwnership(origOwner, newOwner_);
  }


  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }


  function renounceOwnership() public onlyOwner {
    emit TransferOwnership(origOwner, address(0));
    origOwner = address(0);
  }


}