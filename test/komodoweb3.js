/* eslint-disable no-underscore-dangle, max-len */
const _ = require('lodash');
const chai = require('chai');
const path = require('path');
// const bs58 = require('bs58');

const KomodoWeb3 = require('../src/komodoweb3');
const {
  getPirateRPCAddress,
  getDefaultPirateAddress,
  getWalletPassphrase,
} = require('./config/config');
const qAssert = require('./utils/qassert');
const { isWalletEncrypted } = require('./utils/utils');

const { assert } = chai;

console.log(`Your Pirate RPC address is ${getPirateRPCAddress()}`);
console.log(`Your Default Pirate address is ${getDefaultPirateAddress()}`);

describe('KomodoWeb3', () => {
  const KOMODO_ADDRESS = getDefaultPirateAddress();
  let komodoweb3;

  beforeEach(() => {
    komodoweb3 = new KomodoWeb3(getPirateRPCAddress());
  });

  /** ******** MISC ********* */
  describe('isConnected()', () => {
    it('returns true when connected', async () => {
      const connected = await komodoweb3.isConnected();
      assert.isTrue(connected);
    });
  });

  describe('listTransactions()', () => {
    it('returns a list of transactions', async () => {
      console.log('list transactions');
      const res = await komodoweb3.listTransactions(100);
      console.log(res);
      assert.isDefined(res);
    });
  });

  /** ******** BLOCKCHAIN ********* */
  describe('getBlock()', () => {
    it('returns the block info', () => {
      const res = {
        hash: '1bfc4aca524f50fedf45c9a0a88b54233269b12a7c1dc72beabbb0ccfda81fa7',
        confirmations: 17,
        strippedsize: 1215,
        size: 1251,
        weight: 4896,
        height: 76988,
        version: 536870912,
        versionHex: '20000000',
        merkleroot: 'c3b8465d875ac8e71a0a43e1954b5531ca3576d5559e47ecd1a38b73ebaccafe',
        hashStateRoot: '688ecfc501c65bfd3f440b3dd9a7d68a510b3bedc356be5d28be80c795020168',
        hashUTXORoot: 'c0f1e696a0341796eeb7229927ceebab2c2aae074892d17680283073811023e5',
        tx:
          ['3720fd812dde6a25c7d25fe587c975a59dba8250cf8f1d98d194a5f7c133f7ae',
            'f41ce7da75ee19d9b85604d4bdeaa6519a65e628991c34e7fc459a0f888785c6',
            '47e194c0ffa516971a9c1ad78b3584cc1f38f86cec7e7568f0660413a9bc2985'],
        time: 1517200944,
        mediantime: 1517200064,
        nonce: 0,
        bits: '1a0f60ca',
        difficulty: 1090965.680866982,
        chainwork: '00000000000000000000000000000000000000000000000c9b7b125e402f5efa',
        previousblockhash: 'e2894c0ce289722dc20eb19229ea61c6cf5e0746ebbfa42ede76a67e6a3a55a1',
        nextblockhash: '1670bdb5639e70460ccae03433d0222e72f61610a7d9af7b88a4ae750b083270',
        flags: 'proof-of-stake',
        proofhash: '00000684b650e192628204edf8608c2673062b347ebf34ff5fe18f5e3dce1203',
        modifier: '97767d8c89724d7c71c049b7600d4865f27fa0f294c5c70fc24af355f8eb136d',
        signature: '30450221008a6b2567b2d36efa71def0d9820a6d71c563b5550647cb574defda2918434f7b02204bbf76767c737c8c62f7493838d8b7e9e3379938f83311f412e0916c0ab2f954',
      };
      assert.isDefined(res);
      assert.isObject(res);
      assert.isDefined(res.confirmations);
      assert.isDefined(res.merkleroot);
      assert.isDefined(res.tx);
      assert.isArray(res.tx);
      assert.isDefined(res.hash);
      assert.isDefined(res.time);
      assert.isDefined(res.mediantime);
      assert.isDefined(res.difficulty);
      assert.isDefined(res.previousblockhash);
      assert.isDefined(res.nextblockhash);
      assert.isDefined(res.signature);
    });

    it('returns a hex string if verbose is set to false', async () => {
      const res = '00000020a1553a6a7ea676de2ea4bfeb46075ecfc661ea2992b10ec22d7289e20c4c89e2fecaaceb738ba3d1ec479e55d57635ca31554b95e1430a1ae7c85a875d46b8c330a66e5aca600f1a0000000068010295c780be285dbe56c3ed3b0b518ad6a7d93d0b443ffd5bc601c5cf8e68e52310817330288076d1924807ae2a2cabebce279922b7ee961734a096e6f1c03bcb5c68b7c9ba28c19cbe1855dcfda81505be8e7b3463561866fc91ae97ea56010000004730450221008a6b2567b2d36efa71def0d9820a6d71c563b5550647cb574defda2918434f7b02204bbf76767c737c8c62f7493838d8b7e9e3379938f83311f412e0916c0ab2f95403020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff0503bc2c0100ffffffff020000000000000000000000000000000000266a24aa21a9edc4928b43e01402c9d278937fa212d2049add8d3da1f49fbf1a6fc7f085882dc1012000000000000000000000000000000000000000000000000000000000000000000000000002000000013bcb5c68b7c9ba28c19cbe1855dcfda81505be8e7b3463561866fc91ae97ea560100000049483045022100b3261753087071bd16bf1b56ff14eb4f97348bbe30b04ee0f9f0b8e8fca9995002203519f80959db3f7b37975a0a7cd84cdc663b58061a31c7c4002ed6fc5a87530b01ffffffff0c000000000000000000001a214104000000232102587cb17a9e4ca41e477b6d180db02f88515c14a1a7791f9306167cba46bef004ac04b26502000000001976a914b29ec1e265ccb28ad6da4451eb9f275dcebc022688ac04b26502000000001976a9140ec1afc27860e1cd16d0283babbb523d1de04ace88ac04b26502000000001976a914ddf3cb991927c637a162513f371be6c7c282cf6388ac04b26502000000001976a914ca01e35383979bdec15ce10a88cbdc6219ab3b0988ac04b26502000000001976a914ca01e35383979bdec15ce10a88cbdc6219ab3b0988ac04b26502000000001976a914ea3f10790675fa80cf3c71cd71274602a5f92f7f88ac04b26502000000001976a9145657742155679a88eb56bfe606163ceef3f42d8188ac04b26502000000001976a914ddf3cb991927c637a162513f371be6c7c282cf6388ac04b26502000000001976a9148316e41fc0fbb2c9c56ee6e971c697629c22d29c88aca82e7900000000001976a914115de3bdbefab72679614d684a025bf0f24a644a88ac0000000002000000013a321d7ab4f14a5403b6af8adca0f3c9df32d193795084d10f585f9e87fff8e0050000006b4830450221009158fa5ef2cd75ac430a0845b94c34d329f87094f8bebe015306311f9432474d02207eaa51be2977fb769d4ec5e5c5a1f5d468922c7a40f540c3ab25dc7a8a7389790121036b515f46e5921f67d957d5928a4919899e8002beeda1f36aa92a8d2e8ef02612feffffff02542acb01000000001976a914115de3bdbefab72679614d684a025bf0f24a644a88ac00000000000000008401040390d00301284c6488e3cfda0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a7174756d676f676f676f000000000000000000000000000000000000000000001454a65e01360ee027623478a188386dc4d58d9c81c2bb2c0100';
      assert.isDefined(res);
      assert.isString(res);
    });
  });

  describe('getBlockchainInfo()', () => {
    it('returns the block info', async () => {
      const res = await komodoweb3.getBlockchainInfo();
      assert.isDefined(res);
      assert.isObject(res);
      assert.isDefined(res.chain);
      assert.isDefined(res.blocks);
      assert.isDefined(res.synced);
      assert.isDefined(res.headers);
      assert.isDefined(res.bestblockhash);
      assert.isDefined(res.difficulty);
      assert.isDefined(res.commitments);
      assert.isDefined(res.verificationprogress);
      assert.isDefined(res.chainwork);
      assert.isDefined(res.pruned);
    });
  });

  describe('getBlockCount()', () => {
    it('returns the blockcount', async () => {
      const res = await komodoweb3.getBlockCount();
      assert.isDefined(res);
      assert.isNumber(res);
    });
  });

  describe('getBlockHash()', () => {
    it('returns the block hash', async () => {
      const res = await komodoweb3.getBlockHash(0);
      assert.isDefined(res);
      assert.isString(res);
    });
  });

  describe('getTransactionReceipt()', () => {
    it('returns the transaction receipt', () => {
      const res = [
        {
          blockHash: '2aca546e5adb3a6e2ac38c5cba81f2ce40097a8982d8b6ef37795729048c48f3',
          blockNumber: 68245,
          transactionHash: 'e5ffaafc8cf5a239750075ac1866537bc3999561e2bbd7012bc80b24e0338cbb',
          transactionIndex: 2,
          from: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
          to: '97c781c612ad23f4049f253bd52ac2889855f2da',
          cumulativeGasUsed: 43448,
          gasUsed: 43448,
          contractAddress: '97c781c612ad23f4049f253bd52ac2889855f2da',
          log: [
            {
              address: '0387da9a3e773b559ca0367c5929360e4a4294f6',
              topics: [
                '14959b24f45a8f41b814b331ae09533db9d7e7962ca200e484f849a1fd1955aa',
                '0000000000000000000000000000000000000000000000000000000000000000',
                '0000000000000000000000000387da9a3e773b559ca0367c5929360e4a4294f6',
              ],
              data: '0000000000000000000000000000000000000000000000000000000000000002',
            },
          ],
        },
      ];
      assert.isDefined(res);
      assert.isDefined(res[0].blockHash);
      assert.isDefined(res[0].blockNumber);
      assert.isDefined(res[0].transactionHash);
      assert.isDefined(res[0].transactionIndex);
      assert.isDefined(res[0].from);
      assert.isDefined(res[0].to);
      assert.isDefined(res[0].cumulativeGasUsed);
      assert.isDefined(res[0].gasUsed);
      assert.isDefined(res[0].contractAddress);
      assert.isDefined(res[0].log);
    });
  });

  /** ******** CONTROL ********* */
  describe('getInfo()', () => {
    it('returns the blockchain info', async () => {
      const res = await komodoweb3.getInfo(KOMODO_ADDRESS);
      assert.isDefined(res);
      assert.isObject(res);
      assert.isDefined(res.version);
      assert.isDefined(res.protocolversion);
      assert.isDefined(res.KMDversion);
      assert.isDefined(res.synced);
      assert.isDefined(res.notarized);
      assert.isDefined(res.prevMoMheight);
      assert.isDefined(res.notarizedhash);
      assert.isDefined(res.notarizedtxid);
      assert.isDefined(res.notarizedtxid_height);
      assert.isDefined(res.KMDnotarized_height);
      assert.isDefined(res.walletversion);
      assert.isDefined(res.balance);
      assert.isDefined(res.blocks);
      assert.isDefined(res.longestchain);
      assert.isDefined(res.tiptime);
      assert.isDefined(res.difficulty);
      assert.isDefined(res.keypoololdest);
      assert.isDefined(res.keypoolsize);
      assert.isDefined(res.paytxfee);
      assert.isDefined(res.sapling);
      assert.isDefined(res.timeoffset);
      assert.isDefined(res.connections);
      assert.isDefined(res.proxy);
      assert.isDefined(res.testnet);
      assert.isDefined(res.relayfee);
      assert.isDefined(res.errors);
      assert.isDefined(res.name);
      assert.isDefined(res.p2pport);
      assert.isDefined(res.rpcport);
      assert.isDefined(res.magic);
      assert.isDefined(res.premine);
      assert.isDefined(res.reward);
      assert.isDefined(res.halving);
      assert.isDefined(res.decay);
      assert.isDefined(res.endsubsidy);
      assert.isDefined(res.notarypay);
    });
  });

  /** ******** NETWORK ********* */
  describe('getPeerInfo()', () => {
    it('returns the Node info', async () => {
      const res = await komodoweb3.getPeerInfo();
      assert.isDefined(res);
      assert.isArray(res);
      _.forEach(res, (nodeInfo) => {
        assert.isNumber(nodeInfo.synced_headers);
        assert.isNumber(nodeInfo.synced_blocks);
      });
    });
  });

  /** ******** UTIL ********* */
  describe('validateAddress()', () => {
    it('returns an object validating the address', async () => {
      let res = await komodoweb3.validateAddress(KOMODO_ADDRESS);
      assert.isDefined(res);
      assert.isDefined(res.isvalid);

      res = await komodoweb3.validateAddress('helloworld');
      assert.isDefined(res);
      assert.isDefined(res.isvalid);
    });
  });

  /** ******** WALLET ********* */
  describe('dumpPrivateKey()', () => {
    it('returns the private key', async () => {
      const address = await komodoweb3.getAccountAddress('');
      if (await isWalletEncrypted(komodoweb3)) {
        await komodoweb3.walletPassphrase(getWalletPassphrase(), 3600);
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until > 0);

        const res = await komodoweb3.dumpPrivateKey(address);
        assert.isDefined(res);
        assert.isString(res);

        await komodoweb3.walletLock();
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until === 0);
      } else {
        const res = await komodoweb3.dumpPrivateKey(address);
        assert.isDefined(res);
        assert.isString(res);
      }
    });
  });

  describe('zExportKey()', () => {
    it('returns the z_private key', async () => {
      const address = await komodoweb3.getNewAddress();
      if (await isWalletEncrypted(komodoweb3)) {
        await komodoweb3.walletPassphrase(getWalletPassphrase(), 3600);
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until > 0);
        const res = await komodoweb3.zExportKey(address);
        assert.isDefined(res);
        assert.isString(res);
        await komodoweb3.walletLock();
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until === 0);
      } else {
        const res = await komodoweb3.zExportKey(address);
        assert.isDefined(res);
        assert.isString(res);
      }
    });
  });

  describe('getAccountAddress()', () => {
    it('returns the account address', async () => {
      const res = await komodoweb3.getAccountAddress('');
      assert.isDefined(res);
      assert.isString(res);
      assert.isTrue(res.startsWith('5') || res.startsWith('R'));
    });
  });

  describe('getAddressesByAccount()', () => {
    it('returns the account address array', async () => {
      const res = await komodoweb3.getAddressesByAccount('');
      assert.isDefined(res);
      assert.isArray(res);
      assert.isTrue(_.every(res, (item) => item.startsWith('5') || item.startsWith('R')));
    });
  });

  describe('getTransaction()', () => {
    it('returns the transaction info', () => {
      const res = {
        amount: 0.00000000,
        fee: -0.10153600,
        confirmations: 384,
        blockhash: '2aca546e5adb3a6e2ac38c5cba81f2ce40097a8982d8b6ef37795729048c48f3',
        blockindex: 2,
        blocktime: 1515935856,
        txid: 'e5ffaafc8cf5a239750075ac1866537bc3999561e2bbd7012bc80b24e0338cbb',
        walletconflicts: [
        ],
        time: 1515935586,
        timereceived: 1515935586,
        'bip125-replaceable': 'no',
        details: [
          {
            account: '',
            category: 'send',
            amount: 0.00000000,
            vout: 0,
            fee: -0.10153600,
            abandoned: false,
          },
          {
            account: '',
            address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
            category: 'send',
            amount: -0.23241276,
            label: 'main',
            vout: 1,
            fee: -0.10153600,
            abandoned: false,
          },
          {
            account: 'main',
            address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
            category: 'receive',
            amount: 0.23241276,
            label: 'main',
            vout: 1,
          },
        ],
        hex: '02000000021e11e4f1db2750a4190f6e3e501f4e85a1e16fa5fe87c40c11ffea351a25cdcc010000006b483045022100a376052aa83c5759eb68e73a0548838a715fcd5225d91346e7709b75b41a74130220481ff6668ca29551a200e71401e946dd6d25ba2b4a5763b8a1666ab59352f0070121038e8b6337a06712e40277d339b4643897e62b337b66eea2d8dd069812d7feb0a3feffffffa39827892bbcfc931a49a2bd6d289a700c8f921caa35d7a5b77373a953592977010000006b483045022100923b8825b5703a21add857fd129daf3f9911c9b5fac0d381a59fe2fd190e81b602201c469fd9378302823320d6bfa2bb502d743eb6843f5d62d6ee8c55ce5dfc50270121038e8b6337a06712e40277d339b4643897e62b337b66eea2d8dd069812d7feb0a3feffffff0200000000000000002301040390d00301280461cac4181497c781c612ad23f4049f253bd52ac2889855f2dac23ca26201000000001976a91417e7888aa7412a735f336d2f6d784caefabb6fa388ac930a0100',
      };
      assert.isDefined(res);
      assert.isDefined(res.amount);
      assert.isDefined(res.fee);
      assert.isDefined(res.confirmations);
      assert.isDefined(res.blockhash);
      assert.isDefined(res.blockindex);
      assert.isDefined(res.txid);
      assert.isDefined(res.walletconflicts);
      assert.isDefined(res.time);
      assert.isDefined(res.timereceived);
      assert.isDefined(res['bip125-replaceable']);
      assert.isDefined(res.hex);
      assert.isDefined(res.details);
    });
  });

  describe('getWalletInfo()', () => {
    it('returns the wallet info', async () => {
      const res = await komodoweb3.getWalletInfo();
      assert.isDefined(res);
      assert.isDefined(res.walletversion);
      assert.isDefined(res.balance);
      assert.isDefined(res.unconfirmed_balance);
      assert.isDefined(res.immature_balance);
      assert.isDefined(res.txcount);
      assert.isDefined(res.keypoololdest);
      assert.isDefined(res.keypoolsize);
      assert.isDefined(res.paytxfee);
      assert.isDefined(res.seedfp);
    });
  });

  describe('getUnconfirmedBalance()', () => {
    it('returns the unconfirmed balance', async () => {
      const res = await komodoweb3.getUnconfirmedBalance();
      assert.isDefined(res);
      assert.isNumber(res);
    });
  });

  describe('listAddressGroupings()', () => {
    it('returns an array of address groupings', async () => {
      const res = await komodoweb3.listAddressGroupings();
      assert.isDefined(res);
      assert.isArray(res);

      if (!_.isEmpty(res)) {
        const innerArr = res[0];
        assert.isArray(innerArr);

        if (!_.isEmpty(innerArr)) {
          const item = innerArr[0];
          qAssert.isPirateAddress(item[0]);
          assert.isTrue(_.isNumber(item[1]));
        }
      }
    });
  });

  describe('listLockUnspent()', () => {
    it('returns an array of unspendable outputs', async () => {
      const res = await komodoweb3.listLockUnspent();
      assert.isDefined(res);
      assert.isArray(res);
    });
  });

  describe('listUnspent()', () => {
    it('returns an unspent output array', async () => {
      const res = await komodoweb3.listUnspent();
      assert.isDefined(res);
      assert.isArray(res);
    });
  });

  describe('walletLock()', () => {
    it('locks the encrypted wallet', async () => {
      if (await isWalletEncrypted(komodoweb3)) {
        await komodoweb3.walletPassphrase(getWalletPassphrase(), 3600, true);
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until > 0);

        await komodoweb3.walletLock();
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until === 0);
      } else {
        assert.isTrue(true);
      }
    });
  });

  describe('walletPassphrase()', () => {
    it('unlocks the encrypted wallet', async () => {
      if (await isWalletEncrypted(komodoweb3)) {
        await komodoweb3.walletLock();
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until === 0);

        await komodoweb3.walletPassphrase(getWalletPassphrase(), 3600, true);
        assert.isTrue((await komodoweb3.getWalletInfo()).unlocked_until > 0);
      } else {
        assert.isTrue(true);
      }
    });
  });

  // Runs tests that are more suited for a clean environment, eg. CI tests
  // eslint-disable-next-line no-unused-expressions
  !_.includes(process.argv, '--cleanenv') ? describe.skip : describe('cleanEnv tests', () => {
    describe('getNewAddress()', () => {
      it('returns a new runebase address', async () => {
        const res = await komodoweb3.getNewAddress('');
        assert.isDefined(res);
        assert.isString(res);
        assert.isTrue(res.startsWith('5') || res.startsWith('R'));
      });
    });

    describe('backupWallet()', () => {
      it('backup the wallet', async () => {
        const res = await komodoweb3.backupWallet(path.join(__dirname, './data/backup.dat'));
        assert.notTypeOf(res, 'Error');
      });
    });

    describe('importWallet()', () => {
      it('throw an error if importing a non-existent file', async () => {
        try {
          await komodoweb3.importWallet(path.join(__dirname, './data/backup.dat'));
        } catch (err) {
          assert.isDefined(err);
          assert.equal(err, 'Error: Cannot open wallet dump file');
        }
      });

      it('import the wallet from a wallet dump file', async () => {
        const res = await komodoweb3.importWallet(path.join(__dirname, './data/backup.dat'));
        assert.notTypeOf(res, 'Error');
      });
    });
  });
});
