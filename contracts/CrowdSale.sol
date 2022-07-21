// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;
import "./Interface.sol";
contract CrowdSale{
  address public admin;
  IERC20Interface public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;
  event Sell(address _buyer, uint256 _amount);
  constructor(IERC20Interface _tokenContract,uint256 _price){
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _price;
  }
  function buyTokens(uint256 _numberOfTokens) public payable{
      //Require msg.value >= numberOfTokens * tokenPrice
      require(msg.value == _numberOfTokens * tokenPrice);
      require(tokenContract.balanceOf(address(this))>= _numberOfTokens);
      // transfer successfull
      //keep track of number of tokens
      tokensSold += _numberOfTokens;
      // Emit Event
      emit Sell(msg.sender, _numberOfTokens);
  }
}
