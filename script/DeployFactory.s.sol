//SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;

import {Script} from "lib/forge-std/src/Script.sol";
import {Factory} from "../src/Factory.sol";

import {Token} from "../src/Token.sol";

contract DeployFactory is Script {
    function run() external {
        vm.startBroadcast();
        new Factory(0.00001 ether);
        vm.stopBroadcast();
    }
}
