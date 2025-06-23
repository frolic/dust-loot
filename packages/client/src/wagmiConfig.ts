import { Chain, http } from "viem";
import { createWagmiConfig } from "@latticexyz/entrykit/internal";
import { redstone } from "@latticexyz/common/chains";
import { chainId } from "./common";

export const chains = [
  {
    ...redstone,
    rpcUrls: {
      ...redstone.rpcUrls,
      bundler: redstone.rpcUrls.default,
    },
  },
] as const satisfies Chain[];

export const transports = {
  [redstone.id]: http(),
} as const;

export const wagmiConfig = createWagmiConfig({
  chainId,
  // TODO: swap this with another default project ID or leave empty
  walletConnectProjectId: "3f1000f6d9e0139778ab719fddba894a",
  appName: document.title,
  chains,
  transports,
  pollingInterval: {
    [redstone.id]: 2000,
  },
});
