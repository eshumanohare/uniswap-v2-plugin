import { UniswapV2Plugin } from "./uniswap-v2-plugin";
import { UniswapV3Plugin } from "./uniswap-v3-plugin";

declare module "web3" {
  interface UniswapV2Context {
    uniswapV2: UniswapV2Plugin;
  }
  interface UniswapV3Context {
    uniswapV3: UniswapV3Plugin;
  }
}
