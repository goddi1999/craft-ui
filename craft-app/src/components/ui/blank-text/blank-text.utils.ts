export type Token = { lead: string; word: string; trail: string }

// leading and trailing punctuation stay outside the blank: "¿Eres" → "¿" + "Eres"
const PARTS = /^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u

export function tokenize(text: string): Token[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const match = PARTS.exec(raw)
      if (!match || !match[2]) return { lead: '', word: raw, trail: '' }
      return { lead: match[1], word: match[2], trail: match[3] }
    })
}

export function isMatch(value: string, answer: string, matchCase: boolean) {
  const typed = value.trim().normalize('NFC')
  const wanted = answer.normalize('NFC')
  return matchCase ? typed === wanted : typed.toLocaleLowerCase() === wanted.toLocaleLowerCase()
}
