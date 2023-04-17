/* 
    Builder by Whitigol#2122
*/

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { resourceDir, resourceName } = require('./config.json');
const Obfuscator = require('javascript-obfuscator');

// Move config.json from src to dist
fs.copyFileSync('./src/config.json', './dist/config.json');

if (!resourceDir || resourceDir === '') {
    console.log('Please specify a resource directory in config.json');
    process.exit(1);
}

if (!resourceName || resourceName === '') {
    console.log('Please specify a resource name in config.json');
    process.exit(1);
}

const resourcePath = path.resolve(resourceDir); // Convert to absolute path (Just in case)

// Log that the resourceName is being built to the resourcePath in green color
console.log(`\x1b[32mBuilding ${resourceName} to ${resourcePath}\x1b[0m`);

// process.exit(1);

// Update the name in the dist/package.json
// const packageJson = require('./dist/package.json');
// packageJson.name = resourceName;
// fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 4));

// Build the config
spawn('yarn generateConfig', [], {
    shell: true,
    stdio: 'inherit',
    cwd: __dirname
})

// Compile the typescript files
spawn('npx tsc', [], {
    shell: true,
    stdio: 'inherit'
});

// Bundle the resource files
spawn('npx webpack', [], {
    shell: true,
    stdio: 'inherit',
    cwd: __dirname
})

// Delete all files in the resource folder
spawn('rmdir', ['/s', '/q', `${resourcePath}`], {
    shell: true,
    stdio: 'inherit'
})

// // Create the resource path
// spawn('mkdir', [resourcePath], {
//     shell: true,
//     stdio: 'inherit'
// })

// Copy all files from the dist folder to the resource folder
const copy = spawn('xcopy', [
    'dist',
    resourcePath,
    '/E',
    '/I',
    '/C',
    '/H',
    '/F',
    '/Y',
], {
    shell: true,
    stdio: 'inherit'
})

copy.on('close', () => {
    RunObfuscator();
})

function RunObfuscator() {
    let files = [];
    function ThroughDirectory(directory) {
        fs.readdirSync(directory).forEach(file => {
            const Absolute = path.join(directory, file);
            if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
            else return files.push(Absolute);
        })
    }

    ThroughDirectory(resourcePath);

    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        console.log('Obfuscating: ' + file + '...');
        const fileContents = fs.readFileSync(file, 'utf8');
        const obfuscate = Obfuscator.obfuscate(fileContents, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: false,
            disableConsoleOutput: false,
        });

        fs.writeFileSync(file, obfuscate.getObfuscatedCode());
    })
}