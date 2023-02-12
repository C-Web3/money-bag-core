# Money Bag Core
Smart Contracts of NFT project Money Bag

## Production Steps
1. Deploy BFFCoin
- `yarn hardhat run scripts/deploy.ts --network polygonMumbai`
- `yarn hardhat verify --constructor-args config/BFFCoin.ts DEPLOYED_ADDRESS --network polygonMumbai`

2. Switch comment

3. Deploy BFFDistributor
- `yarn hardhat run scripts/deploy.ts --network polygonMumbai`
- Edit configs/BFFDistributor
- `yarn hardhat verify --constructor-args config/BFFDistributor.ts DEPLOYED_ADDRESS --network polygonMumbai`

4. Transfer Corresponding Fund to BFFDistributor