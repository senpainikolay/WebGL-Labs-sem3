// ADDED LAB4 VARS 
var i; // iterations stuff 
let numberTexture = 0; 
let finalFileTexture;
let finalFileVertices;
let finalFileNormals; 
// 
var ShapesCount = 0; 



var canvas = document.getElementById('my_Canvas');  
gl = canvas.getContext('webgl');   

var normalsArray = [];  
var pointsArray = [];   

var numTimesToSubdivide = 3; 

// Scale variables on x/y/z axis  for Figure 
var Sx = 1; 
var Sy = 1; 
var Sz = 1;  

// Position/Movement variables
var moveCubeX = 0;
var moveCubeY =  0;
var moveCubeZ  = 0;  

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

 function emptyPnNarrays() { 
  pointsArray = []
  normalsArray = []
}
//
// Program init 
// 

var shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( shaderProgram );      




class fingureData  {  
   constructor( stringName, vertices, axis, normala,verticeslen, textureUV, objName )   
    {  
      this.vertLen =  verticeslen;  
      this.figName = stringName;    
      this.obj = objName;




     this.vertex_buffer =  gl.createBuffer ();    
     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new flatten(vertices), gl.STATIC_DRAW);   

     this.normal_buffer =  gl.createBuffer ();    
     gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new flatten(normala), gl.STATIC_DRAW);  

     this.textureBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, flatten(textureUV), gl.STATIC_DRAW);
    


     this.theta =  vec3(0,0,0);     
     this.axis = axis;  

     this.Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");    
     this.ScaleMatrixLoc = gl.getUniformLocation(shaderProgram, "scaleMatrix"); 
     this.mov_matrix = mat4();    
     this.scale_matrix = mat4(); 
     this.thetaLoc = gl.getUniformLocation(shaderProgram, "theta");  
     this.textureDataLocation = gl.getUniformLocation(shaderProgram, "textureData"); 




    }    

    draw() {   

      if (this.obj === 'loadedShape') { 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
                 this.position = gl.getAttribLocation(shaderProgram, "position");
                     gl.vertexAttribPointer(this.position, 3, gl.FLOAT, false,0,0) ; 
                     gl.enableVertexAttribArray(this.position);   
             
                         } 
   
                         else {  
                           gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
                           this.position = gl.getAttribLocation(shaderProgram, "position");
                               gl.vertexAttribPointer(this.position, 4, gl.FLOAT, false,0,0) ; 
                               gl.enableVertexAttribArray(this.position);  
                       
   
   
                         }
  
    
            
                     
                     gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);  
                     this.vNormal = gl.getAttribLocation(shaderProgram, "vNormal");
                       gl.vertexAttribPointer(this.vNormal, 4, gl.FLOAT, false,0,0) ;  
                          gl.enableVertexAttribArray(this.vNormal); 
                          
 

                          gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);  
                          this.textureUV = gl.getAttribLocation(shaderProgram, "vTextureCoord");
                            gl.vertexAttribPointer(this.textureUV, 2, gl.FLOAT, false,0,0) ;  
                               gl.enableVertexAttribArray(this.textureUV);   

                               if (textureFigMap.get(this.figName)) {
                                gl.uniform1i(this.textureDataLocation, textureFigMap.get(this.figName));
                              } else {
                                gl.uniform1i(this.textureDataLocation, 0);
                              }
               
                          
                          
                          
               this.theta[this.axis] += 0.2; 
          
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
          this.textureDataLocationForLight = gl.getUniformLocation(shaderProgram, 'textureData');

       } 

       draw()  
       {    

       
        // texture id, shows what texture to use, in this case we have only one texture
        gl.uniform1i(this.textureDataLocationForLight, 0);
          
         // Cube Fig   For Light Sources

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

  var textureCoordsCube = [
    vec3(1, 1), vec3(0, 1), vec3(0, 0),
    vec3(0, 0), vec3(1, 0), vec3(1, 1),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0),
  ]; 
  var textureCoordsPyramid = [
    vec3(1, 1), vec3(0, 1), vec3(0, 0),
    vec3(0, 0), vec3(1, 0), vec3(1, 1),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0),
  ];  


  var textureCoordsSphere = [
    vec3(1, 1), vec3(0, 1), vec3(0, 0),
    vec3(0, 0), vec3(1, 0), vec3(1, 1),
    vec3(1, 0), vec3(1, 1), vec3(0, 1),
    vec3(0, 1), vec3(0, 0), vec3(1, 0)
  ]; 
 
  
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


   // others declared in the Class 
    var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix"); 
    var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");   


 
      
    // 
    //  Proj + View  + Mov   
    //   
         var  proj_matrix =  perspective ( fieldOfView, aspect, near,far);   
         var view_matrix = lookAt( [  xPosCamera, yPosCamera, zPosCamera  ], [ 0,0,0 ], [ 0, upVectorCamera, 0 ]   ); 

      
  document.getElementById("load").onclick = function () {
   addFigure('loadedShape'); 
   
   }

   document.getElementById("file-input").addEventListener('change', function () {
   var selectedFiles = this.files;
   if (selectedFiles.length == 0) {
      alert('Error : No file selected');
      return;
   }
   readTextFromFile(selectedFiles[0]); // first to go 
   } 
   );

   setLoadTextureListener();





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
  
    

if (selectedFigure !=0)  
{  
  for (i = 0; i < drawList.length; i++) drawList[i].draw();  
 }  // DRAW function  if the figure is loaded!
     




     
  window.requestAnimationFrame(render); 
           
         } 


   //
   // Data preparation 
   // 



 function normalizeDataFromFile(data) {
   const result = [];
   data.forEach((line) => {
     line.split(' ').slice(-3).forEach((element) => {
       result.push(parseFloat(element));
     });
   })
   return result;
 } 

 function processFacesFromFile(faces, vertices, normals, texture) {
   const finalVertices = [];
   const finalNormals = [];
   const finalTexture = [];
   faces.forEach((face) => {
     face.trim().split(' ').slice(-3).forEach((element) => {
       const line = element.split('/').map((element) => parseInt(element) - 1);
       finalVertices.push(vec3(vertices[line[0] * 3], vertices[line[0] * 3 + 1], vertices[line[0] * 3 + 2]));
       finalNormals.push(vec4(normals[line[2] * 3], normals[line[2] * 3 + 1], normals[line[2] * 3 + 2], 1));
       finalTexture.push(vec2(texture[line[1] * 3], 1 - texture[line[1] * 3 + 1]));
     });
   });
 
   finalFileTexture = finalTexture;
   finalFileVertices = finalVertices;
   finalFileNormals = finalNormals;
 } 

 
 function splitTextFromFile(text) {
   const lines = text.split(/\r?\n/).filter(line => line[0] === 'v' || line[0] === 'f');;
   let vertices = [];
   let normals = [];
   let texture = [];
   let faces = [];
   lines.forEach((line) => {
     if (line.startsWith('f')) {
       faces.push(line);
     }
     else if (line.startsWith('vn')) {
       normals.push(line);
     }
     else if (line.startsWith('vt')) {
       texture.push(line);
     }
     else if (line.startsWith('v')) {
       vertices.push(line);
     }
   })
   let verticesFile = normalizeDataFromFile(vertices);
   let normalsFile = normalizeDataFromFile(normals);
   let textureFile = normalizeDataFromFile(texture)
   processFacesFromFile(faces, verticesFile, normalsFile, textureFile);
 }  



 //  Main functions taken from given files 


function readTextFromFile(file) {
   var reader = new FileReader(); // creating the object that will help us read the file
   // setting a listener that will catch the 'load' event of reader functions		
   reader.addEventListener('load', function (e) {
     // when the contents are loaded --- execute all of these actions
     var text = e.target.result;
     splitTextFromFile(text);
   });
   // listener for errors that may occur
   reader.addEventListener('error', function () {
     alert('File error happened!');
   });
   // the readAsText function will get the plain text from the file
   reader.readAsText(file); // when the function will complete execution, the 'load' event will fire
 }
 
 function setLoadTextureListener() {
   // setting listeners for both buttons, they will load different texture at different locations
   document.querySelectorAll('.texture').forEach(function (button) {
     button.addEventListener('change', function () {
       var selectedFiles = this.files;
       if (selectedFiles.length == 0) {
         alert('Error : No file selected');
         return;
       }
       readImageFromFile(selectedFiles[0]); // first file to go 
     });
   });
 }
 

 function readImageFromFile(file) {
   var reader = new FileReader();
   reader.addEventListener('load', function (e) {
     var imgRawData = e.target.result;
     var texture = loadTexture(gl, imgRawData);
   });
 
   reader.addEventListener('error', function () {
     alert('File error happened!');
   });
 
   reader.readAsDataURL(file);
 }
 

 function loadTexture(gl, dataRaw) { 

  if (ShapesCount !== 0) { 
    numberTexture += 1;
    textureFigMap.set(selectedFigure.figName, numberTexture);
     
  }
   // using the offsets like gl.TEXTURE+0 or gl.TEXTURE1+1 etc to load different textures in different memory locations
   gl.activeTexture(gl.TEXTURE0 +numberTexture); 
   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);
 
   const internalFormat = gl.RGBA;
   const srcFormat = gl.RGBA;
   const srcType = gl.UNSIGNED_BYTE;
 
   const image = new Image();
   image.onload = function () {
     gl.bindTexture(gl.TEXTURE_2D, texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, srcFormat, srcType, image);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   };
   image.src = dataRaw;
   return texture;
 }  


 function addToDraw(shape) {
  drawList.push(shape);
  updateSelect();
} 


function addFigure(text) {
  ShapesCount += 1;  
  if ( text === 'Sphere' ) {  
    emptyPnNarrays();
    tetrahedron(numTimesToSubdivide);    
  var Sphere =  new fingureData(`figure${ShapesCount}`, pointsArray, yAxis, normalsArray, pointsArray.length,textureCoordsCube,text );   
  addToDraw(Sphere);
  selectedFigure = Sphere; 
   } 
   if (text == 'loadedShape')  { 
  var newFig = new fingureData(`figure${ShapesCount}`,finalFileVertices, yAxis,  finalFileNormals, finalFileVertices.length, finalFileTexture,text);
  addToDraw(newFig);
  selectedFigure = newFig;   
   } 

   if ( text === 'Cube' ) {  
    emptyPnNarrays();
    converter(vertices,indices);   
  var Cube =  new fingureData(`figure${ShapesCount}`, pointsArray, yAxis, normalsArray, pointsArray.length,textureCoordsCube,text );   
  addToDraw(Cube);
  selectedFigure = Cube; 
   }   

   if ( text === 'Pyr' ) {  
    emptyPnNarrays();
    converter(Pvertices,pyr_indices);   
  var Pyr =  new fingureData(`figure${ShapesCount}`, pointsArray, yAxis, normalsArray, pointsArray.length,textureCoordsPyramid,text );   
  addToDraw(Pyr);
  selectedFigure = Pyr; 
   }   


}


 
 
 // ==== 


 

 function updateSelect() {
  var x = document.getElementById("selectTheFigure");
  x.innerText = null
  for (element of drawList) {
    var option = document.createElement("option");
    option.text = element.figName;
    x.add(option);
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





document.getElementById( "addSphere" ).onclick = function () { addFigure('Sphere') };
document.getElementById( "addCube" ).onclick = function () { addFigure('Cube') }; 
document.getElementById( "addPyr" ).onclick = function () { addFigure('Pyr') };

 
         
   
      // 
      // Events           --! the Render functions after all the events. Feel free to scroll down :). 
      //   
      
        //AMBIENT COLOR CHANGE 

        document.getElementById("ambientColor").onchange = function() { 
           var hex = this.value; 
            
           var R = hex.slice(1,3); 
           var G = hex.slice(3,5); 
           var B = hex.slice(5,7);

           ambientProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

        }   


      //DIFFUSE COLORS 
      document.getElementById("diffuseColor1").onchange = function() { 
         var hex = this.value; 
          
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light0.diffuseProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("diffuseColor2").onchange = function() { 
         var hex = this.value; 
          
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light1.diffuseProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("diffuseColor3").onchange = function() { 
         var hex = this.value; 
          
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light2.diffuseProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   


       //SPECULAR COLORS 


       document.getElementById("specularColor1").onchange = function() { 
         var hex = this.value; 
          
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light0.specularProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("specularColor2").onchange = function() { 
         var hex = this.value; 
          
         var R = hex.slice(1,3); 
         var G = hex.slice(3,5); 
         var B = hex.slice(5,7);

         light1.specularProduct = vec4(parseInt(R,16)/255, parseInt(G,16)/255, parseInt(B,16)/255, 1.0);   

      }   
      document.getElementById("specularColor3").onchange = function() { 
         var hex = this.value; 
          
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









         //Figure Scaling 

document.getElementById("xScaleCube").onchange = function(event)  {
      Sx = event.target.value;  
      selectedFigure.scale_matrix   =     scalem (Sx ,Sy,Sz);    
   };    


document.getElementById("yScaleCube").onchange = function(event) {
     Sy  = event.target.value;      
     selectedFigure.scale_matrix   =   scalem (Sx ,Sy,Sz) ;     
    };    

document.getElementById("zScaleCube").onchange = function(event) 
{   
     Sz = event.target.value;  
     selectedFigure.scale_matrix   =  scalem (Sx ,Sy,Sz);       
};     

   

   //
   // Movements  
   //


document.getElementById("xMoveCube").onchange = function(event) 
 {
   moveCubeX = event.target.value;   
  selectedFigure.mov_matrix = translate (moveCubeX ,moveCubeY,moveCubeZ);    
 };   


document.getElementById("yMoveCube").onchange = function(event)
{
   moveCubeY = event.target.value;  
  selectedFigure.mov_matrix  = translate (moveCubeX ,moveCubeY,moveCubeZ);     
};    

document.getElementById("zMoveCube").onchange = function(event) 
{
   moveCubeZ = event.target.value;  
   selectedFigure.mov_matrix  = translate (moveCubeX ,moveCubeY,moveCubeZ);     
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

document.getElementById( "cubeRotateX" ).onclick = function () { selectedFigure.axis = xAxis; }; 
document.getElementById( "cubeRotateY" ).onclick = function () { selectedFigure.axis = yAxis; }; 
document.getElementById( "cubeRotateZ" ).onclick = function () { selectedFigure.axis = zAxis; }; 

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



  
 



 




 


