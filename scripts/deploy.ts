import 'dotenv/config';
import { ethers } from "hardhat";
import * as params from "../config/params.json";

async function main() {
  let addrs = await ethers.getSigners();
  
  const wallet = new ethers.Wallet(`${process.env.PROJECT_PK}`, ethers.provider)
  
  console.log("Deploying contracts with the account:", wallet.address);
  console.log("Account balance:", (await wallet.getBalance()).toString());

  const DistributorContract = await ethers.getContractFactory("BFFDistributor", wallet);
  const distributor = await DistributorContract.deploy(params.address.BFFCoin, {nonce: 1, gasPrice: ethers.utils.parseUnits('300', 'gwei')});
  await distributor.deployed();
  console.log("Contract address:", distributor.address);
  
  /*const erc20 = await ethers.getContractFactory("BFFCoin", wallet);
  const BFFCoin = await erc20.deploy(ethers.utils.parseEther('10000000'), {nonce: 0, gasPrice: ethers.utils.parseUnits('300', 'gwei')});
  await BFFCoin.deployed();
  console.log("Token address:", BFFCoin.address);*/
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
