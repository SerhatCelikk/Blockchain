import crypto from "crypto-js";
const {SHA256} = crypto;
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString()
  }
  mineBlock(difficulty){
    while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
        this.nonce++;
        this.hash = this.calculateHash();
    }
    console.log("Block Mined:", this.hash)
  }
}
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = []
  }
  createGenesisBlock() {
    return new Block("08/07/2022", [new Transaction(null, "x-address", 0)]);
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addTransaction(transaction) {
    if(!transaction.fromAddress || !transaction.toAddress){
         throw new Error("Transaction must include from and to address");
     }
    this.pendingTransactions.push(transaction);
  }
  minePendingTransactions(){
    let block = new Block(Date.now(),this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(3)
    this.chain.push(block);
    this.pendingTransactions = [];
  }
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];
      if(currentBlock.hash !== currentBlock.calculateHash()){

        return false;
      }
      if(currentBlock.previousHash !== prevBlock.hash){
        return false
      }
      return true
    }
  }
  getBalanceOfAddress(address) {
    let balance = 0;

    for(const block of this.chain){
        for(const transaction of block.transactions){
            if(transaction.fromAddress === address){
                balance-=transaction.amount;
            }
            if(transaction.toAddress === address){
                balance+=transaction.amount;
            }
        }
    }
    return balance;
  }
}
const cn = new Blockchain();

cn.addTransaction(new Transaction("x-address", "y-address", 100));
cn.addTransaction(new Transaction("x-address", "y-address", 100));
cn.addTransaction(new Transaction("x-address", "y-address", 700));

cn.minePendingTransactions();

console.log("is chain valid? ", cn.isChainValid())
cn.addTransaction(new Transaction("x-address", "y-address", 100));
cn.addTransaction(new Transaction("x-address", "y-address", 500));
cn.addTransaction(new Transaction("x-address", "y-address", 100));

cn.minePendingTransactions();

console.log(cn.getBalanceOfAddress("x-address"));
console.log(cn.getBalanceOfAddress("y-address"));

console.log("is chain valid? ", cn.isChainValid())
