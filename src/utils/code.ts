import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-markdown'
import type { KeyboardEvent } from 'react'
import type { NoteType } from '../types'

// Nombre del lenguaje en Prism para cada tipo de nota
const PRISM_LANGUAGES: Record<NoteType, string | null> = {
  text: null,
  checklist: null,
  bash: 'bash',
  python: 'python',
  html: 'markup',
  css: 'css',
  javascript: 'javascript',
  typescript: 'typescript',
  json: 'json',
  sql: 'sql',
  markdown: 'markdown',
}

// Palabras de control de flujo: VS Code las pinta en morado y el resto de palabras clave en azul
const CONTROL_KEYWORDS = new Set([
  'if', 'elif', 'else', 'for', 'while', 'do', 'return', 'break', 'continue', 'pass', 'raise', 'throw',
  'try', 'except', 'catch', 'finally', 'with', 'yield', 'await', 'import', 'from', 'as', 'export',
  'default', 'switch', 'case', 'in', 'then', 'fi', 'done', 'esac',
])

// Colores de corchetes por nivel, como el "bracket pair colorization" de VS Code
let bracketDepth = 0

Prism.hooks.add('wrap', (env) => {
  // Prism trata print como palabra clave (Python 2); en VS Code es una función
  if (env.language === 'python' && env.type === 'keyword' && env.content === 'print') {
    env.classes = env.classes.map((name) => (name === 'keyword' ? 'builtin' : name))
    return
  }
  if (env.type === 'keyword' && CONTROL_KEYWORDS.has(env.content)) env.classes.push('control')

  if (env.type === 'punctuation' && env.content.length === 1) {
    if ('([{'.includes(env.content)) {
      env.classes.push(`bracket-${bracketDepth % 3}`)
      bracketDepth++
    } else if (')]}'.includes(env.content)) {
      bracketDepth = Math.max(0, bracketDepth - 1)
      env.classes.push(`bracket-${bracketDepth % 3}`)
    }
  }
})

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// HTML con colores; Prism escapa el texto, así que es seguro mostrarlo
export function highlightCode(code: string, type: NoteType) {
  const language = PRISM_LANGUAGES[type]
  const grammar = language ? Prism.languages[language] : undefined
  bracketDepth = 0
  return grammar ? Prism.highlight(code, grammar, language!) : escapeHtml(code)
}

// Comentarios de cada lenguaje: de línea (#, //, --) o de bloque (/* */, <!-- -->)
const COMMENT_SYNTAX: Record<NoteType, { line?: string; block?: [string, string] }> = {
  text: {},
  checklist: {},
  bash: { line: '#' },
  python: { line: '#' },
  html: { block: ['<!--', '-->'] },
  css: { block: ['/*', '*/'] },
  javascript: { line: '//' },
  typescript: { line: '//' },
  json: { line: '//' },
  sql: { line: '--' },
  markdown: { block: ['<!--', '-->'] },
}

// Espacios por nivel: 4 en Python (como VS Code y PEP 8), 2 en el resto
export function getIndentUnit(type: NoteType) {
  return type === 'python' ? '    ' : '  '
}

export interface CodeEdit {
  // Rango del texto original que se reemplaza
  start: number
  end: number
  text: string
  // Selección que queda después del cambio
  selectionStart: number
  selectionEnd: number
}

// Líneas completas que toca la selección
function getLineRange(content: string, selectionStart: number, selectionEnd: number) {
  const start = content.lastIndexOf('\n', selectionStart - 1) + 1
  // Si la selección acaba justo al principio de una línea, esa línea no cuenta (como en VS Code)
  const lastChar = selectionEnd > selectionStart && content[selectionEnd - 1] === '\n' ? selectionEnd - 1 : selectionEnd
  const nextBreak = content.indexOf('\n', lastChar)
  const end = nextBreak === -1 ? content.length : nextBreak
  return { start, end }
}

const getIndent = (line: string) => line.match(/^\s*/)![0]

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Ctrl + /: comenta o descomenta las líneas seleccionadas
export function toggleComment(content: string, selectionStart: number, selectionEnd: number, type: NoteType): CodeEdit | null {
  const syntax = COMMENT_SYNTAX[type]
  const { start, end } = getLineRange(content, selectionStart, selectionEnd)
  const original = content.slice(start, end)
  let text: string

  if (syntax.line) {
    const token = syntax.line
    const lines = original.split('\n')
    const codeLines = lines.filter((line) => line.trim())
    if (codeLines.length === 0) return null

    const isCommented = codeLines.every((line) => line.trimStart().startsWith(token))
    if (isCommented) {
      const pattern = new RegExp(`^(\\s*)${escapeRegExp(token)} ?`)
      text = lines.map((line) => line.replace(pattern, '$1')).join('\n')
    } else {
      // El comentario va a la altura de la línea menos indentada
      const indent = Math.min(...codeLines.map((line) => getIndent(line).length))
      text = lines
        .map((line) => (line.trim() ? `${line.slice(0, indent)}${token} ${line.slice(indent)}` : line))
        .join('\n')
    }
  } else if (syntax.block) {
    const [open, close] = syntax.block
    const indent = getIndent(original)
    const body = original.slice(indent.length)
    if (!body.trim()) return null

    const trimmed = body.trimEnd()
    if (trimmed.startsWith(open) && trimmed.endsWith(close)) {
      text = indent + trimmed.slice(open.length, trimmed.length - close.length).replace(/^ /, '').replace(/ $/, '')
    } else {
      text = `${indent}${open} ${trimmed} ${close}`
    }
  } else {
    return null
  }

  // Sin selección, el cursor se mueve con el texto de su línea; con selección, quedan seleccionadas las líneas
  if (selectionStart === selectionEnd) {
    const firstLineDelta = text.split('\n')[0].length - original.split('\n')[0].length
    const caret = Math.max(start, selectionStart + firstLineDelta)
    return { start, end, text, selectionStart: caret, selectionEnd: caret }
  }
  return { start, end, text, selectionStart: start, selectionEnd: start + text.length }
}

// Tab / Shift + Tab: con varias líneas seleccionadas, indenta o quita la indentación de todas
export function indentLines(content: string, selectionStart: number, selectionEnd: number, outdent: boolean, type: NoteType): CodeEdit {
  const unit = getIndentUnit(type)
  const isMultiline = content.slice(selectionStart, selectionEnd).includes('\n')

  // Tab sin selección de varias líneas: inserta la indentación donde está el cursor
  if (!outdent && !isMultiline) {
    const caret = selectionStart + unit.length
    return { start: selectionStart, end: selectionEnd, text: unit, selectionStart: caret, selectionEnd: caret }
  }

  const { start, end } = getLineRange(content, selectionStart, selectionEnd)
  const lines = content.slice(start, end).split('\n')
  const outdentPattern = new RegExp(`^( {1,${unit.length}}|\\t)`)
  const changed = lines.map((line) => (outdent ? line.replace(outdentPattern, '') : unit + line))
  const text = changed.join('\n')
  const firstLineDelta = changed[0].length - lines[0].length

  return {
    start,
    end,
    text,
    selectionStart: Math.max(start, selectionStart + firstLineDelta),
    selectionEnd: Math.max(start, selectionEnd + text.length - (end - start)),
  }
}

const PAIRS: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
const CLOSERS = new Set(Object.values(PAIRS))

// Enter: mantiene la indentación y la aumenta tras ":", "{", "(" o "[".
// Entre un par vacío como {} el cierre baja a su propia línea, como en VS Code
export function newLineWithIndent(content: string, selectionStart: number, selectionEnd: number, type: NoteType): CodeEdit {
  const unit = getIndentUnit(type)
  const lineStart = content.lastIndexOf('\n', selectionStart - 1) + 1
  const before = content.slice(lineStart, selectionStart)
  const indent = getIndent(before)
  const opensBlock = /[:{([]\s*$/.test(before)
  const charBefore = before.trimEnd().slice(-1)
  const isBetweenPair = charBefore in PAIRS && PAIRS[charBefore] === content[selectionEnd] && '([{'.includes(charBefore)

  if (isBetweenPair) {
    const text = `\n${indent}${unit}\n${indent}`
    const caret = selectionStart + 1 + indent.length + unit.length
    return { start: selectionStart, end: selectionEnd, text, selectionStart: caret, selectionEnd: caret }
  }

  const text = `\n${indent}${opensBlock ? unit : ''}`
  const caret = selectionStart + text.length
  return { start: selectionStart, end: selectionEnd, text, selectionStart: caret, selectionEnd: caret }
}

// Cierre automático de paréntesis, corchetes, llaves y comillas.
// Devuelve null si la tecla debe comportarse normal; "skip" si solo hay que saltar el cierre
export function autoClose(content: string, selectionStart: number, selectionEnd: number, key: string): CodeEdit | 'skip' | null {
  const next = content[selectionEnd] ?? ''
  const prev = content[selectionStart - 1] ?? ''
  const hasSelection = selectionStart !== selectionEnd

  // Escribir el cierre que ya está justo delante: el cursor pasa por encima
  if (!hasSelection && CLOSERS.has(key) && next === key) return 'skip'

  if (!(key in PAIRS)) return null
  const close = PAIRS[key]
  const isQuote = key === close

  // Con texto seleccionado, lo envuelve: (texto)
  if (hasSelection) {
    const selected = content.slice(selectionStart, selectionEnd)
    return {
      start: selectionStart,
      end: selectionEnd,
      text: key + selected + close,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionEnd + 1,
    }
  }

  // Solo se cierra si después no hay una palabra pegada; las comillas, tampoco tras una letra (don't)
  if (next && !/\s/.test(next) && !CLOSERS.has(next)) return null
  if (isQuote && /\w/.test(prev)) return null

  return { start: selectionStart, end: selectionEnd, text: key + close, selectionStart: selectionStart + 1, selectionEnd: selectionStart + 1 }
}

// Retroceso entre un par vacío, como () o "": borra los dos
export function deletePair(content: string, selectionStart: number, selectionEnd: number): CodeEdit | null {
  if (selectionStart !== selectionEnd || selectionStart === 0) return null
  const prev = content[selectionStart - 1]
  if (!(prev in PAIRS) || PAIRS[prev] !== content[selectionStart]) return null
  return { start: selectionStart - 1, end: selectionStart + 1, text: '', selectionStart: selectionStart - 1, selectionEnd: selectionStart - 1 }
}

// Aplica un cambio como si se hubiera escrito, para que Ctrl + Z lo pueda deshacer
export function applyEdit(textarea: HTMLTextAreaElement, edit: CodeEdit, onChange: (value: string) => void) {
  textarea.focus()
  textarea.setSelectionRange(edit.start, edit.end)
  const applied = edit.text
    ? document.execCommand('insertText', false, edit.text)
    : document.execCommand('delete')

  if (!applied) {
    // Navegadores sin execCommand: se cambia el valor directamente (sin deshacer)
    const value = textarea.value
    onChange(value.slice(0, edit.start) + edit.text + value.slice(edit.end))
    requestAnimationFrame(() => textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd))
    return
  }
  textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd)
}

// Es Ctrl + / (o Cmd + / en Mac); en teclado español "/" es Shift + 7
export function isCommentShortcut(event: KeyboardEvent) {
  return (event.ctrlKey || event.metaKey) && (event.key === '/' || event.code === 'Slash' || event.code === 'NumpadDivide')
}

// Línea y columna del cursor (empezando en 1), para la barra de estado
export function getCursorPosition(content: string, caret: number) {
  const before = content.slice(0, caret)
  const line = before.split('\n').length
  const column = caret - (before.lastIndexOf('\n') + 1) + 1
  return { line, column }
}
