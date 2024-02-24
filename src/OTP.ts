
export default class OTP {
  private emptyChar: string
  private _resultRef: any
  private container: HTMLElement
  private updateTo: HTMLInputElement | null = null
  private inputs: HTMLInputElement[]

  constructor(elementOrSelector: string | HTMLElement, updateToInput: string | HTMLInputElement | null = null, resultRef: any | null = null) {
    // set default options
    this.emptyChar = ' '
    this._resultRef = resultRef

    if (typeof elementOrSelector === 'string')
      this.container = document.querySelector(elementOrSelector)!
    else if (elementOrSelector instanceof HTMLElement)
      this.container = elementOrSelector
    else
      throw new Error('Invalid argument for constructor.')

    if (updateToInput) {
      if (typeof updateToInput === 'string')
        this.updateTo = document.querySelector(updateToInput) || null
      else if (updateToInput instanceof HTMLInputElement)
        this.updateTo = updateToInput
      else
        this.updateTo = null
    }

    this.inputs = Array.from(this.container.querySelectorAll<HTMLInputElement>('input[type=text], input[type=number], input[type=password]'))

    const inputCount = this.inputs.length

    for (let i = 0; i < inputCount; i++) {
      const input = this.inputs[i]
      input.addEventListener('input', () => {
        // if not number, restore value
        if (Number.isNaN(Number(input.value))) {
          input.value = input.dataset.otpInputRestore || ''
          return this._updateValue()
        }

        // if a character is removed, do nothing and save
        if (input.value.length === 0)
          return this._saveInputValue(i)

        // if single character, save the value and go to next input (if any)
        if (input.value.length === 1) {
          this._saveInputValue(i)
          this._updateValue()
          if (i + 1 < inputCount)
            this.inputs[i + 1].focus()
          return
        }

        // more multiple character entered (eg. pasted),
        // and it's the last input of the row,
        // truncate to single character and save
        if (i === inputCount - 1)
          return this._setInputValue(i, input.value)

        // otherwise, put each character to each of the next input
        const chars = input.value.split('')

        for (let pos = 0; pos < chars.length; pos++) {
          // if length exceeded the number of inputs, stop
          if (pos + i >= inputCount)
            break

          // paste value and save
          this._setInputValue(pos + i, chars[pos])
        }

        // focus the input next to the last pasted character
        const focus_index = Math.min(inputCount - 1, i + chars.length)
        this.inputs[focus_index].focus()
      })

      input.addEventListener('keydown', (e) => {
        // backspace button
        if (e.key === 'Backspace' && input.value === '' && i !== 0) {
          this._setInputValue(i - 1, '')
          this.inputs[i - 1].focus()
          return
        }

        // delete button
        if (e.key === 'Delete' && i !== inputCount - 1) {
          const selectionStart = input.selectionStart || 0

          for (let pos = i + selectionStart; pos < inputCount - 1; pos++)
            this._setInputValue(pos, this.inputs[pos + 1].value)

          this._setInputValue(inputCount - 1, '')

          // restore caret
          if (input.selectionStart)
            input.selectionStart = selectionStart
          e.preventDefault()
          return
        }

        // left button
        if (e.key === 'ArrowLeft' && (input.selectionStart == null || input.selectionStart === 0)) {
          if (i > 0) {
            e.preventDefault()
            this.inputs[i - 1].focus()
            this.inputs[i - 1].select()
          }
          return
        }

        // right button
        if (e.key === 'ArrowRight' && (input.selectionStart == null || input.selectionEnd === input.value.length)) {
          if (i + 1 < inputCount) {
            e.preventDefault()
            this.inputs[i + 1].focus()
            this.inputs[i + 1].select()
          }
        }
      })
    }
  }

  setEmptyChar(char: string): void {
    this.emptyChar = char
  }

  getValue(): string {
    let value = ''
    this.inputs.forEach((input) => {
      value += (input.value === '') ? this.emptyChar : input.value
    })
    return value
  };

  setValue(value: number): void {
    if (Number.isNaN(value)) {
      console.error('Please enter an integer value.')
      return
    }

    const stringValue = `${value}`
    const chars = stringValue.split('')
    for (let i = 0; i < this.inputs.length; i++)
      this._setInputValue(i, chars[i] || '')
  }

  private _setInputValue(index: number, value: string): void {
    if (Number.isNaN(Number(value)))
      return console.error('Please enter an integer value.')

    if (!this.inputs[index])
      return console.error('Index not found.')

    this.inputs[index].value = String(value).substring(0, 1)
    this._saveInputValue(index)
    this._updateValue()
  }

  private _saveInputValue(index: number, value?: string): void {
    if (!this.inputs[index])
      return console.error('Index not found.')

    this.inputs[index].dataset.otpInputRestore = value || this.inputs[index].value
  }

  private _updateValue(): void {
    const value = this.getValue()
    if (this.updateTo)
      this.updateTo.value = value
    if (this._resultRef)
      this._resultRef.value = value
  };
}
