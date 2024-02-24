export default class OTP {
    private emptyChar;
    private _resultRef;
    private container;
    private updateTo;
    private inputs;
    constructor(elementOrSelector: string | HTMLElement, updateToInput?: string | HTMLInputElement | null, resultRef?: any | null);
    setEmptyChar(char: string): void;
    getValue(): string;
    setValue(value: number): void;
    private _setInputValue;
    private _saveInputValue;
    private _updateValue;
}
