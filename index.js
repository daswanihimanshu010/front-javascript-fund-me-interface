// in nodejs
// require()

// in frontend javascript you can't use require
// import

import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress, rpcUrl } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const getBalanceButton = document.getElementById("getBalanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
getBalanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
  // First we are checking that our browser has meta mask extension or not by using window.ethereum
  // We can check phathom support (solana extension) by using window.solana
  // Visit: https://docs.metamask.io/guide/rpc-api.html#eth-requestaccounts

  if (typeof window.ethereum != "undefined") {
    // This statement helps us request metamask to give popup to connect to one of your accounts

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log("error");
    }
    console.log("Connected!!");
    document.getElementById("connectButton").innerHTML = "Connected";

    // Prints the account address through which you are connected to metamask

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install metamask extension in your browser!!";
  }
}

async function fund() {
  // For now we are hardcoding
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ... ${ethAmount}`);
  if (typeof window.ethereum != "undefined") {
    // provider / connection to the blockchain
    // signer / wallet / someone with the some gas
    // contract that we are interacting with
    // ^ ABI * Contract Address

    // getWeb3Provider() is basically a function to wrap around stuff like metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // This is going to return the account we are connected to in metamask
    const signer = provider.getSigner();

    // How do we get ABI and contract address for contract. Look at readme.
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.sendUsd({
        value: ethers.utils.parseEther(ethAmount),
      });

      // listen for a transaction to be mined
      await listenForTransaction(transactionResponse, provider);
      console.log("Transcation mined!!");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransaction(transactionResponse, provider) {
  console.log(`Mining transaction hash ${transactionResponse.hash}`);

  // listenForTransaction function called above is waiting for a promise to be returned and the next
  // line saying Transcation mined!! will not be printed till function returns something

  return new Promise((resolve, reject) => {
    // If we do not return promise here, the provider.once function will be separately executed.
    // That means listenForTransaction has await keyword in front of it but it will not wait for
    // provider.once to finish and it will move onto the next statement and print Transcation mined!!

    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Mined with ${transactionReceipt.confirmations} confirmations.`
      );
    });

    // This resolve function will tell the listenForTransaction that the result that await keyword was
    // waiting for has been found and we are ending the statements here.

    resolve();

    // The reject function will tell the listenForTransaction that the result cannot be fetched
    // and there was a timeout
  });
}

async function withdraw() {
  console.log(`Withdrawing amount...`);
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();

      // listen for a transaction to be mined
      await listenForTransaction(transactionResponse, provider);
      console.log("Transcation mined!!");
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
}

async function getBalance() {
  console.log(`Balance of contract is:`);
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
}
