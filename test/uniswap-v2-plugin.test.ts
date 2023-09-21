import Web3, { core } from "web3";
import { UniswapV2Plugin } from "../src/uniswap-v2-plugin";

describe("UniswapV2Plugin Tests", () => {
  it("should register UniswapV2Plugin on UniswapV2Context instance", async () => {
    const web3Context = new Web3("https://eth.public-rpc.com");
    web3Context.registerPlugin(new UniswapV2Plugin());
    expect(web3Context["uniswapV2"]).toBeDefined();
  });

  describe("Plugin Tests - UniswapV2 - Factory", () => {
    const requestManagerSendSpy = jest.fn();

    let web3Context: Web3;
    const uniswapV2FactoryAddress =
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

    let uniswapV2Factory;

    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const feeToSetterAddress = "0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360";

    beforeAll(() => {
      web3Context = new Web3("https://eth.public-rpc.com");
      web3Context.registerPlugin(new UniswapV2Plugin());
      web3Context["uniswapV2"].requestManager.send = requestManagerSendSpy;
      uniswapV2Factory = web3Context["uniswapV2"].factory(
        uniswapV2FactoryAddress
      );
    });

    it("should call Uniswap V2 Factory feeTo method with expected RPC object", async () => {
      const signature = Web3.utils.sha3("feeTo()")?.slice(0, 10);
      const data = signature;

      await uniswapV2Factory.methods.feeTo().call();

      const request = {
        method: "eth_call",
        params: [{ input: data, to: uniswapV2FactoryAddress }, "latest"],
      };
      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
    });

    it("should call Uniswap V2 Factory feeToSetter with expected RPC object", async () => {
      const signature = Web3.utils.sha3("feeToSetter()")?.slice(0, 10);
      const data = signature;

      await uniswapV2Factory.methods.feeToSetter().call();

      const request = {
        method: "eth_call",
        params: [
          {
            input: data,
            to: uniswapV2FactoryAddress,
          },
          "latest",
        ],
      };

      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
    });

    it("should call Uniswap V2 Factory getPair() with expected RPC object", async () => {
      const tokenAAddress = "0x8E870D67F660D95d5be530380D0eC0bd388289E1"; // PAX Coin
      const tokenBAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC

      const signature = Web3.utils
        .sha3("getPair(address,address)")
        ?.slice(0, 10);

      const data =
        signature +
        tokenAAddress.slice(2).padStart(64, "0").toLowerCase() +
        tokenBAddress.slice(2).padStart(64, "0").toLowerCase();

      await uniswapV2Factory.methods
        .getPair(tokenAAddress, tokenBAddress)
        .call();

      const request = {
        method: "eth_call",
        params: [
          {
            input: data,
            to: uniswapV2FactoryAddress,
          },
          "latest",
        ],
      };
      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
    });
  });

  describe("Plugin Tests - UniswapV2 - Router2", () => {
    let requestManagerSendSpy: jest.SpyInstance;

    let web3Context: Web3;
    const uniswapV2RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    let uniswapV2Router;

    // const zeroAddress = '0x0000000000000000000000000000000000000000';
    // const feeToSetterAddress = '0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360';

    beforeAll(() => {
      web3Context = new Web3();
      web3Context.setProvider(
        new Web3.providers.HttpProvider("https://eth.public-rpc.com")
      );
      web3Context.registerPlugin(new UniswapV2Plugin());

      requestManagerSendSpy = jest.spyOn(
        web3Context["uniswapV2"].requestManager,
        "send"
      );

      uniswapV2Router = web3Context["uniswapV2"].router2(
        uniswapV2RouterAddress
      );
    });

    it("should return factory contract address", async () => {
      const signature = Web3.utils.sha3("factory()")?.slice(0, 10);
      const data = signature;

      const expectedFactoryAddress =
        "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

      const factoryAddr = await uniswapV2Router.methods.factory().call();
      console.log(factoryAddr);

      const request = {
        method: "eth_call",
        params: [{ input: data, to: uniswapV2RouterAddress }, "latest"],
      };

      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
      expect(factoryAddr).toEqual(expectedFactoryAddress);
    });
  });
});
