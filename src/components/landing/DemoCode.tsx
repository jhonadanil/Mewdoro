import { useRef, useState } from 'react'
import CodeEditor from '../CodeEditor'
import { DEMO_CODE } from './demoData'

// El editor de código de las notas, de verdad: se puede escribir, indentar con Tab y comentar con Ctrl + /
export default function DemoCode() {
  const [code, setCode] = useState(DEMO_CODE)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="overflow-hidden rounded-md border bg-(--code-bg)">
      <div className="flex items-center justify-between border-b border-(--code-border) py-1.5 pl-3.5 pr-3.5 text-xs text-(--code-gutter)">
        <span>Python</span>
        <span>Ejemplo editable</span>
      </div>
      <CodeEditor value={code} type="python" placeholder="Escribe tu código Python..." onChange={setCode} inputRef={inputRef} />
    </div>
  )
}
