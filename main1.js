

var canvas = document.getElementById('my_Canvas');  
gl = canvas.getContext('webgl');   

var normalsArray = [];  
var pointsArray = [];   

numTimesToSubdivide = 3; 

// Scale variables on x/y/z axis  for Cube
var Sx = 1; 
var Sy = 1; 
var Sz = 1;  

// Scale variables on x/y/z axis  for Pyramid
var Sx1 = 1; 
var Sy1 = 1; 
var Sz1 = 1;   
// Scale variables on x/y/z axis  for Cone
var Sx2 = 1; 
var Sy2 = 1; 
var Sz2 = 1;   

// Position/Movement variables
var moveCubeX = 0;
var moveCubeY =  0;
var moveCubeZ  = 0;  

var movePyrX = 3;
var movePyrY =  0;
var movePyrZ  = 0;  

var moveConeX = -3;
var moveConeY =  0;
var moveConeZ  = 0; 
 

//Pos/ Move Light 
var moveLight1X  = -2.0;
var moveLight1Y  = 3.0; 
var moveLight1Z = 0.0;  

var moveLight2X  = 0.0;
var moveLight2Y  = -3.0; 
var moveLight2Z = 0.0; 
 
var moveLight3X  = 3.0;
var moveLight3Y  = 2.0; 
var moveLight3Z = 0.0;  

// Ambient Color 

var ambientProduct;  


// Shininess 
var shininess0 = 1.0;
var shininess1 = 1.0;
var shininess2 = 1.0; 


// Rotation  variables 
var xAxis = 0; 
var yAxis = 1; 
var zAxis  =2;   


// Camera position variables 

var xPosCamera = 0; 
var yPosCamera = 0; 
var zPosCamera = 8; 

// Camera upside down (upvector) 
var upVectorCamera = 1;  
var counter = 2; // for the magic button 


// Perspective/Proj  
var fieldOfView = 70;    
 var aspect = canvas.width/canvas.height;    
var near = 0.1; 
 var far = 100.0;     

//
// Program init 
// 

var shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( shaderProgram );      




class fingureData  {  
   constructor( vertices, axis, normala,verticeslen )   
    {    
        this.vertLen =  verticeslen;  


     this.vertex_buffer =  gl.createBuffer ();    
     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new flatten(vertices), gl.STATIC_DRAW);   

     this.normal_buffer =  gl.createBuffer ();    
     gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new flatten(normala), gl.STATIC_DRAW);  


     this.theta =  vec3(0,0,0);     
     this.axis = axis;  

     this.Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");    
     this.ScaleMatrixLoc = gl.getUniformLocation(shaderProgram, "scaleMatrix"); 
     this.mov_matrix = mat4();    
     this.scale_matrix = mat4(); 
     this.thetaLoc = gl.getUniformLocation(shaderProgram, "theta"); 
    }    

    draw() {  
     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
              this.position = gl.getAttribLocation(shaderProgram, "position");
                  gl.vertexAttribPointer(this.position, 4, gl.FLOAT, false,0,0) ;
                     gl.enableVertexAttribArray(this.position);  
            
                     
                     gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);  
                     this.vNormal = gl.getAttribLocation(shaderProgram, "vNormal");
                       gl.vertexAttribPointer(this.vNormal, 4, gl.FLOAT, false,0,0) ;  
                          gl.enableVertexAttribArray(this.vNormal); 
                          
                          
               this.theta[this.axis] += 0.1; 
          
                 gl.uniform3fv(this.thetaLoc, this.theta);  
                 gl.uniformMatrix4fv(this.Mmatrix, false,flatten( this.mov_matrix) ) ;  
                 gl.uniformMatrix4fv(this.ScaleMatrixLoc, false, flatten( this.scale_matrix) );
               
              
      gl.drawArrays(gl.TRIANGLES, 0, this.vertLen );   
    }   

    }  
 

    class Light {
      constructor(lightPos,lightPosLoc, diffuseProd,  diffuseProdLoc, specProd,  specProdLoc) 
       {  

         // Cube fig 
          this.vertices = vertices; 
          this.indices = indices; 
          this.vertex_buffer =  gl.createBuffer ();    
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);  
          this.index_buffer = gl.createBuffer ();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
          this.mov_matrix = mat4();  
          this.Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");   
          this.mov_matrix = translate(lightPos[0],lightPos[1], lightPos[2] );  
          this.scale_matrix = mat4(); 
          this.ScaleMatrixLoc = gl.getUniformLocation(shaderProgram, "scaleMatrix");  
          this.scale_matrix = scalem(0.1,0.1,0.1); 
          // 


          this.lightPosition = lightPos;
          this.lightPositionLocation = gl.getUniformLocation(shaderProgram, lightPosLoc ); 
          this.diffuseProduct = diffuseProd; 
          this.specularProduct = specProd;
          this.diffuseProductLocation =  gl.getUniformLocation(shaderProgram, diffuseProdLoc );
          this.specularProductLocation =  gl.getUniformLocation(shaderProgram, specProdLoc )

       } 

       draw()  
       {   
          
         // Cube Fig   

         gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
         this.position = gl.getAttribLocation(shaderProgram, "position");
             gl.vertexAttribPointer(this.position, 4, gl.FLOAT, false,0,0) ;
                gl.enableVertexAttribArray(this.position);       
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);   
         gl.uniformMatrix4fv(this.ScaleMatrixLoc, false, flatten( this.scale_matrix) ); 
         gl.uniformMatrix4fv(this.Mmatrix, false,flatten( this.mov_matrix) ) ;
         gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0); 
         // 

         gl.uniform4fv(this.lightPositionLocation, flatten(this.lightPosition) );  
         gl.uniform4fv(this.diffuseProductLocation, flatten(this.diffuseProduct) ); 
         gl.uniform4fv(this.specularProductLocation, flatten(this.specularProduct) );  
         
        
 
       }
   }  





    // Main fucntion 

    


window.onload = function init()
{     

   


  
 
   
   // 
   // changing everything to vecs , passing to the pointsArray and normalArrays through triangle()
   // 
   function converter(vertices,indices) { 
      var tempArray  = [];     
      var indexarr = 0;  


      for ( let i = 4; i <= vertices.length ; i = i + 4 ) {   
            tempArray[indexarr] = vec4(vertices[i-4], vertices[i-3], vertices[i-2], 1.0 );  
            indexarr++; 
      }    
   
   // forming again traingles and normal vectors by passing the indeces array to vertex array 
   //Stroing the points array and normals array 
   
      for ( let i = 3; i <= indices.length ; i = i + 3 ) { 
         triangle(  tempArray[ indices[i-3] ], tempArray[ indices[i-2] ], tempArray[ indices[i-1]  ] ); 
      }   
     } 
   
     function emptyPnNarrays() { 
        pointsArray = []
        normalsArray = []
     }


     //
     // END 
     //
   

   //var lightPosition = vec4(0.0, 5.0, 0.0, 1.0 );
   //var lightPositionLoc = gl.getUniformLocation(shaderProgram, "lightPosition0");    

 

   var light0 = new  Light(  vec4(-2.0, 3.0, 0.0, 1.0 ),
                       "lightPosition0", 
                       vec4(1.0, 1.0, 1.0,1.0),
                       "diffuseProduct0",
                       vec4(1.0,1.0,1.0,1.0),
                       "specularProduct0"     
                       )  

   var light1 =  new Light( vec4(0.0, -3.0, 0.0, 1.0 ),
                       "lightPosition1", 
                       vec4(1.0, 1.0, 1.0,1.0),
                       "diffuseProduct1",
                       vec4(1.0,1.0,1.0,1.0),
                       "specularProduct1"     
                       )   

var light2 =  new Light( vec4(3.0, 2.0, 0.0, 1.0 ),
                       "lightPosition2", 
                       vec4(1.0, 1.0, 1.0,1.0),
                       "diffuseProduct2",
                       vec4(1.0,1.0,1.0,1.0),
                       "specularProduct2"     
                       )
   

   ambientProduct = vec4(0.0,0.0,0.0,1.0);  
   var ambientProductLocation; 
   ambientProductLocation = gl.getUniformLocation(shaderProgram, "ambientProduct");   
   shininess0Location =  gl.getUniformLocation(shaderProgram, "shininess0");   
   shininess1Location =  gl.getUniformLocation(shaderProgram, "shininess1");  
   shininess2Location =  gl.getUniformLocation(shaderProgram, "shininess2"); 


   
     //
      // Buffers 
      //      
  converter(vertices, indices);  
  var Cube =  new fingureData( pointsArray , yAxis, normalsArray, pointsArray.length );   
  emptyPnNarrays();     
  tetrahedron(numTimesToSubdivide);    
  var Sphere = new fingureData(pointsArray, yAxis, normalsArray, pointsArray.length )   
  emptyPnNarrays(); 
  converter(Pvertices, pyr_indices )
   var  Pyr = new fingureData(pointsArray, yAxis, normalsArray, pointsArray.length );  
   emptyPnNarrays(); 
   converter(Cvertices, cone_indices ); 
   var  Cone = new fingureData(pointsArray, yAxis, normalsArray, pointsArray.length ); 


  

  
   //
   // Locations.  The movements one is declared in the class figureData .
   //   

    var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix"); 
    var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");   


 
      
    // 
    //  Proj + View  + Mov   
    //   
         var  proj_matrix =  perspective ( fieldOfView, aspect, near,far);   
         var view_matrix = lookAt( [  xPosCamera, yPosCamera, zPosCamera  ], [ 0,0,0 ], [ 0, upVectorCamera, 0 ]   );   
         Cube.mov_matrix = translate(2,0,-5); 
         Pyr.mov_matrix  = translate(movePyrX,movePyrY,movePyrZ);
         Cone.mov_matrix  =  translate(moveConeX,moveConeY,moveConeZ);    
      







 render = function() 
          {   

   gl.clearColor(0.5, 0.5, 0.5, 0.9); 
   gl.clearDepth(1.0);  
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
   gl.enable(gl.DEPTH_TEST);   
   
   gl.uniformMatrix4fv(Pmatrix, false, flatten (proj_matrix) );
   gl.uniformMatrix4fv(Vmatrix, false, flatten (view_matrix) );  
   
   
   gl.uniform4fv(ambientProductLocation, flatten(ambientProduct) ); 

   gl.uniform1f(shininess0Location, shininess0  ); 
   gl.uniform1f(shininess1Location, shininess1 ); 
   gl.uniform1f(shininess2Location, shininess2  );


	// send the updated light position to the shader (every frame!!!)  

    light0.draw(); 
    light1.draw();  
    light2.draw();  

     


   
      Cube.draw();     
      Pyr.draw();   
      Cone.draw();     
      Sphere.draw(); 
     
  window.requestAnimationFrame(render); 
           
         } 


   //
   //Some fucntions 
   //

         

function calculateNormal(a, b, c){
	// 3 main lines of NORMALS CALCULATION FOR 1 TRIANGLE WITH VERTICES a, b, c!
	var t1 = subtract(b, a);
	var t2 = subtract(c, a);
	var normal = normalize(cross(t2, t1));

	// converting vec3 to vec4, not needed if you send only vec3 to shaders, needed otherwise
	normal = vec4(normal);
	return normal;
}  

function triangle(a, b, c) {
	var normal = calculateNormal(a, b, c); 
	
	// the same normal for all 3 vertices of the tirangle!!!!!
	// this is FLAT LIGHTING! Using triangles normals, not vertex normals
	normalsArray.push(normal);
	normalsArray.push(normal);
	normalsArray.push(normal);

	pointsArray.push(a);
	pointsArray.push(b);
	pointsArray.push(c);
}    


function divideTriangle(a, b, c, count) {
	if ( count > 0 ) {

		var ab = mix( a, b, 0.5);
		var ac = mix( a, c, 0.5);
		var bc = mix( b, c, 0.5);

		ab = normalize(ab, true);
		ac = normalize(ac, true);
		bc = normalize(bc, true);

		divideTriangle( a, ab, ac, count - 1 );
		divideTriangle( ab, b, bc, count - 1 );
		divideTriangle( bc, c, ac, count - 1 );
		divideTriangle( ab, bc, ac, count - 1 );
	}
	else {
		triangle( a, b, c );
	}
}


function tetrahedron(n) {	
	var a = vec4(0.0, 0.0, -1.0,1);
	var b = vec4(0.0, 0.94, 0.33, 1);
	var c = vec4(-0.81, -0.47, 0.33, 1);
	var d = vec4(0.87, -0.4, 0.33,1);
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
} 


 
         
   
      // 
      // Events           --! the Render functions after all the events. Feel free to scroll down :). 
      //   
      
        //AMBIENT COLOR CHANGE 

        document.getElementById("ambientColor").onchange = function() { 
           var hex = this.value; 
           //"#FF00FF" 
           var R = hex.slice(1,3); 
           var G = hex.slice(3,5); 
           var B = hex.slice(5,7);

           ambientProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

        }   


      //DIFFUSE COLORS 
      document.getElementById("diffuseColor1").onchange = function() { 
         var hex = this.value; 
         //"#FF00FF" 
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light0.diffuseProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("diffuseColor2").onchange = function() { 
         var hex = this.value; 
         //"#FF00FF" 
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light1.diffuseProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("diffuseColor3").onchange = function() { 
         var hex = this.value; 
         //"#FF00FF" 
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light2.diffuseProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   


       //SPECULAR COLORS 


       document.getElementById("specularColor1").onchange = function() { 
         var hex = this.value; 
         //"#FF00FF" 
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light0.specularProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("specularColor2").onchange = function() { 
         var hex = this.value; 
         //"#FF00FF" 
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light1.specularProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("specularColor3").onchange = function() { 
         var hex = this.value; 
         //"#FF00FF" 
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light2.specularProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }    

      //SHINISESS 


      document.getElementById("shine1").onchange = function(event) 
      {
       shininess0 = event.target.value  
      };  
      
      
      document.getElementById("shine2").onchange = function(event)
      {
         shininess1 = event.target.value      
      };    
      
      document.getElementById("shine3").onchange = function(event) 
      {
         shininess2 = event.target.value 
      };   
      


      

      
      // TRANSLATE LIGHT1 

      document.getElementById("xLight1").onchange = function(event) 
 {
   moveLight1X = event.target.value;   
  light0.mov_matrix = translate (moveLight1X ,moveLight1Y,moveLight1Z);   
  light0.lightPosition = vec4( moveLight1X ,moveLight1Y,moveLight1Z, 1.0 )  
 };   


document.getElementById("yLight1").onchange = function(event)
{
   moveLight1Y = event.target.value;  
  light0.mov_matrix  = translate (moveLight1X ,moveLight1Y,moveLight1Z);   
  light0.lightPosition = vec4( moveLight1X ,moveLight1Y,moveLight1Z, 1.0 )     
};    

document.getElementById("zLight1").onchange = function(event) 
{
   moveLight1Z = event.target.value;  
   light0.mov_matrix  = translate (moveLight1X ,moveLight1Y,moveLight1Z);  
   light0.lightPosition = vec4( moveLight1X ,moveLight1Y,moveLight1Z, 1.0 )    

};    

 // TRANSLATE LIGHT2

document.getElementById("xLight2").onchange = function(event) 
{
 moveLight2X = event.target.value;   
 light1.mov_matrix = translate (moveLight2X ,moveLight2Y,moveLight2Z);   
 light1.lightPosition = vec4( moveLight2X ,moveLight2Y,moveLight2Z, 1.0 )  
};  


document.getElementById("yLight2").onchange = function(event)
{
  moveLight2Y = event.target.value;  
  light1.mov_matrix = translate (moveLight2X ,moveLight2Y,moveLight2Z);   
  light1.lightPosition = vec4( moveLight2X ,moveLight2Y,moveLight2Z, 1.0 )      
};    

document.getElementById("zLight2").onchange = function(event) 
{
  moveLight2Z = event.target.value;  
  light1.mov_matrix = translate (moveLight2X ,moveLight2Y,moveLight2Z);   
  light1.lightPosition = vec4( moveLight2X ,moveLight2Y,moveLight2Z, 1.0 )   
};   

 // TRANSLATE LIGHT3

 document.getElementById("xLight3").onchange = function(event) 
 {
  moveLight3X = event.target.value;   
  light2.mov_matrix = translate (moveLight3X ,moveLight3Y,moveLight3Z);   
  light2.lightPosition = vec4( moveLight3X ,moveLight3Y,moveLight3Z, 1.0 )  
 };  
 
 
 document.getElementById("yLight3").onchange = function(event)
 {
   moveLight3Y = event.target.value;  
   light2.mov_matrix = translate (moveLight3X ,moveLight3Y,moveLight3Z);   
   light2.lightPosition = vec4( moveLight3X ,moveLight3Y,moveLight3Z, 1.0 )      
 };    
 
 document.getElementById("zLight3").onchange = function(event) 
 {
   moveLight3Z = event.target.value;  
   light2.mov_matrix = translate (moveLight3X ,moveLight3Y,moveLight3Z);   
   light2.lightPosition = vec4( moveLight3X ,moveLight3Y,moveLight3Z, 1.0 )     
 };  











     
      //
     // Scaling 
       // 

         //Cube 

document.getElementById("xScaleCube").onchange = function(event)  {
      Sx = event.target.value;  
      Cube.scale_matrix   =     scalem (Sx ,Sy,Sz);    
   };    


document.getElementById("yScaleCube").onchange = function(event) {
     Sy  = event.target.value;      
     Cube.scale_matrix   =   scalem (Sx ,Sy,Sz) ;     
    };    

document.getElementById("zScaleCube").onchange = function(event) 
{   
     Sz = event.target.value;  
     Cube.scale_matrix   =  scalem (Sx ,Sy,Sz);       
};     

   //  Pyramid 
   
document.getElementById("xScalePyr").onchange = function(event)
{ 
     Sx1 = event.target.value;    
    Pyr.scale_matrix =  scalem (Sx1 ,Sy1,Sz1);       
};   

document.getElementById("yScalePyr").onchange = function(event)
{
     Sy1  = event.target.value;      
     Pyr.scale_matrix  =   scalem (Sx1 ,Sy1,Sz1); 
};     

document.getElementById("zScalePyr").onchange = function(event)  
{
     Sz1 = event.target.value;  
     Pyr.scale_matrix = scalem (Sx1 ,Sy1,Sz1); 
};     


//   Cone

document.getElementById("xScaleCone").onchange = function(event)
{
    Sx2 = event.target.value;  
    Cone.scale_matrix = scalem (Sx2 ,Sy2,Sz2) ;     
};   


document.getElementById("yScaleCone").onchange = function(event) 
{
     Sy2  = event.target.value;      
     Cone.scale_matrix  = scalem (Sx2 ,Sy2,Sz2) ;     
};    

document.getElementById("zScaleCone").onchange = function(event)  
{
     Sz2 = event.target.value;  
     Cone.scale_matrix  =   scalem (Sx2 ,Sy2,Sz2)  ;   
 };    
 

   //
   // Movements  
   //
 
   //Cube 

document.getElementById("xMoveCube").onchange = function(event) 
 {
   moveCubeX = event.target.value;   
  Cube.mov_matrix = translate (moveCubeX ,moveCubeY,moveCubeZ);    
 };   


document.getElementById("yMoveCube").onchange = function(event)
{
   moveCubeY = event.target.value;  
  Cube.mov_matrix  = translate (moveCubeX ,moveCubeY,moveCubeZ);     
};    

document.getElementById("zMoveCube").onchange = function(event) 
{
   moveCubeZ = event.target.value;  
   Cube.mov_matrix  = translate (moveCubeX ,moveCubeY,moveCubeZ);     
};     


// Pyramid  

document.getElementById("xMovePyr").onchange = function(event) 
{
   movePyrX = event.target.value;   
  Pyr.mov_matrix =  translate (movePyrX ,movePyrY,movePyrZ);    

 };   

document.getElementById("yMovePyr").onchange = function(event) 
{
   movePyrY = event.target.value;  
  Pyr.mov_matrix  = translate (movePyrX ,movePyrY,movePyrZ);     

};    

document.getElementById("zMovePyr").onchange = function(event) 
 {
   movePyrZ = event.target.value;  
   Pyr.mov_matrix  = translate (movePyrX ,movePyrY,movePyrZ);     
};   

// Cone 


document.getElementById("xMoveCone").onchange = function(event)  
{
   moveConeX = event.target.value;   
  Cone.mov_matrix = translate (moveConeX ,moveConeY,moveConeZ);    
        
};   

document.getElementById("yMoveCone").onchange = function(event) 
{
   moveConeY = event.target.value;   
   Cone.mov_matrix = translate (moveConeX ,moveConeY,moveConeZ);   

};     


document.getElementById("zMoveCone").onchange = function(event) 
{
   moveConeZ = event.target.value;   
   Cone.mov_matrix = translate (moveConeX ,moveConeY,moveConeZ);     

};     

      // 
      // Camera Positions
      //  


  document.getElementById("xPosCam").onchange = function(event)  
{
   xPosCamera = event.target.value;       
   view_matrix = lookAt( [  xPosCamera, yPosCamera, zPosCamera  ], [ 0,0,0 ], [ 0, upVectorCamera, 0 ]   ); 
        
 };    


document.getElementById("yPosCam").onchange = function(event) 
{
      yPosCamera = event.target.value;     
      view_matrix = lookAt( [  xPosCamera, yPosCamera, zPosCamera  ], [ 0,0,0 ], [ 0, upVectorCamera, 0 ]   );      

};     


document.getElementById("zPosCam").onchange = function(event) 
{
      zPosCamera = event.target.value;  
      view_matrix = lookAt( [  xPosCamera, yPosCamera, zPosCamera  ], [ 0,0,0 ], [ 0, upVectorCamera, 0 ]   );    
 };     

 // Perspective/ Projection 

document.getElementById("aspectSlider").onchange = function(event) 
{
        aspect = event.target.value;  
};  
 

document.getElementById("FoV").onchange = function(event) 
{
      fieldOfView = event.target.value;  
        proj_matrix =  perspective ( fieldOfView, canvas.width/canvas.height, near,far);       
};  

document.getElementById("nearProj").onchange = function(event) 
 {
        near = event.target.value;  
        proj_matrix =  perspective ( fieldOfView, canvas.width/canvas.height, near,far);        
};  


 document.getElementById("farProj").onchange = function(event) 
{
          far = event.target.value;  
         proj_matrix =  perspective ( fieldOfView, canvas.width/canvas.height, near,far);  
};  


 // 
 // Buttons  
 //

document.getElementById( "cubeRotateX" ).onclick = function () { Cube.axis = xAxis; }; 
document.getElementById( "cubeRotateY" ).onclick = function () { Cube.axis = yAxis; }; 
document.getElementById( "cubeRotateZ" ).onclick = function () { Cube.axis = zAxis; }; 

document.getElementById( "pyrRotateX" ).onclick = function () { Pyr.axis = xAxis;   }; 
document.getElementById( "pyrRotateY" ).onclick = function () { Pyr.axis = yAxis;   }; 
document.getElementById( "pyrRotateZ" ).onclick = function () { Pyr.axis = zAxis;   }; 

document.getElementById( "coneRotateX" ).onclick = function () { Cone.axis = xAxis;   }; 
document.getElementById( "coneRotateY" ).onclick = function () { Cone.axis = yAxis;   }; 
document.getElementById( "coneRotateZ" ).onclick = function () { Cone.axis = zAxis;   }; 

document.getElementById( "upVecCam" ).onclick = function ()  
 {    
     if (counter%2 == 0)
        { 
     upVectorCamera = -1;  
     view_matrix = lookAt( [  xPosCamera, yPosCamera, zPosCamera  ], [ 0,0,0 ], [ 0, upVectorCamera, 0 ] );  
     counter ++;  
        }  
         else { 
            upVectorCamera = 1;  
          view_matrix = lookAt( [  xPosCamera, yPosCamera, zPosCamera  ], [ 0,0,0 ], [ 0, upVectorCamera, 0 ] ); 
          counter++; 
         }
   }; 



   // 
   //  Render function 
  //  
   render(); 

  
       
  }    



  
 



 




 


