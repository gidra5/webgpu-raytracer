import { wgsl } from 'wgsl-preprocessor/wgsl-preprocessor.js';

export default wgsl/* wgsl */ `
  const PHI     = 1.61803398874989484820459; // Golden Ratio
  const SRT     = 1.41421356237309504880169; // Square Root of Two
  const PI      = 3.14159265358979323846264;
  const E       = 2.71828182845904523536028;
  const TWO_PI  = 6.28318530717958647692528;
  const INV_PI  = 0.31830988618379067153776;
  
  const BV_MAX_STACK_DEPTH = 16;
  const EPSILON = 0.001;
`;
