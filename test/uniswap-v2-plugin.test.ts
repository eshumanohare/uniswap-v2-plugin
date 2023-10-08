import { UniswapV2Plugin } from "../src/uniswap-v2-plugin";
import Web3, { Uint256, core } from "web3";
import { UniswapV3Plugin } from "../src/uniswap-v3-plugin";

describe("\nUniswapV2Plugin Tests\n", () => {
  it("should register UniswapV2Plugin on UniswapV2Context instance", async () => {
    const web3Context = new Web3("https://eth.public-rpc.com");
    web3Context.registerPlugin(new UniswapV2Plugin());
    expect(web3Context["uniswapV2"]).toBeDefined();
  });

  describe("Plugin Tests - UniswapV2 - Factory\n", () => {
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

  // Uniswap V2 Pair Tests

  describe("Plugin Tests - UniswapV2 - Router2\n", () => {
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

      const request = {
        method: "eth_call",
        params: [{ input: data, to: uniswapV2RouterAddress }, "latest"],
      };

      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
      expect(factoryAddr).toEqual(expectedFactoryAddress);
    });
  });

  // Uniswap V2 Pair Tests
  describe("Plugin Tests - UniswapV2 - Pair\n", () => {
    let requestManagerSendSpy: jest.SpyInstance;

    let web3Context: Web3;

    const uniswapV2PairAddress = "0x3139Ffc91B99aa94DA8A2dc13f1fC36F9BDc98eE"; // PAX USDC Pool

    let uniswapV2Pair;

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

      uniswapV2Pair = web3Context["uniswapV2"].pair(uniswapV2PairAddress);
    });

    it("should call Uniswap V2 Pair (PAX-USDC) factory() with expected RPC object", async () => {
      const signature = Web3.utils.sha3("factory()")?.slice(0, 10);

      const data = signature;

      const uniswapV2FactoryAddress =
        "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

      const _factory = await uniswapV2Pair.methods.factory().call();

      const request = {
        method: "eth_call",
        params: [
          {
            input: data,
            to: uniswapV2PairAddress,
          },
          "latest",
        ],
      };
      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
      expect(_factory).toEqual(uniswapV2FactoryAddress);
    });

    it("should call Uniswap V2 Pair (PAX-USDC) token0() and token1() with expected RPC object", async () => {
      const signature0 = Web3.utils.sha3("token0()")?.slice(0, 10);
      const signature1 = Web3.utils.sha3("token1()")?.slice(0, 10);
      const data0 = signature0;
      const data1 = signature1;

      const tokenAAddress = "0x8E870D67F660D95d5be530380D0eC0bd388289E1"; // PAX Coin
      const tokenBAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC

      const _token0 = await uniswapV2Pair.methods.token0().call();

      const request0 = {
        method: "eth_call",
        params: [
          {
            input: data0,
            to: uniswapV2PairAddress,
          },
          "latest",
        ],
      };

      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request0);

      const _token1 = await uniswapV2Pair.methods.token1().call();

      const request1 = {
        method: "eth_call",
        params: [
          {
            input: data1,
            to: uniswapV2PairAddress,
          },
          "latest",
        ],
      };

      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request1);

      expect(_token0).toEqual(tokenAAddress);
      expect(_token1).toEqual(tokenBAddress);
    });
  });
});

// Uniswap V3 Factory Tests
describe("\nUniswapV3Plugin Tests\n", () => {
  it("should register UniswapV3 Plugin on UniswapV3Context instance", async () => {
    const web3Context = new Web3("https://eth.public-rpc.com");
    web3Context.registerPlugin(new UniswapV3Plugin());
    expect(web3Context["uniswapV3"]).toBeDefined();
  });

  describe("Plugin Tests - UniswapV3 - Factory\n", () => {
    let requestManagerSendSpy: jest.SpyInstance;

    let web3Context: Web3;
    const uniswapV3FactoryAddress =
      "0x1F98431c8aD98523631AE4a59f267346ea31F984";

    let uniswapV3Factory;

    const owner = "0x1a9C8182C09F50C8318d769245beA52c32BE35BC";
    const tokenAAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const tokenBAddress = "0xd5F047a72FC970CfcF79100F8576CC071fC87Bb4";
    type uint24 = number;
    const poolFee: uint24 = 500;

    const pool = "0x6845873089FDB0a2C75E0A2B3E329D2567cd7926"; // WETH BabyX Pool

    beforeAll(() => {
      web3Context = new Web3("https://eth.public-rpc.com");
      web3Context.registerPlugin(new UniswapV3Plugin());
      requestManagerSendSpy = jest.spyOn(
        web3Context["uniswapV3"].requestManager,
        "send"
      );

      uniswapV3Factory = web3Context["uniswapV3"].factory(
        uniswapV3FactoryAddress
      );
    });

    it("should call Uniswap V3 Factory owner method with expected RPC object", async () => {
      const signature = Web3.utils.sha3("owner()")?.slice(0, 10);
      const data = signature;

      const _owner = await uniswapV3Factory.methods.owner().call();

      const request = {
        method: "eth_call",
        params: [{ input: data, to: uniswapV3FactoryAddress }, "latest"],
      };
      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
      expect(_owner).toEqual(owner);
    });

    // getPool method
    it("should call Uniswap V3 Factory owner method with expected RPC object", async () => {
      const signature = Web3.utils
        .sha3("getPool(address,address,uint24)")
        ?.slice(0, 10);
      const data =
        signature +
        tokenAAddress.slice(2).padStart(64, "0").toLowerCase() +
        tokenBAddress.slice(2).padStart(64, "0").toLowerCase() +
        poolFee;

      const _poolAddress = await uniswapV3Factory.methods
        .getPool(tokenAAddress, tokenBAddress, poolFee)
        .call();

      const request = {
        method: "eth_call",
        params: [{ input: data, to: uniswapV3FactoryAddress }, "latest"],
      };
      expect(requestManagerSendSpy).toHaveBeenLastCalledWith(request);
      expect(_poolAddress).toEqual(pool);
    });
  });
});
