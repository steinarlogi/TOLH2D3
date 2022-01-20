var canvas;
var gl;

var numCirclePoints = 20;
var maxNumCirclePoints = 100;
var points = [];
var radius = 0.4;
var center = vec2(0,0);

var bufferId;

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, (maxNumCirclePoints + 1)*24, gl.STATIC_DRAW );



    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        document.getElementById("slider").onchange = function(event) {
        numCirclePoints = event.target.value;
        console.log(numCirclePoints);
        render();
    };


    render();
};

window.onload = init;

// Create the points of the circle
function createCirclePoints( cent, rad, k )
{
    var dAngle = 2*Math.PI/k;

    for( i=k; i>=0; i-- ) {
        //Þarf fyrst að bæta inn miðjupunktinum í hverri ítrun.
        points.push(cent)
        //bæti við punkti á hringnum.
        a = i*dAngle;
        var p = vec2( rad*Math.sin(a) + cent[0], rad*Math.cos(a) + cent[1] );
        points.push(p);
        //Bæti við næsta punkti á hringnum.
        a1 = (i+1)*dAngle;
        var p2 = vec2(rad*Math.sin(a1) + cent[0], rad*Math.cos(a1) + cent[1] );
        points.push(p2)
    }
}

function render()
{
    points = [];
    createCirclePoints(center, radius, numCirclePoints);
    console.log(points.length <= numCirclePoints*3*4);
    console.log(points.length);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];
    //requestAnimFrame(render);
}
