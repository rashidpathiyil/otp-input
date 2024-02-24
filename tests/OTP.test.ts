import { describe, it, expect } from 'vitest';
import OTP from '../src/OTP';

describe('OTP', () => {
  it('should correctly instantiate with default values', () => {
    const element = document.createElement('div');
    element.innerHTML = `<input type="text" /><input type="text" />`;
    document.body.appendChild(element);

    const otp = new OTP(element);

    expect(otp).toBeInstanceOf(OTP);
    expect(otp.getValue()).toBe('  '); // Assuming default emptyChar is ' '
  });
  
// Testing getValue Method
  it('should return the correct value from inputs', () => {
  const element = document.createElement('div');
  // Assuming your OTP component creates or uses 4 input elements
  element.innerHTML = `<input type="text" value="1" /><input type="text" value="2" /><input type="text" value="3" /><input type="text" value="4" />`;
  document.body.appendChild(element);

  const otp = new OTP(element);
  expect(otp.getValue()).toBe('1234');
});

// Testing setValue Method
it('should set the value of inputs correctly', () => {
  const element = document.createElement('div');
  element.innerHTML = `<input type="text" /><input type="text" /><input type="text" /><input type="text" />`;
  document.body.appendChild(element);

  const otp = new OTP(element);
  otp.setValue('5678');
  expect(otp.getValue()).toBe('5678');
});

// Testing Input Focus Shift
it('should shift focus to the next input after a character is entered', async () => {
  const element = document.createElement('div');
  element.innerHTML = `<input type="text" /><input type="text" /><input type="text" /><input type="text" />`;
  document.body.appendChild(element);

  const otp = new OTP(element);
  const firstInput = element.querySelector('input');
  const secondInput = element.querySelectorAll('input')[1];

  // Simulate entering a character in the first input
  firstInput.value = '1';
  firstInput.dispatchEvent(new Event('input'));

  // You might need to wait for any asynchronous focus changes
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(document.activeElement).toBe(secondInput);
});

// Testing Backspace Behavior
it('should clear the current input and focus the previous one on backspace', async () => {
  const element = document.createElement('div');
  element.innerHTML = `<input type="text" value="1" /><input type="text" value="2" /><input type="text" value="3" /><input type="text" value="4" />`;
  document.body.appendChild(element);

  const otp = new OTP(element);
  const inputs = element.querySelectorAll('input');
  const firstInput = inputs[0];
  const secondInput = inputs[1];

  // Focus on the second input and make sure it's empty to simulate backspace correctly
  secondInput.value = ''; // Simulate the input being cleared before backspace
  secondInput.focus();

  // Simulate backspace keydown event on the second input
  const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
  secondInput.dispatchEvent(backspaceEvent);

  // Wait for any asynchronous focus changes
  await new Promise(resolve => setTimeout(resolve, 0));

  expect(document.activeElement).toBe(firstInput);
  expect(firstInput.value).toBe(''); // Assuming backspace clears the value
});

});
