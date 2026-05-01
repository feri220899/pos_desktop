import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import javascriptObfuscator from 'javascript-obfuscator'

function obfuscatorPlugin() {
    return {
        name: 'vite-plugin-obfuscator',
        apply: 'build',
        renderChunk(code) {
            const result = javascriptObfuscator.obfuscate(code, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.5,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.75,
                rotateStringArray: true,
                selfDefending: true,
            })
            return { code: result.getObfuscatedCode() }
        },
    }
}

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {
        plugins: [
            vue(),
            tailwindcss(),
        ],
    },
})
