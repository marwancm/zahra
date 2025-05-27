// This script can be run with Node.js to optimize images
// Install required packages:
// npm install sharp glob fs-extra

const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const config = {
  inputDir: './public',
  outputDir: './public/optimized',
  formats: ['webp', 'avif'],
  quality: 80,
  sizes: [640, 1024, 1600], // Responsive sizes
};

async function optimizeImages() {
  // Create output directory if it doesn't exist
  fs.ensureDirSync(config.outputDir);

  // Find all images
  const imageFiles = glob.sync(`${config.inputDir}/**/*.{jpg,jpeg,png}`);
  
  console.log(`Found ${imageFiles.length} images to optimize`);

  for (const file of imageFiles) {
    const filename = path.basename(file, path.extname(file));
    const image = sharp(file);
    const metadata = await image.metadata();

    // Create responsive versions in each format
    for (const format of config.formats) {
      for (const width of config.sizes) {
        // Skip if target width is larger than original
        if (width > metadata.width) continue;
        
        const outputPath = path.join(
          config.outputDir, 
          `${filename}-${width}.${format}`
        );
        
        await image
          .resize(width)
          [format]({ quality: config.quality })
          .toFile(outputPath);
      }
      
      // Also create full-size version
      const outputPath = path.join(
        config.outputDir, 
        `${filename}.${format}`
      );
      
      await image
        [format]({ quality: config.quality })
        .toFile(outputPath);
    }
    
    console.log(`Optimized: ${file}`);
  }

  console.log('Image optimization complete!');
  console.log(`Optimized images are in: ${config.outputDir}`);
  console.log('To use these images, reference them as: /optimized/image-name.webp');
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
});
