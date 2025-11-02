import { useComponentsStore } from '../../stores/components'
import React from 'react'
import type { Component } from '../../stores/components'
import ComponentWithEvents from './ComponentWithEvents'

export default function Preview() {
    const { components } = useComponentsStore()

    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component) => {
            return (
                <ComponentWithEvents
                    key={component.id}
                    component={component}
                    renderChildren={renderComponents}
                />
            )
        })
    }

    return (
        <div>
            {renderComponents(components)}
        </div>
    )
}
