// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Factory} from "../src/Factory.sol";
import {Test} from "lib/forge-std/src/Test.sol";
import {Token} from "../src/Token.sol";

contract FactoryTest is Test {
    Factory public f;
    address public user1 = address(123);
    address public user2 = address(678);

    function setUp() public {
        f = new Factory(1e18);
    }

    function testOwner() public {
        vm.prank(user1);
        Factory f1 = new Factory(1e18);
        assertEq(f1.owner(), user1);
    }

    function testCreate() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        Factory f2 = new Factory(1e18);

        vm.prank(user1);
        f2.create{value: 1e18}("Ryder", "RY", 1_000_000 ether);

        assertEq(f2.tokenCount(), 1);
    }

    function testFetching() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        Factory f3 = new Factory(1e18);

        vm.prank(user1);
        f3.create{value: 1e18}("Ryder", "RY", 1_000_000 ether);

        Factory.Sale memory sale = f3.getTokenSale(0);
        assertEq(sale.creator, user1);
        assertEq(sale.sold, 0);
        assertEq(sale.raised, 0);
        assertEq(sale.isOpen, true);
        assertEq(bytes(sale.name).length > 0, true);
        assertEq(sale.token != address(0), true);
    }

    function testDepositSimple() public {
        vm.deal(user1, 10 ether);
        vm.prank(user1);
        Factory f3 = new Factory(1e18);

        vm.prank(user1);
        f3.create{value: 1e18}("Ryder", "RY", 1_000_000 ether);

        Factory.Sale memory sale = f3.getTokenSale(0);
        address tokenAddr = sale.token;
        Token token = Token(tokenAddr);

        vm.prank(user1);
        f3.closeSale(tokenAddr);

        uint256 creatorTokenBalanceBefore = token.balanceOf(user1);

        uint256 userBalance = token.balanceOf(user1);
        vm.prank(user1);
        token.transfer(address(f3), userBalance);

        vm.prank(user1);
        f3.deposit(tokenAddr);

        uint256 creatorTokenBalanceAfter = token.balanceOf(user1);
        uint256 contractTokenBalanceAfter = token.balanceOf(address(f3));

        assertEq(contractTokenBalanceAfter, 0);
        assertEq(creatorTokenBalanceAfter > creatorTokenBalanceBefore, true);
    }

    function testBuyTokens() public {
        vm.deal(user1, 10 ether);
        vm.prank(user1);
        Factory f2 = new Factory(1e18);

        vm.prank(user1);
        f2.create{value: 1e18}("Ryder", "RY", 1_000_000 ether);

        Factory.Sale memory sale = f2.getTokenSale(0);
        address tokenAddr = sale.token;
        Token token = Token(tokenAddr);

        vm.deal(user2, 10 ether);

        uint256 amt1 = 10_000 ether;
        uint256 price1 = f2.getCost(sale.sold) * (amt1 / 1e18);
        vm.prank(user2);
        f2.buy{value: price1}(tokenAddr, amt1);

        Factory.Sale memory updatedSale = f2.getTokenSale(0);
        assertEq(updatedSale.sold, amt1);
        assertEq(updatedSale.raised > 0, true);
        assertEq(updatedSale.isOpen, true);

        vm.deal(user2, 10 ether);
        vm.prank(user2);
        vm.expectRevert(bytes("Amount exceeds maximum purchase limit"));
        f2.buy{value: 1 ether}(tokenAddr, 20_000 ether);
    }
}
