const CrowdSale = artifacts.require("CrowdSale");
contract('CrowdSale',function(accounts){
  var tokenSaleInstance;
  var tokenPrice = 1000;
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
 
});