/** Full-screen quad; the fragment shader does all the work. */
export const VERTEX_SHADER = `
attribute vec2 aPos;
attribute vec2 aTex;
varying   vec2 vUv;
void main(){
    vUv = aTex;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`

/**
 * Relights a flat product photo using a greyscale depth map: the depth
 * gradient gives surface normals, a short ray march toward the cursor gives
 * contact shadows, and a radial falloff adds the spotlight itself.
 */
export const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2  uMouse;
uniform vec2  uRes;
uniform float uLightH;
uniform float uStrength;
uniform float uSoft;
uniform float uMinBri;
uniform float uNorm;
uniform float uPara;
uniform float uAO;
uniform float uHover;
uniform float uSpotR;
uniform float uSpotFloor;
uniform float uShadLen;
uniform float uBoost;
uniform float uHighlight;
uniform float uSpotFalloff;
uniform vec3  uSpotColor;
uniform vec2  uUvScale;
uniform vec2  uUvOffset;

varying vec2 vUv;

vec2 coverUv(vec2 uv){
    return uv * uUvScale + uUvOffset;
}

vec3 getNormal(vec2 uv, vec2 tx){
    float l = texture2D(uDepth, coverUv(uv - vec2(tx.x,0.0))).r;
    float r = texture2D(uDepth, coverUv(uv + vec2(tx.x,0.0))).r;
    float u = texture2D(uDepth, coverUv(uv + vec2(0.0,tx.y))).r;
    float d = texture2D(uDepth, coverUv(uv - vec2(0.0,tx.y))).r;
    return normalize(vec3((l-r)*uNorm, (d-u)*uNorm, 1.0));
}

float traceShadow(vec2 uv, float depth, vec2 lp, float lH, float soft, float sLen){
    vec3 orig   = vec3(uv, depth);
    vec3 target = vec3(lp, lH);
    vec3 ray    = (target - orig) * sLen;
    float penumbra = 1e5;
    const int S = 24;
    for(int i=2; i<=S; i++){
        float t   = float(i)/float(S);
        vec3  pos = orig + ray * t;
        if(pos.x<0.0||pos.x>1.0||pos.y<0.0||pos.y>1.0) break;
        float sd   = texture2D(uDepth, coverUv(pos.xy)).r;
        float diff = sd - pos.z;
        if(diff > 0.008){
            penumbra = min(penumbra, soft * float(i) / diff);
        }
    }
    return clamp(penumbra, 0.0, 1.0);
}

float calcAO(vec2 uv, vec2 tx){
    float c = texture2D(uDepth, coverUv(uv)).r;
    float s = 0.0;
    for(int i=0; i<8; i++){
        float a = float(i) * 0.7854;
        vec2  o = vec2(cos(a), sin(a)) * tx * 3.0;
        s += max(c - texture2D(uDepth, coverUv(uv+o)).r, 0.0);
    }
    return clamp(1.0 - s * uAO * 12.0 / 8.0, 0.0, 1.0);
}

void main(){
    vec2  tx    = 1.0 / uRes;
    float depth = texture2D(uDepth, coverUv(vUv)).r;

    vec2  pOff = (uMouse - vUv) * depth * uPara * uHover;
    vec2  uv   = clamp(vUv + pOff, vec2(0.0), vec2(1.0));

    vec4  col = texture2D(uImage, coverUv(uv));
    float d   = texture2D(uDepth, coverUv(uv)).r;
    vec3  N   = getNormal(uv, tx);
    float ao  = calcAO(uv, tx);

    vec3  L     = normalize(vec3(uMouse, uLightH) - vec3(uv, d));
    float NdotL = max(dot(N,L), 0.0);
    float dist  = length(vec3(uMouse, uLightH) - vec3(uv, d));
    float atten = 1.0 / (1.0 + dist*dist*1.5);
    float shad  = traceShadow(uv, d, uMouse, uLightH, uSoft, uShadLen);
    float light = NdotL * atten * shad * ao;
    float factor= mix(uMinBri, 1.0, light);
    factor = mix(1.0, factor, uStrength);
    factor = min(factor, 1.0);

    float aspect  = uRes.x / uRes.y;
    float sDist   = length((uMouse - uv) * vec2(aspect, 1.0));
    float spot    = exp(-sDist * sDist / (uSpotR * uSpotR));

    vec2 cp = clamp(uMouse, vec2(0.001), vec2(0.999));
    float ld = texture2D(uDepth, coverUv(cp)).r;
    float behind = max(ld - d, 0.0);
    spot *= mix(1.0, 1.0 - smoothstep(0.0, 0.25, behind), 0.8);
    spot = pow(spot, uSpotFalloff);

    float spotMul = mix(uSpotFloor, uHighlight, spot);
    vec3  boostRGB = uSpotColor * spot * light * uBoost;

    float finalBri = mix(1.0, max(factor * spotMul, uSpotFloor), uHover);
    col.rgb = col.rgb * finalBri + col.rgb * boostRGB * uHover;
    gl_FragColor = col;
}`

export const UNIFORM_NAMES = [
  'uImage',
  'uDepth',
  'uMouse',
  'uRes',
  'uLightH',
  'uStrength',
  'uSoft',
  'uMinBri',
  'uNorm',
  'uPara',
  'uAO',
  'uHover',
  'uSpotR',
  'uSpotFloor',
  'uShadLen',
  'uBoost',
  'uHighlight',
  'uSpotFalloff',
  'uSpotColor',
  'uUvScale',
  'uUvOffset',
] as const

export type UniformName = (typeof UNIFORM_NAMES)[number]
