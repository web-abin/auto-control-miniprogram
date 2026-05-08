import pc from 'picocolors'

export const logger = {
  info: (m: string) => console.log(pc.cyan('▶') + ' ' + m),
  ok: (m: string) => console.log(pc.green('✓') + ' ' + m),
  warn: (m: string) => console.warn(pc.yellow('!') + ' ' + m),
  error: (m: string) => console.error(pc.red('✗') + ' ' + m),
  step: (m: string) => console.log('  ' + pc.gray(m)),
  raw: (m: string) => console.log(m),
}
