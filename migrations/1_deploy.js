const CurrencyToken = artifacts.require("CurrencyToken");
const AccountingSystem = artifacts.require("AccountingSystem");

module.exports = async function (deployer) {
    await deployer.deploy(CurrencyToken, "0x2F9B58793177E6A4941b436B43a7a8e841D61675");
    await deployer.deploy(AccountingSystem);
}
