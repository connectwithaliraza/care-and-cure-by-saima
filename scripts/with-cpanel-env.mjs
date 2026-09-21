import { readFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'

const allowedVariables = new Set([
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SERVER_URL',
  'NEXT_PUBLIC_SITE_URL',
])

const htaccess = await readFile(new URL('../.htaccess', import.meta.url), 'utf8')
const environment = { ...process.env }

for (const line of htaccess.split(/\r?\n/)) {
  const match = line.match(/^\s*SetEnv\s+([A-Za-z_][A-Za-z0-9_]*)\s+(.+?)\s*$/)
  if (!match || !allowedVariables.has(match[1])) continue

  let value = match[2]
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  environment[match[1]] = value
}

const missing = [...allowedVariables].filter((name) => !environment[name])
if (missing.length) {
  console.error(`Missing cPanel environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

const [command, ...args] = process.argv.slice(2)
if (!command) {
  console.error('Usage: node scripts/with-cpanel-env.mjs <command> [...args]')
  process.exit(1)
}

const child = spawn(command, args, { env: environment, stdio: 'inherit', shell: false })
child.on('error', (error) => {
  console.error(error.message)
  process.exit(1)
})
child.on('exit', (code, signal) => {
  if (signal) console.error(`Command stopped by signal ${signal}`)
  process.exit(code ?? 1)
})
