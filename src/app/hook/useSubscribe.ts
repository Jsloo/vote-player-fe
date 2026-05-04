import { useEffect } from 'react'
import type { SseCallback } from '@/providers/EventProvider'
import { useEvent } from '@/providers/EventProvider'

/**
 * Opens / reuses `EventSource` on {@link SSE_CONNECT} when this is the first subscriber (lucky-draw pattern).
 * Pass a **stable** `eventTypes` reference (e.g. module-level array) to avoid reconnect churn.
 */
export function useSubscribe(cb: SseCallback, eventTypes?: string[]) {
  const { subscribe } = useEvent()

  const typesKey = eventTypes?.join('\0') ?? ''

  useEffect(() => {
    return subscribe(cb, eventTypes)
  }, [subscribe, cb, typesKey])
}
