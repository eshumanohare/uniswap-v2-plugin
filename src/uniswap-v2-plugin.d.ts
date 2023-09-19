import { UniswapV2Plugin } from "./uniswap-v2-plugin";

declare module "web3" {
  interface UniswapV2Context {
    uniswapV2: UniswapV2Plugin;
  }
}
