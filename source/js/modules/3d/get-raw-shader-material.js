const getRawShaderMaterial = (texture, hue) => {
  return {
    uniforms: {
      map: {
        value: texture
      },
      hueShift: {
        value: hue
      }
    },
    vertexShader: `
      uniform mat4 projectionMatrix;
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;

      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      }`,

    fragmentShader: `
      precision mediump float;
      uniform sampler2D map;

      varying vec2 vUv;

      uniform float hueShift;

      vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void main() {
        vec4 texel = texture2D(map, vUv);
        if (hueShift != 0.0) {
          vec3 fragRGB = texel.rgb;
          vec3 fragHSV = rgb2hsv(fragRGB).xyz;

          fragHSV.x += hueShift / 360.0;

          if (fragHSV.x > 1.0) {
            fragHSV.x -= 1.0;
          }
          if (fragHSV.x < 0.0) {
            fragHSV.x += 1.0;
          }

          fragRGB = hsv2rgb(fragHSV);
            gl_FragColor = vec4(fragRGB, 1);
          }
        else {
          gl_FragColor = texel;
        }
      }
    `
  }
};

export {getRawShaderMaterial};
