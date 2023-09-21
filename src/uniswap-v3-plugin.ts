import { Web3PluginBase, Contract } from "web3";

import IUniswapV3Factory from "./artifacts/IUniswapV3Factory";

const FactoryType = [...IUniswapV3Factory];

export class UniswapV3Plugin extends Web3PluginBase {
  public pluginNamespace: string = "uniswapV3";

  public factory(address: string): Contract<typeof FactoryType> {
    const factory_contract = new Contract(FactoryType, address);
    factory_contract.link(this);
    return factory_contract;
  }
}
