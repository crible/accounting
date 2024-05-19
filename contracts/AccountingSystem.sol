// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CurrencyToken.sol";

contract AccountingSystem {

   // Event to log internal transfers
    event InternalTransfer(
        address indexed from,
        address indexed to,
        CurrencyToken token,
        uint256 amount
    );
    // Map user addresses to a mapping of token contracts and their balances
    mapping(address => mapping(CurrencyToken => uint256)) public balances;

    // Register a new token in the system
    function registerToken(CurrencyToken token, address to, uint256 initialSupply) external {
	require(msg.sender == token.owner(), "Caller is not the owner of the token contract");
        // Mint initial supply to 'to' address
        try token.mint(to, initialSupply) {
	}
	catch {
            revert("Minting failed");
        }
        // Initialize the balance mapping
        balances[to][token] = initialSupply;
    }

    // Transfer tokens from one user to another within this accounting system
    function internalTransfer(address from, address to, CurrencyToken token, uint256 amount) external {
        require(balances[from][token] >= amount, "Insufficient balance");
        balances[from][token] -= amount;
        balances[to][token] += amount;

	emit InternalTransfer(from, to, token, amount);
    }

    // Function to check balance of a user for a specific token
    function getBalance(address user, CurrencyToken token) external view returns (uint256) {
        return balances[user][token];
    }
}
