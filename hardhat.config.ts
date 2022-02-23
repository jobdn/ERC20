import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "./tasks";

export default {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_PRIVATE_KEY}`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
};
