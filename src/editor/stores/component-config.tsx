import { create } from "zustand";
import ContainerDev from "../materials/Container/dev";
import ContainerProd from "../materials/Container/prod";
import ButtonDev from "../materials/Button/dev";
import ButtonProd from "../materials/Button/prod";
import PageDev from "../materials/Page/dev";
import PageProd from "../materials/Page/prod";
import TextDev from "../materials/Text/dev";
import TextProd from "../materials/Text/prod";
import InputDev from "../materials/Input/dev";
import InputProd from "../materials/Input/prod";
import ImageDev from "../materials/Image/dev";
import ImageProd from "../materials/Image/prod";
import TitleDev from "../materials/Title/dev";
import TitleProd from "../materials/Title/prod";
import CardDev from "../materials/Card/dev";
import CardProd from "../materials/Card/prod";

export interface ComponentSetter {
    name: string;
    label: string;
    type: string;
    [key: string]: any;
}

export interface ComponentConfig {
    name: string;
    defaultProps: Record<string, any>;
    // component: any;
    desc: string;
    /** 是否允许包含子节点（容器型组件） */
    allowChildren?: boolean;
    setter?: ComponentSetter[];
    stylesSetter?: ComponentSetter[];
    dev: any, // 开发模式下的组件
    prod: any, // 预览模式下的组件
}

export interface State {
    componentConfig: { [key: string]: ComponentConfig }
}

export interface Action {
    registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

// 每一个名字对应的组件具体是哪一个
export const useComponentConfigStore = create<State & Action>(
    (set) => ({
        componentConfig: {
            Container: {
                name: 'Container',
                defaultProps: {},
                desc: '容器',
                dev: ContainerDev,
                prod: ContainerProd,
                allowChildren: true,
            },
            Button: {
                name: 'Button',
                defaultProps: {
                    type: 'primary',
                    text: '按钮'
                },
                desc: '按钮',
                dev: ButtonDev,
                prod: ButtonProd,
                setter: [
                    {
                        name: 'type',
                        label: '按钮类型',
                        type: 'select',
                        options: [
                            {
                                label: '主要按钮',
                                value: 'primary'
                            },
                            {
                                label: '次要按钮',
                                value: 'default'
                            }
                        ]
                    },
                    {
                        name: 'text',
                        label: '文本',
                        type: 'input'
                    }
                ],
                stylesSetter: [
                    {
                        name: 'width',
                        label: '宽度',
                        type: 'inputNumber'
                    },
                    {
                        name: 'height',
                        label: '高度',
                        type: 'inputNumber'
                    }
                ]
            },
            Page: {
                name: 'Page',
                defaultProps: {},
                desc: '页面',
                dev: PageDev,
                prod: PageProd,
                allowChildren: true,
            },
            Text: {
                name: 'Text',
                defaultProps: {
                    text: '文本内容'
                },
                desc: '文本',
                dev: TextDev,
                prod: TextProd,
                setter: [
                    {
                        name: 'text',
                        label: '文本内容',
                        type: 'input'
                    }
                ],
                stylesSetter: [
                    {
                        name: 'fontSize',
                        label: '字体大小',
                        type: 'inputNumber'
                    },
                    {
                        name: 'color',
                        label: '字体颜色',
                        type: 'input'
                    },
                    {
                        name: 'fontWeight',
                        label: '字体粗细',
                        type: 'select',
                        options: [
                            { label: '正常', value: 'normal' },
                            { label: '粗体', value: 'bold' }
                        ]
                    }
                ]
            },
            Title: {
                name: 'Title',
                defaultProps: {
                    level: 1,
                    text: '标题'
                },
                desc: '标题',
                dev: TitleDev,
                prod: TitleProd,
                setter: [
                    {
                        name: 'level',
                        label: '标题级别',
                        type: 'select',
                        options: [
                            { label: 'H1', value: 1 },
                            { label: 'H2', value: 2 },
                            { label: 'H3', value: 3 },
                            { label: 'H4', value: 4 },
                            { label: 'H5', value: 5 }
                        ]
                    },
                    {
                        name: 'text',
                        label: '标题文本',
                        type: 'input'
                    }
                ],
                stylesSetter: [
                    {
                        name: 'color',
                        label: '字体颜色',
                        type: 'input'
                    },
                    {
                        name: 'textAlign',
                        label: '对齐方式',
                        type: 'select',
                        options: [
                            { label: '左对齐', value: 'left' },
                            { label: '居中', value: 'center' },
                            { label: '右对齐', value: 'right' }
                        ]
                    }
                ]
            },
            Input: {
                name: 'Input',
                defaultProps: {
                    placeholder: '请输入内容',
                    value: ''
                },
                desc: '输入框',
                dev: InputDev,
                prod: InputProd,
                setter: [
                    {
                        name: 'placeholder',
                        label: '占位符',
                        type: 'input'
                    },
                    {
                        name: 'value',
                        label: '默认值',
                        type: 'input'
                    }
                ],
                stylesSetter: [
                    {
                        name: 'width',
                        label: '宽度',
                        type: 'inputNumber'
                    },
                    {
                        name: 'height',
                        label: '高度',
                        type: 'inputNumber'
                    }
                ]
            },
            Image: {
                name: 'Image',
                defaultProps: {
                    src: 'https://via.placeholder.com/300x200',
                    alt: '图片',
                    width: 200,
                    height: 200
                },
                desc: '图片',
                dev: ImageDev,
                prod: ImageProd,
                setter: [
                    {
                        name: 'src',
                        label: '图片地址',
                        type: 'input'
                    },
                    {
                        name: 'alt',
                        label: '替代文本',
                        type: 'input'
                    },
                    {
                        name: 'width',
                        label: '宽度',
                        type: 'inputNumber'
                    },
                    {
                        name: 'height',
                        label: '高度',
                        type: 'inputNumber'
                    }
                ],
                stylesSetter: [
                    {
                        name: 'borderRadius',
                        label: '圆角',
                        type: 'inputNumber'
                    }
                ]
            },
            Card: {
                name: 'Card',
                defaultProps: {
                    title: '卡片标题'
                },
                desc: '卡片',
                dev: CardDev,
                prod: CardProd,
                allowChildren: true,
                setter: [
                    {
                        name: 'title',
                        label: '卡片标题',
                        type: 'input'
                    }
                ],
                stylesSetter: [
                    {
                        name: 'width',
                        label: '宽度',
                        type: 'inputNumber'
                    },
                    {
                        name: 'minHeight',
                        label: '最小高度',
                        type: 'inputNumber'
                    }
                ]
            }
        },

        registerComponent: (name, componentConfig) => {
            set((state) => {
                return {
                    ...state,
                    componentConfig: {
                        ...state.componentConfig,
                        [name]: componentConfig
                    }
                }
            })
        }
    })
)

