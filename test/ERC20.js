const ERC20 = artifacts.require("Cryptos");

contract('Cryptos',function(accounts){
  var tokenInstance;
  it('initialize the contract with correct value', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name){
      assert.equal(name,"Viraj","checks name");
      return tokenInstance.symbol();
    }).then(function(symbol){
      assert.equal(symbol,'vkp','checks symbol');
    });
  });

  it('allocates the inital supply upon deployment', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(),1000000,"checks total supply");
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance){
      assert.equal(adminBalance.toNumber(),1000000,'checks balance of founder');
    });
  });

  it('transfer token ownership', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance; 
      return tokenInstance.transfer.call(accounts[1],10,{from : accounts[0]});
    }).then(function(success){
      assert.equal(success.toString(),"true","it returns true");
      return tokenInstance.transfer(accounts[1],10,{from : accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,'triggers one event');
      assert.equal(receipt.logs[0].event,'Transfer','should be the transfer event');
      assert.equal(receipt.logs[0].args._from,accounts[0],'logs account transfered from');
      assert.equal(receipt.logs[0].args._to,accounts[1],'logs account transfered to');
      assert.equal(receipt.logs[0].args._value,10,'logs value transfered from');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance){
      assert.equal(balance.toNumber(),10, "check balance after transfer");
    })
  });
})