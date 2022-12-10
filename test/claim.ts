import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BFFCoin, BFFDistributor } from "../build/typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as params from "../config/params.json"

describe("BFF Distributor", function () {
  let coin: BFFCoin;
  let distributor: BFFDistributor;
  let addrs: SignerWithAddress[];

  before(async function () {
    addrs = await ethers.getSigners();

    const Coin = await ethers.getContractFactory("BFFCoin", addrs[0]);
    coin = Coin.attach(params.address.BFFCoinMumbai);

    const Dist = await ethers.getContractFactory("BFFDistributor", addrs[0]);
    distributor = await Dist.deploy(coin.address);
  });

  describe("Allocate and Claim", function () {
    it("happy path", async function() {

    });
  });
});
