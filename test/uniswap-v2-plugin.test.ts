import Web3, { core } from "web3";
import { UniswapV2Plugin } from "../src/uniswap-v2-plugin";

describe("UniswapV2Plugin Tests", () => {
  it("should register UniswapV2Plugin on UniswapV2Context instance", async () => {
    const web3Context = new Web3("https://eth.public-rpc.com");
    web3Context.registerPlugin(new UniswapV2Plugin());
    expect(web3Context["uniswapV2"]).toBeDefined();

    const uniswapV2FactoryAddress =
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const uniswapV2FactoryInstance = web3Context["uniswapV2"].factory(
      uniswapV2FactoryAddress
    );
    console.log(await uniswapV2FactoryInstance.methods.feeToSetter().call());
  });
});
