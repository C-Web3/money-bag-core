import { ethers, upgrades } from "hardhat";
import * as params from "../config/params.json";

async function main() {
  let addrs = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", addrs[0].address);
  console.log("Account balance:", (await addrs[0].getBalance()).toString());

  const DistributorContract = await ethers.getContractFactory("BFFDistributor", addrs[0]);
  const distributor = await DistributorContract.deploy(params.address.BFFCoinMumbai);
  await distributor.deployed();
  console.log("Contract address:", distributor.address);

  /*
  const erc20 = await ethers.getContractFactory("BFFCoin", addrs[0]);
  const BFFCoin = await upgrades.deployProxy(erc20, ["BFFCoin", "BFFC", ethers.utils.parseEther('10000000')]);
  await BFFCoin.deployed();
  console.log("Token address:", BFFCoin.address);
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
