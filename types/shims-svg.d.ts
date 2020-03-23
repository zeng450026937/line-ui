declare module '*.svg' {
  const SVG: {
    id: string;
    url: string;
    width: number;
    height: number;
    viewBox: string;
  };

  export default SVG;
}
