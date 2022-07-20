
const ERC20 = artifacts.require("Cryptos");

module.exports = function (deployer) {
  deployer.deploy(ERC20);
};
