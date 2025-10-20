// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Token} from "src/Token.sol";

/// @title Factory Contract
/// @author Atharva Joshi
/// @notice Deploy tokens, manage token sales, buying, and depositing funds after sale
contract Factory {
    uint256 public constant TARGET = 4 ether;
    uint256 public constant TOKEN_LIMIT = 500_000 ether; // max tokens per sale

    event createdEvent(address indexed token);
    event buyEvent(address indexed token, uint256 amount); // emitted when tokens are bought

    struct Sale {
        address token;
        string name;
        address creator;
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    mapping(address => Sale) public tokenSale;
    uint256 public immutable fee;
    address public owner;
    address[] public tokens; // list of all token addresses
    uint256 public tokenCount; // number of tokens created

    /// @notice constructor sets owner and fee
    /// @param _fee fee required to create token
    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    /// @notice create a new token sale

    function create(string memory _name, string memory _symbol, uint256 totalSupply) external payable {
        require(msg.value >= fee, "Value must be greater than Fee"); // check fee

        // Calculate the minimum required supply to reach TARGET
        uint256 floorPrice = getCost(0); // starting price
        uint256 minSupply = (TARGET * 1e18) / floorPrice;
        require(totalSupply >= minSupply, "Token supply too low to reach TARGET");

        // Deploy token
        Token token = new Token(address(this), _name, _symbol, totalSupply);
        emit createdEvent(address(token));

        tokens.push(address(token)); // add token to list
        tokenCount++;

        Sale memory s = Sale(address(token), _name, msg.sender, 0, 0, true); // create sale
        tokenSale[address(token)] = s; // store sale
    }

    /// @notice fetch token sale by index
    function getTokenSale(uint256 index) public view returns (Sale memory) {
        Sale storage sale = tokenSale[tokens[index]]; // get sale
        return Sale({
            token: sale.token,
            name: sale.name,
            creator: sale.creator,
            sold: sale.sold,
            raised: sale.raised,
            isOpen: sale.isOpen
        });
    }

    /// @notice calculate cost of a token based on sold amount
    function getCost(uint256 _sold) public pure returns (uint256) {
        uint256 floor = 0.0001 ether;
        uint256 step = 0.0001 ether;
        uint256 increment = 10000 ether;
        uint256 cost = (step * (_sold / increment)) + floor;
        return cost;
    }

    /// @notice buy tokens from sale
    function buy(address _token, uint256 amt) external payable {
        Sale storage sale = tokenSale[_token]; //get sale

        require(sale.isOpen, "Sorry,buying is closed"); // sale must be open
        require(amt >= 1 ether, "Amount is too low");
        require(amt <= 10000 ether, "Amount exceed");

        uint256 cost = getCost(sale.sold);
        uint256 price = (cost * amt) / 10 ** 18;

        require(msg.value >= price, "Not enough ETH");

        sale.sold += amt; // update sold
        sale.raised += price; // update raised

        bool success = Token(_token).transfer(msg.sender, amt);
        require(success, "Transfer Token Failed");

        uint256 remainingTokens = Token(_token).balanceOf(address(this));

        if (sale.sold >= TOKEN_LIMIT || sale.raised >= TARGET || remainingTokens == 0) {
            sale.isOpen = false;
        }

        emit buyEvent(_token, amt);
    }
    /// @notice owner can manually close a sale

    function closeSale(address _token) external {
        require(msg.sender == owner, "Only owner can close sale");
        Sale storage s = tokenSale[_token];
        s.isOpen = false;
    }

    /// @notice deposit tokens and ETH to creator after sale
    function deposit(address _token) external {
        Token token = Token(_token);
        Sale storage s = tokenSale[_token];

        require(!s.isOpen, "Target is not satisfied");
        token.transfer(s.creator, token.balanceOf(address(this)));
        (bool success,) = payable(s.creator).call{value: s.raised}("");
        require(success, "Transfer ETH failed");
    }

    /// @notice withdraw ETH as contract owner
    function withDrawForDeveloper(uint256 _amt) external {
        require(msg.sender == owner, "Only owner can withdraw");
        (bool success,) = payable(owner).call{value: _amt}("");
        require(success, "Sorry,something went wrong:");
    }
}
