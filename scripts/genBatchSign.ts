import 'dotenv/config';
import * as fs from "fs";
import * as path from "path";
import progress from 'cli-progress';
import { ethers } from "hardhat";
import * as params from "../config/params.json";

async function genSign(signer: any, address: string, batch: number, maxQty: number) {
  const messageHash = ethers.utils.solidityKeccak256([ "address", "uint256", "uint256" ], [ address, batch, maxQty ]);
  const signature = await signer.signMessage(ethers.utils.arrayify(messageHash));
  return signature
}

async function main() {
  let addrs = await ethers.getSigners();
  console.log("Owner account:", addrs[0].address);
  console.log("Account balance:", (await addrs[0].getBalance()).toString());

  const result = [];
  const jsonPath = path.resolve(__dirname, '../data/batch221207.json');
  const outPath = path.resolve(__dirname, '../data/sign221207.json');

  const rawData = fs.readFileSync(jsonPath,{encoding:'utf8', flag:'r'});
  const snapshot = JSON.parse(rawData);
  const allWhitelist = snapshot["list"].length;
  let total = 0;

  const bar1 = new progress.SingleBar({}, progress.Presets.shades_classic);
  bar1.start(allWhitelist,0);
  for(let i=0; i<allWhitelist; i++) {
    bar1.increment();
    const user = snapshot["list"][i];
    let signature: string = await genSign(addrs[0], user.address, user.batch, user.maxQty);
    
    result.push({
      address: user.address,
      batch: user.batch,
      maxQty: ethers.utils.parseUnits(user.maxQty.toString(), 'ether').toString(),
      signature: signature
    })
    total += user.maxQty;
  }
  bar1.stop();
  fs.writeFileSync(outPath, JSON.stringify({list: result}));
  console.log(`Allocate: ${total} to ${params.address.BFFCoinMumbai}, which is ${ethers.utils.parseUnits(total.toString(), 'ether')} in Wei`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});