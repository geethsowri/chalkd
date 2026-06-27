// react-colorful imports
import { RgbaColor } from "react-colorful";

export const getStringFromRgba = (rgba: RgbaColor) =>
  `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
// note: update 17828389076141
