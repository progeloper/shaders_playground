#version 320 es

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

const float E = exp(1.0);
const float PI = radians(180.0);
const int depth = 1000;
const float logDepth = log(float(depth));
const float limitNorm = 100.0;
const float squaredLimitNorm = limitNorm * limitNorm;
const vec2 zoomCenter = vec2(-0.77568377, 0.13646737);
const float timeConstant = 2.0;
const float baseWidth = 1.0;
const float baseWidthInverse = 1.0 / baseWidth;

const vec2 redMap = vec2(0.0, 1.0);
const vec2 greenMap = vec2(PI/3.0, 1.0);
const vec2 blueMap = vec2(2.0*PI/3.0, 1.0);
const vec3 colorMin = vec3(0.0, 0.0, 0.0);
const vec3 colorMax = vec3(1.0, 1.0, 1.0);
const float colorChangeFiddleFactor = 1.0;

vec2 complexProd( in vec2 p1, in vec2 p2) {
    float imaginaryPart = dot(p1.xy, p2.yx);
    p1.y = -p1.y;
    float realPart = dot(p1.xy, p2.xy);
    return vec2(realPart, imaginaryPart);
}

float invLerp( in float a, in float b, in float c) {
    return (b - a) / (c - a);
}

float iterationsBeforeLimit( in vec2 c) {
    int iterations = 1;
    vec2 currentPoint = vec2(0.0,0.0);
    float lastContainedSquaredNorm = 0.0;
    float currentPointSquaredNorm = 0.0;
    for (int i = 0; i < depth; i++) {
        currentPoint = complexProd(currentPoint, currentPoint);
        currentPoint += c;
        currentPointSquaredNorm = dot(currentPoint, currentPoint);
        iterations += (currentPointSquaredNorm < squaredLimitNorm) ? 1 : 0;
        lastContainedSquaredNorm = (currentPointSquaredNorm < squaredLimitNorm)
        ? currentPointSquaredNorm
        : lastContainedSquaredNorm;
    }
    float fractionalPart = invLerp(limitNorm, lastContainedSquaredNorm, squaredLimitNorm);
    return float(iterations) - fractionalPart;
}

vec3 color( in float iterations )
{
    float a = 4.0*PI * log(iterations) / logDepth;
    float adjTime = iTime*colorChangeFiddleFactor;
    vec3 b = sin(a + vec3(redMap.x + adjTime*redMap.y, greenMap.x + adjTime*greenMap.y, blueMap.x + adjTime*blueMap.y));
    b *= b;
    return b;
}

vec2 complexCoord( in vec2 NDC ) {
    vec2 coord = vec2(0.5 - NDC.x, NDC.y - 0.5);
    coord /= (baseWidthInverse * exp(iTime/timeConstant));
    coord.y *= iResolution.y / iResolution.x;
    coord += zoomCenter;
    return coord;
}

vec4 mainImage( in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    vec2 complexCoord = complexCoord(uv);

    // Time varying pixel color
    vec3 col = color(iterationsBeforeLimit(complexCoord));

    // Output to screen
    return vec4(col,1.0);
}

void main(){
    vec2 pos = gl_FragCoord.xy;

    fragColor = mainImage(pos);
}