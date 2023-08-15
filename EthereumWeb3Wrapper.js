const Web3 = require('web3');

class EthereumWeb3Wrapper {
  constructor(providerURL) {
    this.web3 = new Web3(providerURL);
  }

  async getBlockNumber() {
    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      return blockNumber;
    } catch (error) {
      this.logError('Error getting block number:', error);
      throw error;
    }
  }

  async getBalance(address) {
    try {
      const balanceWei = await this.web3.eth.getBalance(address);
      const balanceEther = this.web3.utils.fromWei(balanceWei, 'ether');
      return balanceEther;
    } catch (error) {
      this.logError('Error getting balance:', error);
      throw error;
    }
  }

  async sendTransaction(senderAddress, recipientAddress, amountEther, privateKey) {
    try {
      const nonce = await this.web3.eth.getTransactionCount(senderAddress);
      const gasPrice = await this.web3.eth.getGasPrice();
      const gasLimit = 21000; // Standard gas limit for a simple Ether transfer

      const transactionObject = {
        nonce,
        gasPrice,
        gas: gasLimit,
        to: recipientAddress,
        value: this.web3.utils.toWei(amountEther, 'ether'),
      };

      const signedTransaction = await this.web3.eth.accounts.signTransaction(transactionObject, privateKey);
      const transactionReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

      return transactionReceipt;
    } catch (error) {
      this.logError('Error sending transaction:', error);
      throw error;
    }
  }

  // Additional methods...

  logError(message, error) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [ERROR] ${message} ${error.stack || error}`;
    console.error(logMessage);
  }
}

module.exports = EthereumWeb3Wrapper;
