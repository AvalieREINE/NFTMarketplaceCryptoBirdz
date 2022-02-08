var HDWalletProvider = require("truffle-hdwallet-provider");
const dotenv = require("dotenv");
dotenv.config();
var mnemonic = process.env.mnemonic;
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*" // Any network (default: none)
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/c5995d228cf444e291839dc4cc54e7e5"
        );
      },
      network_id: "*"
    }
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
