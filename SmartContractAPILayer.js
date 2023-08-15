const Web3 = require('web3');

class SmartContractAPILayer {
  constructor(providerURL) {
    this.web3 = new Web3(providerURL);
  }

  async deployContract(abi, bytecode, deployerAddress, gas, options = {}) {
    try {
      const contract = new this.web3.eth.Contract(abi);

      const deployTransaction = contract.deploy({
        data: bytecode,
      });

      const deployGas = gas || await deployTransaction.estimateGas();
      const transactionOptions = {
        from: deployerAddress,
        gas: deployGas,
        ...options,
      };

      const deployedContract = await deployTransaction.send(transactionOptions);
      return deployedContract;
    } catch (error) {
      this.logError('Error deploying contract:', error);
      throw error;
    }
  }

  async callContractMethod(contractAddress, abi, method, callerAddress, ...args) {
    try {
      const contract = new this.web3.eth.Contract(abi, contractAddress);

      const callTransaction = contract.methods[method](...args);
      const options = {
        from: callerAddress,
      };

      const result = await callTransaction.call(options);
      return result;
    } catch (error) {
      this.logError('Error calling contract method:', error);
      throw error;
    }
  }

  async sendContractMethod(contractAddress, abi, method, senderAddress, privateKey, ...args) {
    try {
      const contract = new this.web3.eth.Contract(abi, contractAddress);

      const sendTransaction = contract.methods[method](...args);
      const gasEstimate = await sendTransaction.estimateGas({ from: senderAddress });
      const gasPrice = await this.web3.eth.getGasPrice();

      const options = {
        from: senderAddress,
        gas: gasEstimate,
        gasPrice: gasPrice,
        data: sendTransaction.encodeABI(),
        nonce: await this.web3.eth.getTransactionCount(senderAddress, 'pending'),
      };

      const signedTransaction = await this.web3.eth.accounts.signTransaction(options, privateKey);
      const transactionReceipt = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      return transactionReceipt;
    } catch (error) {
      this.logError('Error sending contract method transaction:', error);
      throw error;
    }

     logError(message, error)


    async deployContract(abi, bytecode, deployerAddress, gas, options = {}) {
    try {
      const contract = new this.web3.eth.Contract(abi);

      const deployTransaction = contract.deploy({
        data: bytecode,
      });

      const deployGas = gas || await deployTransaction.estimateGas();
      const transactionOptions = {
        from: deployerAddress,
        gas: deployGas,
        ...options,
      };

      const deployedContract = await deployTransaction.send(transactionOptions);
      const contractAddress = deployedContract.options.address;

      await this.recordDeployment(deployerAddress, contractAddress, deployedContract.transactionHash);

      return deployedContract;
    } catch (error) {
      this.logError('Error deploying contract:', error);
      throw error;
    }
  }

  async recordDeployment(deployerAddress, contractAddress, transactionHash) {
    // This is where you can record the deployment details immutably, such as using a smart contract or an external database.
    // For example, you could invoke a method on a "DeploymentRegistry" smart contract to store the details.
    // You may need to implement the smart contract and its interactions separately.
    // In this example, the method is left as a placeholder.
    // Example: await deploymentRegistry.recordDeployment(deployerAddress, contractAddress, transactionHash);
  }

  // Other methods...

  logError(message, error) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [ERROR] ${message} ${error.stack || error}`;
    console.error(logMessage);
  }
}

module.exports = SmartContractAPILayer;
Please note that the recordDeployment method is a plac
