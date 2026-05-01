import JavaScriptObfuscator from 'javascript-obfuscator'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const options = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    rotateStringArray: true,
    selfDefending: true,
    disableConsoleOutput: true,
}

function obfuscateDir(dir) {
    for (const file of readdirSync(dir)) {
        const fullPath = join(dir, file)
        if (statSync(fullPath).isDirectory()) {
            obfuscateDir(fullPath)
        } else if (extname(file) === '.js') {
            const code = readFileSync(fullPath, 'utf8')
            const result = JavaScriptObfuscator.obfuscate(code, options)
            writeFileSync(fullPath, result.getObfuscatedCode())
            console.log('obfuscated:', fullPath)
        }
    }
}

obfuscateDir('out/main')
obfuscateDir('out/preload')
console.log('obfuscation done.')
