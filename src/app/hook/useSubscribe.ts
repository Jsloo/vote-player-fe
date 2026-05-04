import { useEffect, useRef } from 'react'
import type { SseCallback } from '@/providers/EventProvider'
import { useEvent } from '@/providers/EventProvider'

/**
 * Opens / reuses `EventSource` on `SSE_CONNECT` when this is the first subscriber (lucky-draw pattern).
 * Prefer a **stable** `eventTypes` array reference; content changes are keyed by `typesKey` for resubscribe.
 */
export function useSubscribe(cb: SseCallback, eventTypes?: string[]) {
  const { subscribe } = useEvent()
  const cbRef = useRef(cb)
  const typesRef = useRef(eventTypes)
  const typesKey = eventTypes?.join('\0') ?? ''

  useEffect(() => {
    cbRef.current = cb
    typesRef.current = eventTypes
  }, [cb, eventTypes])

  useEffect(() => {
    return subscribe((p) => {
      cbRef.current(p)
    }, typesRef.current)
  }, [subscribe, typesKey])
}
