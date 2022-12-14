import "regenerator-runtime/runtime";

import getConfig from "./nearConfig";
import { CONTRACT_CHANGE_METHODS, CONTRACT_VIEW_METHODS } from "./appConfig";

const nearAPI = require("near-api-js");

// const nearConfig = getConfig(process.env.NODE_ENV || "development");
const nearConfig = getConfig("development");

async function connect(nearConfig) {
  // Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
  // Initializing connection to the NEAR node.
  window.near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  });

  // Needed to access wallet login
  window.walletConnection = new nearAPI.WalletConnection(window.near);

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await new nearAPI.Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read-only – they don't modify the state, but usually return some value
    viewMethods: CONTRACT_VIEW_METHODS,
    // Change methods can modify the state, but you don't receive the returned value when called
    changeMethods: CONTRACT_CHANGE_METHODS,
    // Sender is the account ID to initialize transactions.
    // getAccountId() will return empty string if user is still unauthorized
    sender: window.walletConnection.getAccountId()
  });
}

function errorHelper(err) {
  // if there's a cryptic error, provide more helpful feedback and instructions here
  // TODO: as soon as we get the error codes propagating back, use those
  if (err.message.includes('Cannot deserialize the contract state')) {
    console.warn('NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n' +
      'This may require deleting and recreating the NEAR account as shown here:\n' +
      'https://stackoverflow.com/a/60767144/711863');
  }
  if (err.message.includes('Cannot deserialize the contract state')) {
    console.warn('NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n' +
      'This may require deleting and recreating the NEAR account as shown here:\n' +
      'https://stackoverflow.com/a/60767144/711863');
  }
  console.error(err);
}

const makeConnection = (window) => {
  window.nearInitPromise = connect(nearConfig)
    .then(() => { console.log("Connected to NEAR") })
    .catch(console.error);
}


export default makeConnection
export { errorHelper }
