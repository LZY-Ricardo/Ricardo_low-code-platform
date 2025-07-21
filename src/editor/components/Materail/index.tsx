import { useMemo } from 'react'
import { useComponentConfigStore } from '../../stores/component-config'
import MaterialItem from '../MaterialItem'
import { useComponentsStore } from '../../stores/components'

export default function Materail() {
  const { componentConfig } = useComponentConfigStore()
  const components = useMemo(() => {
    return Object.values(componentConfig).filter(item => item.name !== 'Page')  // [{xx}, {xx}, {xx}]
  }, [componentConfig])

  const { components: componentsStore } = useComponentsStore()

  return (
    <div>
      {
        components.map((item, index) => {
          return <MaterialItem key={item.name + index} name={item.name} />
        })
      }
    </div>
  )
}
