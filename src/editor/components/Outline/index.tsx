import { useComponentsStore } from '../../stores/components'
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';

// 1. Tree 组件展示
// 2. json 在仓库中
export default function Outline() {
    const { components, setCurComponentId } = useComponentsStore((state) => state)

    // const renderTreeNode: (node: Component) => TreeDataNode = (node: Component) => ({
    //     title: node.desc,
    //     key: node.id,
    //     children: node.children?.map(renderTreeNode)
    // })
    // const treeData: TreeDataNode[] = components.map(renderTreeNode)

    return (
        <div>
            <Tree
                defaultExpandAll
                switcherIcon={<DownOutlined />}
                showLine
                fieldNames={{title: 'desc', key: 'id'}}
                treeData={components as any}
                onSelect={([selectedKey], info) => {
                    console.log(selectedKey, info)
                    setCurComponentId(Number(selectedKey))
                }}
            />
        </div>
    )
}
