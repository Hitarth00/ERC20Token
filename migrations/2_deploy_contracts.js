
const ERC20 = artifacts.require("Cryptos");
const CrowdSale = artifacts.require("CrowdSale");

module.exports = function (deployer) {
  var tokenPrice = 1000;
  deployer.deploy(ERC20);
  deployer.deploy(CrowdSale,ERC20.address,1000);
};
