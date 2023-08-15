# DataEncryptionUtils.js

const crypto=require('crypto');class DataEncryptionUtils{constructor(t){if(!t||32!==t.length)throw new Error("Invalid secret key length. The key should be 32 bytes long.");this.secretKey=t,this.algorithm='aes-256-cbc',this.ivLength=16}generateRandomIV(){return crypto.randomBytes(this.ivLength)}encrypt(t){const e=this.generateRandomIV(),r=crypto.createCipheriv(this.algorithm,Buffer.from(this.secretKey),e);let n=r.update(t,'utf8','hex');return n+=r.final('hex'),{iv:e.toString('hex'),encryptedData:n}}decrypt(t,e){const r=crypto.createDecipheriv(this.algorithm,Buffer.from(this.secretKey),Buffer.from(e,'hex'));let n=r.update(t,'hex','utf8');return n+=r.final('utf8')}}module.exports=DataEncryptionUtils;
