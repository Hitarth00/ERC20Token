const ERC20 = artifacts.require("Cryptos");
const CrowdSale = artifacts.require("CrowdSale");
contract('CrowdSale',function(accounts){
  var tokenSaleInstance;
  var tokenInstance;
  var buyer = '0x3591C2C22C7E831d49feC94Bd407ED63aa35fCF0';
  var admin = '0xA1F0242e2F1ea7b940B5BDaf00AC1c4Cc9b753D0';
  var tokenPrice = 1000;
  var  tokensAvailable  = 750000;
  it('initialize the contract with correct value', function(){
    return CrowdSale.deployed().then(function(instance){
      tokenSaleInstance = instance;
      return tokenSaleInstance.admin();
    }).then(function(admin){
      assert.equal(admin,0xA1F0242e2F1ea7b940B5BDaf00AC1c4Cc9b753D0,"checks admin");
      return tokenSaleInstance.address;
    }).then(function(address){
      assert.notEqual(address,0x0,'has token addres equal to 0')
      return tokenSaleInstance.tokenContract();
    }).then(function(address){
      assert.notEqual(address,0x0,'has tokencontract addres equal to 0')
      return tokenSaleInstance.tokenPrice();
    }).then(function(price){
      assert.equal(tokenPrice,price,"tokenPrice is equal to price")
    })  
  });
  // it('buying tokens', function(){
  //   return ERC20.deployed().then(function(instance){
  //     tokenInstance = instance;
  //     return CrowdSale.deployed();
  //   }).then(function(instance){
  //      tokenSaleInstance = instance; 
  //      return tokenInstance.transfer(tokenSaleInstance.address,tokenAvailable,{from : admin});
  //   }).then(function(receipt){
  //     assert.equal(receipt.logs.length, 1, 'triggers one event');
  //     assert.equal(receipt.logs[0].event,'Transfer','should be the transfer event');
  //     assert.equal(receipt.logs[0].args._from,accounts[0],'logs account transfered from');
  //     assert.equal(receipt.logs[0].args._to,tokenSaleInstance.address,'logs account transfered to');
  //     assert.equal(receipt.logs[0].args._value,tokenAvailable,'logs value transfered from');
  //     return tokenInstance.balanceOf(tokenSaleInstance.address);
  //   }).then(function(amount){
  //     assert.equal(amount.toNumber(),tokenAvailable,"Token transfered");
  //     return tokenSaleInstance.buyTokens(100,{from : buyer, value : 1000*100});
  //   }).then(function(receipt){
  //     assert.equal(receipt.logs.length, 1, 'triggers one event');
  //     assert.equal(receipt.logs[0].event,'Sell','should be the transfer event');
  //     assert.equal(receipt.logs[0].args._buyer,buyer,'logs account transfered from');
  //     assert.equal(receipt.logs[0].args._amount,100,'logs account transfered to');
  //     //assert.equal(receipt.logs[0].args._value,100,'logs value transfered from');
  //     return tokenInstance.balanceOf(tokenSaleInstance.address);
  //   }).then(function(amount){
  //     assert.equal(amount.toNumber(),749900,"Balance check of contract");
  //   })
  // });
  it('facilitates token buying', function() {
    return ERC20.deployed().then(function(instance) {
      // Grab token instance first
      tokenInstance = instance;
      return CrowdSale.deployed();
    }).then(function(instance) {
      // Then grab token sale instance
      tokenSaleInstance = instance;
      // Provision 75% of all tokens to the token sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
    }).then(function(receipt) {
      numberOfTokens = 10;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    })
    // }).then(function(balance) {
    //   assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
    //   // Try to buy tokens different from the ether value
    //   return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
    // }).then(assert.fail).catch(function(error) {
    //   assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
    //   return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
    // }).then(assert.fail).catch(function(error) {
    //   assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
    // });
  });

});