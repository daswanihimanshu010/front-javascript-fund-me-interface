# To send a transaction on a blockchain what do we need:

1. Provider / connection to the blockchain
2. Signer / wallet / someone with the some gas
3. Contract that we are interacting with
   ^ ABI && Contract Address

# To check if our browser has a node i.e. metamask or phantom extension to interact with our blockchain

We can check that in our browser ctrl + shift + i and looking for window keyword in our console.
If we find window.ethereum object that means we have metamask extension and we can connect to a blockchain. That is why we are checking in index.js for window.ethereum.

Various actions that you can do are listed here:

Visit: https://docs.metamask.io/guide/rpc-api.html#eth-requestaccounts

# Nodejs (Backend) vs frontend javascript

We are using nodejs in our smart contracts and deploy script project hardhat-fund-me as a backend project. We are using require statements there to import from packages.

In frontend javascript require statement won't work so we have to use import statements.

So we are cannot import ethers library using require statement as there are no node modules in our project. To import ethers in our frontend javascript project visit: https://docs.ethers.io/v5/getting-started/#getting-started--importing--web-browser

# <script src = "./index.js" type="module"></script>

type="module" allows us in importing a library like ethers in our script like:
import { ethers } from "./ethers-5.6.esm.min.js";

type="text/javascript" is self understood.

And after we change from text/javascript to module in type we have to make function calls directly from index.js instead of index.html.

So we can remove onclick="connect()" from index.html in button tag

`<button id="connectButton">Connect</button>`

and make those connect buttons in index.js directly.

`const connectButton = document.getElementById("connectButton");`
`connectButton.onclick = connect;`

# Using Web3Provider() as a provider

Visit: https://docs.ethers.io/v5/api/providers/other/#Web3Provider

It is same like JsonRpcProvider that used in ethers connection project, where we directly inputted the RPC url where we want to connect.

Web3Provider() is basically a function to wrap around stuff like metamask. It basically looks for http endpoint where the metamask is to make our provider.

This is going to return the account we are connected to in metamask
const signer = provider.getSigner()

# How to get contract abi and address from backend hardhat-fund-me-project

1. Go to artifacts > contracts > FundMe.sol > FundMe.json > abi []

2. For contract address and abi to work we have deploy this hardhat-fund-me project on a network like goerli or localhost. So we can use multiple terminal with different project path and run yarn hardhat node in our backend project to get contract address and abi working.

3. Also we have to add our network in our metamask as Hardhat localhost with RPC url, port: 31337, currency: ETH that has been given by node running in our console.

4. After adding network we can import our account / private key for balance. Click on avatar on top right of account and select import account and enter your private key there.

# Resetting an Account in Metamask

If you get this type of error:

`Error: Nonce too high. Expected nonce to be 2 but got 4.`

This happens when we close hardhat node and open again but metamask isn't smart enough to know so we have to tell him.

Go to Big Account button on right > Settings > Advanced > Reset Account.

# Listing for Events and Completed Transactions

Visit: https://docs.ethers.io/v5/api/providers/provider/#Provider-once

provider.once( eventName , listener)

We are waiting for eventName to happen, and then when it happens it will return a function.

Like we are waiting for the transaction to be mined.

`provider.once(transactionResponse.hash, (transactionReceipt) => {`
`});`
