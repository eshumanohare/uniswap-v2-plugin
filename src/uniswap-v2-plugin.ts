import { Web3PluginBase, Contract } from "web3";

import IUniswapV2Factory from "./artifacts/IUniswapV2Factory";
import IUniswapV2Pair from "./artifacts/IUniswapV2Pair";

const FactoryType = [...IUniswapV2Factory];
const PairType = [...IUniswapV2Pair];

export class UniswapV2Plugin extends Web3PluginBase {
  public pluginNamespace: string = "uniswapV2";

  public factory(address: string): Contract<typeof FactoryType> {
    const factory_contract = new Contract(FactoryType, address);
    factory_contract.link(this);
    return factory_contract;
  }

  public pair(address: string): Contract<typeof PairType> {
    const pair_contract = new Contract(PairType, address);
    pair_contract.link(this);
    return pair_contract;
  }
}
