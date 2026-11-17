import { useState } from 'react'
import type { KeyboardEvent, RefObject } from 'react'
import type { NoteType } from '../types'
import {
  applyEdit,
  autoClose,
  deletePair,
  getCursorPosition,
  highlightCode,
  indentLines,
  isCommentShortcut,
  newLineWithIndent,
  toggleComment,
} from '../utils/code'
import type { CodeEdit } from '../utils/code'

interface CodeEditorProps {
  value: string
  type: NoteType
  placeholder: string
  onChange: (value: string) => void
  inputRef: RefObject<HTMLTextAreaElement | null>
}

// Debe coincidir con el line-height y el padding de .code-editor en el CSS
const LINE_HEIGHT = 20
const PADDING_TOP = 10

// Editor de código al estilo VS Code: línea actual resaltada, colores y atajos.
// El texto coloreado va debajo y un textarea transparente encima
export default function CodeEditor({ value, type, placeholder, onChange, inputRef }: CodeEditorProps) {
  const [cursor, setCursor] = useState({ line: 1, column: 1 })
  const [isFocused, setIsFocused] = useState(false)

  const updateCursor = () => {
    const textarea = inputRef.current
    if (textarea) setCursor(getCursorPosition(textarea.value, textarea.selectionStart))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return

    const textarea = event.currentTarget
    const { selectionStart, selectionEnd, value: content } = textarea
    const hasModifier = event.ctrlKey || event.metaKey || event.altKey
    let edit: CodeEdit | 'skip' | null = null

    if (isCommentShortcut(event)) {
      edit = toggleComment(content, selectionStart, selectionEnd, type)
      // Ctrl + / nunca debe escribir nada, aunque no haya que comentar
      event.preventDefault()
    } else if (event.key === 'Tab') {
      edit = indentLines(content, selectionStart, selectionEnd, event.shiftKey, type)
    } else if (event.key === 'Enter' && !event.shiftKey && !hasModifier) {
      edit = newLineWithIndent(content, selectionStart, selectionEnd, type)
    } else if (event.key === 'Backspace' && !hasModifier) {
      edit = deletePair(content, selectionStart, selectionEnd)
    } else if (event.key.length === 1 && !hasModifier) {
      edit = autoClose(content, selectionStart, selectionEnd, event.key)
    }

    if (!edit) return
    event.preventDefault()

    if (edit === 'skip') {
      textarea.setSelectionRange(selectionStart + 1, selectionStart + 1)
    } else {
      applyEdit(textarea, edit, onChange)
    }
    updateCursor()
  }

  return (
    <div className="code-editor">
      <div className="code-editor__scroll">
        <div className="code-editor__inner">
          {isFocused && (
            <div
              className="code-editor__active-line"
              style={{ top: PADDING_TOP + (cursor.line - 1) * LINE_HEIGHT }}
            />
          )}
          {/* El salto final evita que la última línea vacía quede sin altura */}
          <pre className={`code-editor__highlight code-tokens lang-${type}`} aria-hidden="true">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(value, type) + '\n' }} />
          </pre>
          <textarea
            ref={inputRef}
            className="code-editor__input"
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={updateCursor}
            onKeyUp={updateCursor}
            onClick={updateCursor}
            onFocus={() => {
              setIsFocused(true)
              updateCursor()
            }}
            onBlur={() => setIsFocused(false)}
            spellCheck={false}
            wrap="off"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>    </div>
  )
}
