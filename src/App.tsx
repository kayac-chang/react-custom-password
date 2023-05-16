import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";

const Eye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

function secret(email: string) {
  const [head, tail] = email.split("@");
  if (!tail) return email;
  const half = Math.ceil(head.length / 2);
  return `${head.slice(0, half).padEnd(head.length, "*")}@${tail}`;
}

type State = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};
function reducer(state: State, action: ChangeEvent<HTMLInputElement>) {
  const event = action.nativeEvent as InputEvent;
  const index = action.target.selectionStart;

  if (event.inputType === "insertText" && event.data && index !== null) {
    return {
      ...state,
      value:
        state.value.slice(0, index) + event.data + state.value.slice(index),
      selectionStart: action.target.selectionStart ?? 0,
      selectionEnd: action.target.selectionEnd ?? 0,
    };
  }
  if (event.inputType === "deleteContentBackward" && index !== null) {
    return {
      ...state,
      value: state.value.slice(0, index) + state.value.slice(index + 1),
      selectionStart: action.target.selectionStart ?? 0,
      selectionEnd: action.target.selectionEnd ?? 0,
    };
  }
  if (event.inputType === "insertFromPaste") {
    return {
      ...state,
      value: event.data ?? state.value,
    };
  }
  return state;
}

function App() {
  const [show, setShow] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    value: "",
    selectionStart: 0,
    selectionEnd: 0,
  });
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.setSelectionRange(state.selectionStart, state.selectionEnd);
  });

  return (
    <label className="w-72 relative text-black flex items-center">
      <input
        type="text"
        className="rounded-lg w-full"
        ref={ref}
        value={show ? state.value : secret(state.value)}
        onChange={dispatch}
      />
      <button
        className="absolute right-0 w-5 mx-2"
        onClick={() => setShow(!show)}
      >
        {show ? <Eye /> : <EyeSlash />}
      </button>
    </label>
  );
}

export default App;
