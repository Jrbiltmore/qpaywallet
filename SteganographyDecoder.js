
const fs = require('fs');
const crypto = require('crypto');

class SteganographyDecoder {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  decodeTextFromImage(imagePath) {
    try {
      const imageData = fs.readFileSync(imagePath);
      const encryptedBinaryText = this.extractBinaryText(imageData);
      const decryptedText = this.decryptText(encryptedBinaryText);
      return decryptedText;
    } catch (error) {
      console.error('Error decoding text from image:', error);
      return null; // Decoding failed
    }
  }

  extractBinaryText(imageData) {
    let binaryText = '';

    for (let i = 0; i < imageData.length; i += 4) {
      const pixel = this.readPixel(imageData, i);
      const lsb = this.extractDataFromPixel(pixel);
      binaryText += lsb;
    }

    return binaryText;
  }

  decryptText(encryptedBinaryText) {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
      const encryptedBuffer = Buffer.from(encryptedBinaryText, 'base64');
      const decryptedBuffer = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
      return decryptedBuffer.toString('utf8');
    } catch (error) {
      console.error('Error decrypting text:', error);
      return null; // Decryption failed
    }
  }

  readPixel(imageData, index) {
    // Implement pixel reading logic from SteganographyEncoder.js
  }

  extractDataFromPixel(pixel) {
    const lsb = pixel.r & 1; // Extract the least significant bit
    return lsb.toString();
  }
}

module.exports = SteganographyDecoder;
