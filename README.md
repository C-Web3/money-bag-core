# Money Bag Core
Smart Contracts of NFT project Money Bag

## Production Steps
Deploy BFFCoin
- `yarn hardhat run scripts/deploy.ts --network polygonMumbai`
- `yarn hardhat verify --constructor-args config/BFFCoin.ts DEPLOYED_ADDRESS --network polygonMumbai`

Switch comment

Deploy BFFDistributor
- `yarn hardhat run scripts/deploy.ts --network polygonMumbai`
- Edit configs/BFFDistributor
- `yarn hardhat verify --constructor-args config/BFFDistributor.ts DEPLOYED_ADDRESS --network polygonMumbai`

Transfer Corresponding Fund to BFFDistributor