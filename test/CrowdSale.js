const ERC20 = artifacts.require("Cryptos");
const CrowdSale = artifacts.require("CrowdSale");
contract('CrowdSale',function(accounts){
  var tokenSaleInstance;
  var tokenInstance;
  var buyer = '0x3591C2C22C7E831d49feC94Bd407ED63aa35fCF0';
  var admin = '0xA1F0242e2F1ea7b940B5BDaf00AC1c4Cc9b753D0';
  var tokenPrice = 1000;
  var tokenAvailable = 750000;
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
  it('buying tokens', function(){
      numberOfTokens = 10;
      value = numberOfTokens*tokenPrice;
      
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance;
      return CrowdSale.deployed()
    }).then(function(instance){
       tokenSaleInstance = instance; 
       return tokenInstance.transfer(tokenSaleInstance.address,tokenAvailable,{from : admin});
    }).then(function(success){
      return tokenSaleInstance.buyTokens(numberOfTokens, {from : buyer,value : value});
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount){
      assert.equal(amount.toNumber(),numberOfTokens,"10 tokens sold till now");
      numberOfTokens = 800000;
      value = numberOfTokens*tokenPrice;
      return tokenSaleInstance.buyTokens(numberOfTokens, {from : buyer,value : value});
    }).then(assert.fail).catch(function(receipt){
      var soldToken = tokenSaleInstance.tokensSold()
      assert.equal(soldToken,numberOfTokens,"10 tokens sold till now");
    })
  });
 
});