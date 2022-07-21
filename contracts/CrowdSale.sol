// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;
import "./Interface.sol";
contract CrowdSale{
  address public admin;
  IERC20Interface public tokenContract;
  uint256 public tokenPrice;
  constructor(IERC20Interface _tokenContract,uint256 _price){
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _price;
  }

}
