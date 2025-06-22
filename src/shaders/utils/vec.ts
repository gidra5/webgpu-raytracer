import { wgsl } from 'wgsl-preprocessor/wgsl-preprocessor.js';

export default wgsl/* wgsl */ `
  @must_use
  fn nearZero(v: vec3f) -> bool {
    let epsilon = vec3f(EPSILON);
    return any(abs(v) < epsilon);
  }
`;
