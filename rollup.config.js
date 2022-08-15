import image from "@rollup/plugin-image"

export default {
    input: "src/main.js",
    output: {
        sourcemap: true,
        file: "bundle.js",
        format: "es"
    },
    plugins: [image()]
}