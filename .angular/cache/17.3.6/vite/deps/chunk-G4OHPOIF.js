import { ElementRef } from "./chunk-JUALYBBI.js";

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== "false";
}
function coerceNumberProperty(value, fallbackValue = 0) {
  return _isNumberValue(value) ? Number(value) : fallbackValue;
}
function _isNumberValue(value) {
  return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}
function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}
function coerceElement(elementOrRef) {
  return elementOrRef instanceof ElementRef
    ? elementOrRef.nativeElement
    : elementOrRef;
}

export {
  coerceBooleanProperty,
  coerceNumberProperty,
  coerceArray,
  coerceElement,
};
//# sourceMappingURL=chunk-G4OHPOIF.js.map
