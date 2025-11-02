import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from './components/Header'
import MaterialWrapper from './components/MaterialWrapper'
import EditArea from './components/EditArea'
import Setting from './components/Setting'
import Preview from "./components/Preview";
import { useComponentsStore } from './stores/components'

export default function LowcodeEditor() {
  const { mode } = useComponentsStore()
  return (
    <div className="h-[100vh] flex flex-col bg-bg-primary">
      <div className="h-[64px] flex items-center border-b border-border-light bg-bg-secondary shadow-soft">
        <Header></Header>
      </div>
      {
        mode === 'edit' ? (
          <Allotment className="flex-1">
            <Allotment.Pane preferredSize={240} maxSize={500} minSize={200} className="bg-bg-secondary border-r border-border-light">
              <MaterialWrapper />
            </Allotment.Pane>
            <Allotment.Pane className="bg-bg-primary">
              <EditArea></EditArea>
            </Allotment.Pane>
            <Allotment.Pane preferredSize={300} maxSize={500} minSize={300} className="bg-bg-secondary border-l border-border-light">
              <Setting></Setting>
            </Allotment.Pane>
          </Allotment>
        ) : (
          <Preview></Preview>
        )
      }

    </div>
  )
}
