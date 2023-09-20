import Web3, { core } from "web3";
import { UniswapV2Plugin } from "../src/uniswap-v2-plugin";

describe("UniswapV2Plugin Tests", () => {
  it("should register UniswapV2Plugin on UniswapV2Context instance", async () => {
    const web3Context = new Web3("https://eth.public-rpc.com");
    web3Context.registerPlugin(new UniswapV2Plugin());
    expect(web3Context["uniswapV2"]).toBeDefined();
  });

  describe("Plugin Tests", () => {
    const requestManagerSendSpy = jest.fn();

    let web3Context: Web3;
    const uniswapV2FactoryAddress =
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

    beforeAll(() => {
      web3Context = new Web3("https://eth.public-rpc.com");
      web3Context.registerPlugin(new UniswapV2Plugin());
      web3Context["uniswapV2"].requestManager.send = requestManagerSendSpy;
    });

    it("should call Uniswap V2 Factory feeTo method with expected RPC object", async () => {
      const signature = Web3.utils.sha3("feeTo()")?.slice(0, 10);
      const data = signature;
      const uniswapV2Factory = web3Context["uniswapV2"].factory(
        uniswapV2FactoryAddress
      );
      await uniswapV2Factory.methods.feeTo().call();
      const request = {
        method: "eth_call",
        params: [{ input: data, to: uniswapV2FactoryAddress }, "latest"],
      };

      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
    });
  });
});
