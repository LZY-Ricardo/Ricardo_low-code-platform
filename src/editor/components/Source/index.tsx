import MonacoEditor from '@monaco-editor/react'
import { useComponentsStore } from '../../stores/components'

export default function Source() {
  const { components } = useComponentsStore()
  return (
    <MonacoEditor
      height={'100%'}
      language="json"
      path='components.json'
      value={JSON.stringify(components, null, 2)}
    />
  )
}
