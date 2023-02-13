import ncc from "@vercel/ncc"
import * as fs from "node:fs/promises"
import * as path from "node:path"

const url = new URL(import.meta.url)

const projectPath = path.join(path.dirname(url.pathname), "../")
const sourcePath = path.join(projectPath, "./scripts/serve.js")
const distPath = path.join(projectPath, "./dist")

await fs.mkdir(distPath, { recursive: true })

const { code: originalCode, assets } = await ncc(sourcePath, {
  esm: false,
  transpileOnly: true,
})

const regex = /exports\.getFileName\s*=\s*function\s*\(calling_file\)\s*\{.+?\};/s
const code = originalCode.replace(regex, 'exports.getFileName = function () { return __filename }')

const codePath = path.join(distPath, "./index.js")
await fs.writeFile(codePath, code, { mode: 0o666 })

const distPackagePath = path.join(distPath, "./package.json")
await fs.writeFile(distPackagePath, "{}")

for (const asset of Object.keys(assets)) {
  const assetPath = path.join(distPath, asset)
  await fs.mkdir(path.dirname(assetPath), { recursive: true })
  console.log(`+ ${asset}`)
  await fs.writeFile(assetPath, assets[asset].source, {
    mode: assets[asset].permissions,
  })
}

