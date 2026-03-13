import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { getStore } from '../lib/store'

function Toggle({ checked, onChange, label, desc }: { checked: boolean, onChange: (v: boolean) => void, label: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#3b82f6]' : 'bg-gray-300'}`}
        role="switch"
        aria-checked={checked}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      <div className="flex items-center gap-3">
        <span className="text-base font-medium text-gray-900">{label}</span>
        <span className="text-sm text-gray-400">{desc}</span>
      </div>
    </div>
  )
}

export function SettingsTab({ showWorkDetail, onToggleWorkDetail }: { showWorkDetail: boolean, onToggleWorkDetail: (v: boolean) => void }) {
  const [url, setUrl] = useState('http://localhost:4446')
  const [token, setToken] = useState('')
  const [testResult, setTestResult] = useState('')
  const [enableOpenClaw, setEnableOpenClaw] = useState(true)
  const [enableClaudeCode, setEnableClaudeCode] = useState(false)
  const [hookStatus, setHookStatus] = useState('')

  useEffect(() => {
    ;(async () => {
      const store = await getStore()
      setUrl(((await store.get('gateway_url')) as string) || 'http://localhost:4446')
      setToken(((await store.get('gateway_token')) as string) || '')
      const oc = await store.get('enable_openclaw')
      if (typeof oc === 'boolean') setEnableOpenClaw(oc)
      const cc = await store.get('enable_claudecode')
      if (typeof cc === 'boolean') setEnableClaudeCode(cc)
    })()
  }, [])

  const saveSettings = async () => {
    const store = await getStore()
    await store.set('gateway_url', url)
    await store.set('gateway_token', token)
    await store.save()
  }

  const testConnection = async () => {
    try {
      await saveSettings()
      const store = await getStore()
      const agentId = ((await store.get('tracked_agent')) as string) || 'main'
      const result: any = await invoke('get_status', { gatewayUrl: url, token, agentId })
      setTestResult(`连接成功! ${result.sessions.length} 个 session`)
    } catch (e: any) {
      setTestResult(`失败: ${String(e)}`)
    }
  }

  const toggleOpenClaw = async (val: boolean) => {
    setEnableOpenClaw(val)
    const store = await getStore()
    await store.set('enable_openclaw', val)
    await store.save()
  }

  const toggleClaudeCode = async (val: boolean) => {
    setEnableClaudeCode(val)
    const store = await getStore()
    await store.set('enable_claudecode', val)
    await store.save()
    if (val) {
      try {
        await invoke('install_claude_hooks')
        setHookStatus('Hook 已安装')
      } catch (e: any) {
        setHookStatus(`安装失败: ${String(e)}`)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-8">
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Agent 来源</h2>
        <div className="space-y-5">
          <Toggle checked={enableOpenClaw} onChange={toggleOpenClaw} label="OpenClaw" desc="连接 OpenClaw Gateway 获取 agent 状态" />
          <Toggle checked={enableClaudeCode} onChange={toggleClaudeCode} label="Claude Code" desc="通过 Hook 监听本地 Claude Code 会话" />
          {hookStatus && <div className="text-sm text-gray-500 ml-16">{hookStatus}</div>}
        </div>
      </section>

      <hr className="border-gray-200 mb-10" />

      {enableOpenClaw && (
        <>
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">OpenClaw Gateway</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">Gateway URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 block p-2.5 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">Token</label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 block p-2.5 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={testConnection} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-1.5 px-3 rounded transition-colors">
                  测试连接
                </button>
                <button onClick={saveSettings} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-1.5 px-3 rounded transition-colors">
                  保存
                </button>
              </div>
              {testResult && <div className="text-sm mt-2">{testResult}</div>}
            </div>
          </section>
          <hr className="border-gray-200 mb-10" />
        </>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">显示设置</h2>
        <div className="space-y-6">
          <Toggle checked={showWorkDetail} onChange={onToggleWorkDetail} label="显示工作详情" desc="工作中时在 pet 上显示最新动态" />
        </div>
      </section>
    </div>
  )
}
