const ERC20 = artifacts.require("Cryptos");

contract('Cryptos',function(accounts){
  it('sets the name on deployment', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name){
      assert.equal(name,"Virajs","sets name");
    });
  });
})