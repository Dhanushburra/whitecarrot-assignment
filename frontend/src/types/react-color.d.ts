declare module 'react-color' {
  import { Component } from 'react';

  export interface ColorResult {
    hex: string;
    rgb: {
      r: number;
      g: number;
      b: number;
      a?: number;
    };
    hsl: {
      h: number;
      s: number;
      l: number;
      a?: number;
    };
  }

  export interface ChromePickerProps {
    color?: string | ColorResult;
    onChange?: (color: ColorResult) => void;
    onChangeComplete?: (color: ColorResult) => void;
    disableAlpha?: boolean;
    width?: string | number;
    styles?: Record<string, any>;
    className?: string;
  }

  export class ChromePicker extends Component<ChromePickerProps> {}
}

