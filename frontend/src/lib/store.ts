import { invoke } from '@tauri-apps/api/core'
import { emit } from '@tauri-apps/api/event'
import { load } from '@tauri-apps/plugin-store'
import type { CharacterMeta } from './types'

export async function getStore() {
  return load('settings.json', { defaults: {}, autoSave: true })
}

export const DEFAULT_KELI: CharacterMeta = {
  name: 'keli',
  workGifs: [],
  restGifs: [],
  miniActions: {
    top: [
      '/assets/keli/mini/top/sleep.gif',
      '/assets/keli/mini/top/work.gif',
    ],
  },
}

export const MINI_CATEGORIES = ['top', 'walk', 'fish', 'sport']

export async function loadCharacters(): Promise<CharacterMeta[]> {
  const store = await getStore()

  let scanned: CharacterMeta[] = []
  try {
    scanned = (await invoke('scan_characters')) as CharacterMeta[]
  } catch (e) {
    console.warn('[loadCharacters] scan_characters failed:', e)
  }

  const scannedKeli = scanned.find((sc) => sc.name === 'keli')
  const merged: CharacterMeta[] = [scannedKeli ? { ...DEFAULT_KELI, ...scannedKeli } : DEFAULT_KELI]
  for (const sc of scanned) {
    if (sc.name === 'keli') continue
    merged.push(sc)
  }

  await store.set('characters', merged)
  await store.save()

  return merged
}

export async function saveCharacters(chars: CharacterMeta[]) {
  const store = await getStore()
  await store.set('characters', chars)
  await store.save()
  await emit('character-changed')
}

export async function getActiveCharacter(): Promise<string> {
  const store = await getStore()
  return ((await store.get('active_character')) as string) || 'keli'
}

export async function setActiveCharacter(name: string) {
  const store = await getStore()
  await store.set('active_character', name)
  await store.save()
  await emit('character-changed')
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

