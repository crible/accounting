const Web3 = require('web3');
const truffleContract = require('@truffle/contract');
const CurrencyTokenArtifact = require('./build/contracts/CurrencyToken.json');
const AccountingSystemArtifact = require('./build/contracts/AccountingSystem.json');

const web3 = new Web3('http://127.0.0.1:7545'); // Adjust the URL if necessary

const CurrencyToken = truffleContract(CurrencyTokenArtifact);
CurrencyToken.setProvider(web3.currentProvider);

const AccountingSystem = truffleContract(AccountingSystemArtifact);
AccountingSystem.setProvider(web3.currentProvider);

const analyzeEvents = async () => {
    const accounts = await web3.eth.getAccounts();
    const currencyToken = await CurrencyToken.deployed();
    const accountingSystem = await AccountingSystem.deployed();

    const user1 = accounts[1];
    const user2 = accounts[2];
    const initialOwner = accounts[0];
    const initialSupply = web3.utils.toWei('100', 'ether');
    const transferAmount = web3.utils.toWei('10', 'ether');

    // Register the token and mint initial supply to user1
    await accountingSystem.registerToken(currencyToken.address, user1, initialSupply, { from: initialOwner });

    // Perform the internal transfer from user1 to user2
    await accountingSystem.internalTransfer(user1, user2, currencyToken.address, transferAmount, { from: initialOwner });

    // Fetch and analyze InternalTransfer events
    const events = await accountingSystem.getPastEvents('InternalTransfer', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    events.forEach(event => {
        console.log('InternalTransfer event:');
        console.log('  From:', event.returnValues.from);
        console.log('  To:', event.returnValues.to);
        console.log('  Token:', event.returnValues.token);
        console.log('  Amount:', web3.utils.fromWei(event.returnValues.amount, 'ether'));
    });
};

analyzeEvents().catch(error => {
    console.error('Error analyzing events:', error);
});
