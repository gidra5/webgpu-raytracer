import { wgsl } from 'wgsl-preprocessor/wgsl-preprocessor.js';

const phi = (d: number) => {
  const k = 1 / (d + 1);
  let x = (d + 2) * k;
  for (let i = 0; i < 10; i++) x = Math.pow(1 + x, k);
  return x;
};
const alpha = (d: number) => {
  const g = phi(d);
  const a = Array.from({ length: d }, (_, i) => 0);
  for (let i = 0; i < d; i++) a[i] = Math.pow(1 / g, i + 1);
  return a;
};

const randUtils = (outCount: number) => {
  return `
    @must_use
    fn random_${outCount}u() -> vec${outCount}<u32> {
      return vec${outCount}(${Array.from({ length: outCount }, () => `random_1u()`).join(', ')});
    }

    @must_use
    fn random_${outCount}() -> vec${outCount}<f32> {
      return vec${outCount}(${Array.from({ length: outCount }, () => `random_1()`).join(', ')});
    }
  `;
};

export default wgsl/* wgsl */ `  
  var<private> rng_state: u32 = 0;
  @must_use
  fn random_1u() -> u32 {
    rng_state = rng_state * 277803737u;
    return rng_state;
  }
  
  @must_use
  fn random_1() -> f32 {
    return f32(random_1u()) / f32(0xffffffffu);
  }

  ${randUtils(2)}

  ${randUtils(3)}
  
  ${randUtils(4)}
  
  fn cbrt(x: f32) -> f32 {
    var y = sign(x) * bitcast<f32>( bitcast<u32>( abs(x) ) / 3u + 0x2a514067u );

    for (var i = 0; i < 2; i = i + 1) { 
      y = (2. * y + x / (y * y)) * .333333333; 
    }

    for (var i = 0; i < 1; i = i + 1)
    {
      let y3 = y * y * y;
      y *= (y3 + 2. * x) / (2. * y3 + x);
    }
    
    return y;
  }

  fn sample_circle(t: f32) -> vec2f {
    let phi = t * TWO_PI;
    return vec2(cos(phi), sin(phi));
  }

  fn sample_incircle(t: vec2f) -> vec2f {
    return sample_circle(t.x) * sqrt(t.y);
  }

  fn sample_cosine_weighted_sphere(t: vec2f) -> vec3f {
    let phi = TWO_PI * t.y;
    let sin_theta = sqrt(1. - t.x);
    let x = sin_theta * cos(phi);
    let y = sin_theta * sin(phi);
    let z = sqrt(t.x);
    return vec3(x, y, z); 
  }

  fn sample_sphere(t: vec2f) -> vec3f {
    let uv = vec2(t.x * 2. - 1., t.y);
    let sin_theta = sqrt(1 - uv.x * uv.x); 
    let phi = TWO_PI * uv.y; 
    let x = sin_theta * cos(phi); 
    let z = sin_theta * sin(phi); 
    return vec3(x, uv.x, z);
  }
  
  fn sample_insphere(t: vec3f) -> vec3f {
    return sample_sphere(t.xy) * cbrt(t.z); 
  }

  fn sample_insquare(t: vec2f) -> vec2f {
    return (2. * t - 1.); 
  }
`;
