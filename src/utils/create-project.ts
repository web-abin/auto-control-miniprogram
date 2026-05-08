import ci from 'miniprogram-ci'
import type { AcmpConfig } from '../types.js'

/** 把 AcmpConfig 转成 miniprogram-ci 的 Project 实例 */
export function createProject(cfg: AcmpConfig): InstanceType<typeof ci.Project> {
  const opts: Record<string, unknown> = {
    appid: cfg.appid,
    type: cfg.type,
    projectPath: cfg.projectPath,
    ignores: cfg.ignores,
  }
  if (cfg.privateKey) opts.privateKey = cfg.privateKey
  else if (cfg.privateKeyPath) opts.privateKeyPath = cfg.privateKeyPath
  // miniprogram-ci 的类型声明 Project 构造器签名带特殊重载，这里忽略
  return new (ci.Project as unknown as new (o: unknown) => InstanceType<typeof ci.Project>)(opts)
}
