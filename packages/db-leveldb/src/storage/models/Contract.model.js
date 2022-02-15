const Model = require("../Model");

class Contract extends Model {
  contractName = {
    defaultValue: ""
  };
  abi = {
    defaultValue: []
  };

  metadata;
  devdoc;
  userdoc;
  sourcePath;
  source;
  sourceMap;
  ast;
  legacyAST;
  bytecode;
  deployedBytecode;
  compiler;

  processedSource;
  createBytecode;
  callBytecode;
  callBytecodeGeneratedSources;
  createBytecodeGeneratedSources;

  async beforeSave() {
    const newId = this.generateID();

    // Key exists in db, but data fields have changed so remove old key
    // This could also become a batch operation and would then be atomic
    if (this.id && this.id !== newId) {
      await Contract.delete(this.id);
    }
    this.id = newId;
  }

  generateID() {
    return this.sha3(
      this.name +
        JSON.stringify(this.abi) +
        JSON.stringify(this.processedSource) +
        JSON.stringify(this.compilation)
    );
  }
}

module.exports = Contract;