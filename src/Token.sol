//SPDX License-Identifier:MIT
pragma solidity ^0.8.18;

import {ERC20} from "lib/openzepplin-contracts/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address payable public owner;
    address public creator;

    constructor(address _creator, string memory _name, string memory _symbol, uint256 totalSupply)
        ERC20(_name, _symbol)
    {
        owner = payable(msg.sender);
        creator = _creator;
        _mint(msg.sender, totalSupply);
    }
}
