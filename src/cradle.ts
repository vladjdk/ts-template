import { Coin, CreateTxOptions, LCDClient, LCDClientConfig, MnemonicKey, MsgSend, Wallet } from '@terra-money/feather.js';
import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const mainnetConfig: Record<string, LCDClientConfig> = {
    'phoenix-1': {
      chainID: 'phoenix-1',
      lcd: 'https://cradle-manager.ec1-prod.newmetric.xyz/cradle/proxy/33373285-dcdc-4782-83fc-81938ef57d56',
      gasAdjustment: 1.75,
      gasPrices: { uluna: 0.15 },
      prefix: 'terra',
    },
  };

const lcd = new LCDClient(mainnetConfig);

const chainId ='phoenix-1';

const lcdClientConfig = lcd.config[chainId];

const wallet = new Wallet(lcd, new MnemonicKey({ mnemonic: env.MNEMONIC_KEY, coinType: 330 }));

const run = async () => {

  const msg = new MsgSend(
      wallet.key.accAddress(mainnetConfig[chainId].prefix),
      wallet.key.accAddress(mainnetConfig[chainId].prefix),
      [new Coin("uluna", "1")]
  )

  const txOptions: CreateTxOptions = {
    msgs: [msg],
    chainID: lcdClientConfig.chainID,
  };


  try {
    const tx = await wallet.createTx(txOptions);
    console.log(tx)
    console.log(await wallet.lcd.tx.broadcast(tx, lcdClientConfig.chainID));
  } catch(e) {
    console.log(e)
  }

}

  run();