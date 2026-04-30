const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'src', 'assets', 'images');
const outputDir = path.join(__dirname, 'src', 'assets', 'images_optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const compressImages = async () => {
    try {
        const files = fs.readdirSync(inputDir);
        
        console.log(`Found ${files.length} files. Starting compression...`);

        for (const file of files) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file);
            
            // Skip if it's a directory
            if (fs.lstatSync(inputPath).isDirectory()) continue;

            const ext = path.extname(file).toLowerCase();
            
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                console.log(`Optimizing: ${file}`);
                
                let pipeline = sharp(inputPath);

                if (ext === '.jpg' || ext === '.jpeg') {
                    pipeline = pipeline.jpeg({ quality: 75, progressive: true });
                } else if (ext === '.png') {
                    pipeline = pipeline.png({ quality: 75, compressionLevel: 8 });
                } else if (ext === '.webp') {
                    pipeline = pipeline.webp({ quality: 75 });
                }

                await pipeline.toFile(outputPath);
            } else {
                // Copy non-image files as is
                fs.copyFileSync(inputPath, outputPath);
            }
        }

        console.log('--- Compression Complete! ---');
        console.log(`Optimized images are in: ${outputDir}`);
        console.log('Check the files, and then you can replace the original images with these.');
        
    } catch (err) {
        console.error('Error during compression:', err);
    }
};

compressImages();
