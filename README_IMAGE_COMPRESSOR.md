# SnapLinks - World-Class Image Compressor

This module provides a production-ready, ultra-fast image compression API and UI, designed to rival TinyPNG and Squoosh.

## Features
- **Smart Compression:** Auto-optimizes quality and filesize perfectly.
- **Custom Mode:** Allows specific JPEG/PNG quality from 1-100%.
- **Target Mode:** Uses binary-search algorithms to hit a specific file size (e.g. exactly 50KB).
- **Format Support:** JPG, JPEG, PNG, WebP, AVIF, GIF.
- **Conversions:** Capable of converting formats (e.g. PNG to WebP) on the fly.
- **Resizing:** Optional width/height resampling with Lanczos algorithm.
- **Metadata Management:** Option to strip EXIF data to save bytes.
- **Batch Processing:** Compress unlimited files natively and export as a ZIP.

## Setup Instructions

1. **Python Dependencies**
   The backend relies on the `Pillow` engine and `pillow-avif-plugin` for deep image manipulation.
   ```bash
   pip install Pillow pillow-avif-plugin aiofiles
   ```

2. **Endpoints**
   - **Frontend:** `http://localhost:3000/tools/image-compressor`
   - **Backend API:** `http://localhost:8000/api/image/compress`

## API Reference

### `POST /api/image/compress`
Uploads and compresses an image.
- **Payload:** `multipart/form-data`
  - `file`: The binary image.
  - `mode`: `smart`, `custom`, or `target`
  - `quality`: int (10-100)
  - `targetSizeKb`: int (if mode is target)
  - `outputFormat`: `original`, `webp`, `jpg`, `png`
  - `resizeWidth`: int (optional)
  - `keepMetadata`: boolean
- **Success Response:**
  ```json
  {
    "success": true,
    "fileName": "my-photo_compressed.webp",
    "originalSize": 2500000,
    "compressedSize": 150000,
    "savedPercentage": 94.0,
    "quality": 85,
    "outputFormat": "WEBP",
    "dimensions": "1920x1080",
    "compressionTimeMs": 145,
    "downloadUrl": "/api/image/download/some-uuid.webp",
    "expiresIn": "30 minutes"
  }
  ```
