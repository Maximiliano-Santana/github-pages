varying vec3 vRandomColor;
varying vec4 vPointColor;


void main (){
    
    // vec4 color = vec4(gl_PointCoord.xy, 1.0, 1.0);

    vec4 color = vec4(vRandomColor.r*vPointColor.r, vRandomColor.g*vPointColor.g, vRandomColor.b*vPointColor.b, 1.0);

    // color.w = ;

    gl_FragColor = vec4(vPointColor);


}