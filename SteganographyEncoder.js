# SteganographyEncoder.js
const fs = require('fs');
const crypto = require('crypto');

class SteganographyEncoder {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  encodeTextIntoImage(inputImagePath, outputImagePath, textToEncode) {
    try {
      const imageData = fs.readFileSync(inputImagePath);
      const encryptedText = this.encryptText(textToEncode);
      const encodedImageData = this.embedText(imageData, encryptedText);
      fs.writeFileSync(outputImagePath, encodedImageData);
      return true; // Successful encoding
    } catch (error) {
      console.error('Error encoding text into image:', error);
      return false; // Encoding failed
    }
  }

  encryptText(text) {
    const cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
    const encryptedBuffer = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return encryptedBuffer.toString('base64');
  }

  embedText(imageData, encryptedText) {
    const binaryText = this.textToBinary(encryptedText);
    let dataIndex = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      if (dataIndex >= binaryText.length) {
        break; // All data has been embedded
      }

      const pixel = this.readPixel(imageData, i);
      const newPixel = this.embedDataInPixel(pixel, binaryText[dataIndex]);
      this.writePixel(imageData, i, newPixel);
      
      dataIndex++;
    }

    return imageData;
  }

  readPixel(imageData, index) {
    const pixel = {
      r: imageData.readUInt8(index),
      g: imageData.readUInt8(index + 1),
      b: imageData.readUInt8(index + 2),
      a: imageData.readUInt8(index + 3),
    };
    return pixel;
  }

  embedDataInPixel(pixel, bit) {
    const bitValue = parseInt(bit, 2);
    pixel.r = (pixel.r & 0xFE) | bitValue;
    return pixel;
  }

  writePixel(imageData, index, pixel) {
    imageData.writeUInt8(pixel.r, index);
    imageData.writeUInt8(pixel.g, index + 1);
    imageData.writeUInt8(pixel.b, index + 2);
    imageData.writeUInt8(pixel.a, index + 3);
  }

  textToBinary(text) {
    const lengthBinary = this.decimalToBinary(text.length);
    let binary = lengthBinary.padStart(32, '0'); // Assuming maximum text length of 2^32 - 1
  
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      binary += charCode.toString(2).padStart(8, '0');
    }
  
    return binary;
  }
  
  decimalToBinary(decimal) {
    return decimal.toString(2);
  }
}

module.exports = SteganographyEncoder;

