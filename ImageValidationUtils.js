# ImageValidationUtils.js

const fs = require('fs');
const imageType = require('image-type');
const sharp = require('sharp');

class ImageValidationUtils {
  constructor() {
    // You can initialize any configuration or settings here
  }

  async isImageFile(filePath) {
    try {
      const stats = await fs.promises.stat(filePath);
      if (!stats.isFile()) {
        return false; // Not a file
      }

      const buffer = await fs.promises.readFile(filePath);
      if (!this.isSupportedImageType(buffer)) {
        return false; // Unsupported image type
      }

      const dimensions = await this.getImageDimensions(buffer);
      if (!dimensions) {
        return false; // Unable to get image dimensions
      }

      // Additional validation checks (e.g., file size, resolution, etc.)

      return true; // Valid image file
    } catch (error) {
      console.error('Error checking image file:', error);
      return false;
    }
  }

  isSupportedImageType(buffer) {
    const type = imageType(buffer);
    return type !== null;
  }

  async getImageDimensions(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
      };
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return null;
    }
  }
}

module.exports = ImageValidationUtils;
