pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  Token public token; // create a variable that represent the token smart contract
  uint public rate = 10;

  event TokensPurchased(
    address account, 
    address token,
    uint amount,
    uint rate
  );
  
  event TokensSold(
    address account, 
    address token,
    uint amount,
    uint rate
  );

  constructor(Token _token) public {
    token = _token; 
  }

  // function to but tokens
  function buyTokens() public payable{
    // Set a redemption rate - equals to the number of tokens the client receives for 1ETH
    // Amount of ETH * Redemption rate
    uint tokenAmount = msg.value * rate;

    // check if the contract has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount, "Available tokens not sufficient to complete swaping");

    token.transfer(msg.sender, tokenAmount);

    // emit an event when tokens are purchased
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
    // user can't sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);
    
    // calculate amount of ether to redeem
    uint etherAmount = _amount / rate;

    // require that EthSwap has enough Ether
    require(address(this).balance >= etherAmount);

    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);
    emit TokensSold(msg.sender, address(token), etherAmount, rate);
  }
}