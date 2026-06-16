// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {QuiverReview} from "../src/QuiverReview.sol";

/// @notice Deploy QuiverReview to Base mainnet.
///
/// Usage:
///   QUIVER=0x...   TREASURY=0x...   \
///   PRIVATE_KEY=0x...   \
///   forge script script/Deploy.s.sol:Deploy \
///     --rpc-url https://mainnet.base.org \
///     --broadcast --verify
contract Deploy is Script {
    function run() external {
        address quiver   = vm.envAddress("QUIVER");
        address treasury = vm.envAddress("TREASURY");
        uint256 pk       = vm.envUint("PRIVATE_KEY");

        require(quiver != address(0),   "set QUIVER");
        require(treasury != address(0), "set TREASURY");

        vm.startBroadcast(pk);
        QuiverReview r = new QuiverReview(IERC20(quiver), treasury);
        vm.stopBroadcast();

        console2.log("QuiverReview deployed at:", address(r));
        console2.log("Quiver token:           ", quiver);
        console2.log("Treasury:               ", treasury);
    }
}
