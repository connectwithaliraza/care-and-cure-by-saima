import { access, cp, mkdir } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '..')
const standaloneRoot = path.join(projectRoot, '.next', 'standalone')

await access(path.join(standaloneRoot, 'server.js'))
await mkdir(path.join(standaloneRoot, '.next'), { recursive: true })
await cp(path.join(projectRoot, '.next', 'static'), path.join(standaloneRoot, '.next', 'static'), {
  recursive: true,
})
await cp(path.join(projectRoot, 'public'), path.join(standaloneRoot, 'public'), { recursive: true })

console.log('Standalone public and static assets prepared.')
