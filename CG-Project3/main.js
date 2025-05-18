
// Part 3:
// Added music to the car while it is moving.
// Press m to start/stop the music.

let gl, program;

let modelMatrix, projMatrix, cameraMatrix, shadowMatrix;

let stopSign, lamp, car, street, bunny;

let position1, position2, position3, position4, position5;
let normal1, normal2, normal3, normal4, normal5;
let texCoord1;
let material1, material2, material3, material4, material5;
let specular1, specular2, specular3, specular4, specular5;
let texture1;

let positionBuffer1, positionBuffer2, positionBuffer3, positionBuffer4, positionBuffer5;
let normalBuffer1, normalBuffer2, normalBuffer3, normalBuffer4, normalBuffer5;
let texBuffer1;
let materialBuffer1, materialBuffer2, materialBuffer3, materialBuffer4, materialBuffer5;
let specularBuffer1, specularBuffer2, specularBuffer3, specularBuffer4, specularBuffer5;
let vertexCount1, vertexCount2, vertexCount3, vertexCount4, vertexCount5;

let lightPosition = vec4(0, 3, 0, 1);
let lightAmbient = vec4(0.3, 0.3, 0.3, 1.0 );
let lightDiffuse = vec4(0.5, 0.5, 0.5, 1.0 );
let lightSpecular = vec4( 0.5, 0.5, 0.5, 1.0 );
let diffuseProduct, specularProduct, ambientProduct;
let phongShading = false;

// camera animation
let cameraAnimation = false;
let initialCameraAngle = 0;
let initialCameraPosition = [0,3,4];
let cameraRadius = initialCameraPosition[2];
let cameraHeight = initialCameraPosition[1];
let bobbingHeight = 1;
let bobbingFrequency = 2;
let cameraAngle = 0;
let cameraPosition = initialCameraPosition;
let at = [0, 0, 0], up;
let currentAt = at;

// car animation calculation
let carAnimation = false;
let carAngle = 0;
let initialCarAngle = Math.PI;
let initialCarPosition = [2.85, -0.2, 0.5];
let carRadius = Math.sqrt(initialCarPosition[0] ** 2 + initialCarPosition[2] ** 2);
let carPosition = mult(translate(2.85, -0.2, 0.5), rotateY(initialCarAngle * (180 / Math.PI)));
let cameraAttached = false;

// stack
let stack = [];
let sceneNode, stopSignNode, lampNode, carNode, streetNode, bunnyNode, cameraNode;
let thisTree;

// shadow
let shadowOn = false;

// skybox
let texCoordsArray = [];
let pointsArrayCube = [];
let pointsArrayCubeBuffer, texCoordsArrayBuffer;
let skyBoxOn = false;
let texture2, texture3, texture4, texture5, texture6, texture7;
let images = [];

// music
let audioContext;
let audioElement;

// reflection
let carReflectionOn = false;
let bunnyReflectionOn = false;

async function main() {
    // Retrieve <canvas> element
    let canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL(canvas, undefined);

    //Check that the return value is not null.
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set clear color black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // depth test
    gl.enable(gl.DEPTH_TEST);

    // Initialize shaders
    program = initShaders(gl, "vshader", "fshader");
    gl.useProgram(program);

    // Get the stop sign
    stopSign = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/stopsign.mtl");


    // Get the lamp
    lamp = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/lamp.mtl");

    // Get the car
    car = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/car.mtl");

    // Get the street
    street = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/street.mtl");

    // Get the bunny (you will not need this one until Part II)
    bunny = new Model(
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.obj",
        "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/bunny.mtl");

    // wait until all files are loaded
    await waitForModel(stopSign);
    await waitForModel(lamp);
    await waitForModel(car);
    await waitForModel(street);
    await waitForModel(bunny);

    // proj, camera, model matrices
    let aspect = gl.canvas.width / gl.canvas.height;
    projMatrix = perspective(90, aspect, 0.01, 100);
    pushMatrix(projMatrix, "projectionMatrix");
    at = vec3(0, 0, 0);
    up = vec3(0.0, 1.0, 0.0);
    cameraMatrix = lookAt(cameraPosition, at, up);
    pushMatrix(cameraMatrix, "cameraMatrix");
    modelMatrix = mat4();
    pushMatrix(modelMatrix, "modelMatrix");

    // keyboard event
    window.addEventListener("keyup", handleKeyPress);

    // attributes
    position1 = [];
    position2 = [];
    position3 = [];
    position4 = [];
    position5 = [];
    normal1 = [];
    normal2 = [];
    normal3 = [];
    normal4 = [];
    normal5 = [];
    texCoord1 = [];
    material1 = [];
    material2 = [];
    material3 = [];
    material4 = [];
    material5 = [];
    specular1 = [];
    specular2 = [];
    specular3 = [];
    specular4 = [];
    specular5 = [];

    // buffer
    positionBuffer1 = gl.createBuffer();
    positionBuffer2 = gl.createBuffer();
    positionBuffer3 = gl.createBuffer();
    positionBuffer4 = gl.createBuffer();
    positionBuffer5 = gl.createBuffer();
    normalBuffer1 = gl.createBuffer();
    normalBuffer2 = gl.createBuffer();
    normalBuffer3 = gl.createBuffer();
    normalBuffer4 = gl.createBuffer();
    normalBuffer5 = gl.createBuffer();
    texBuffer1 = gl.createBuffer();
    materialBuffer1 = gl.createBuffer();
    materialBuffer2 = gl.createBuffer();
    materialBuffer3 = gl.createBuffer();
    materialBuffer4 = gl.createBuffer();
    materialBuffer5 = gl.createBuffer();
    specularBuffer1 = gl.createBuffer();
    specularBuffer2 = gl.createBuffer();
    specularBuffer3 = gl.createBuffer();
    specularBuffer4 = gl.createBuffer();
    specularBuffer5 = gl.createBuffer();

    // music
    loadMusic();

    // lighting
    let phongShadingLocation = gl.getUniformLocation(program, "phongShading");
    gl.uniform1i(phongShadingLocation, phongShading);
    pushFlatLighting();
    pushUniform(lightPosition, "lightPosition");

    // shadow
    pushShadow();

    // camera and car animation calculations
    calculateCameraInitialAngle();
    calculateCarInitialAngle();

    // start the chain of creating object
    createStopSign();

    // skybox
    colorCube();
    loadSkyBox();
    //configureCubeMap();

    // Start rendering when the last skybox image is loaded

}

/**
 * Render the scene
 */
function renderRecursiveWay() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    sceneNode = new Node(null, mat4());
    stopSignNode = new Node(stopSign, mult(translate(4, 0, -1), rotateY(-90)));
    lampNode = new Node(lamp, mat4());
    carNode = new Node(car, carPosition);
    streetNode = new Node(street, mat4());
    bunnyNode = new Node(bunny, translate(-0.05, 0.7, 1.75));
    cameraNode = new Node(null, cameraMatrix);

    sceneNode.children.push(stopSignNode);
    sceneNode.children.push(lampNode);
    sceneNode.children.push(carNode);
    sceneNode.children.push(streetNode);
    sceneNode.children.push(cameraNode);
    carNode.children.push(bunnyNode);
    thisTree = new Tree(sceneNode);
    hierarchy(thisTree.root);

    updateCarPosition();
    updateCameraPosition();
    drawSkybox();

    requestAnimationFrame(renderRecursiveWay);

}

/**
 * Handles stack rendering
 * @param object
 * @param locModelMatrix
 * @constructor
 */
function Node(object, locModelMatrix) {
    this.object = object;
    this.locModelMatrix = locModelMatrix;
    this.children = [];
}
function Tree(root) {
    this.root = root;
}
function hierarchy(node) {
    let locModelMatrix = node.locModelMatrix;
    let object = node.object;
    let children = node.children;
    stack.push(modelMatrix);
    modelMatrix = mult(modelMatrix, locModelMatrix);
    pushMatrix(modelMatrix, "modelMatrix");
    if (cameraAttached && object !== null) {
        cameraPosition = applyInverseTransformation();
    }

    // reflection
    if(bunnyReflectionOn && object === bunny) {
        drawReflection(object);
    }
    else if (carReflectionOn && object === car) {
        drawReflection(object);
    } else {
        draw(object);
    }

    // shadow
    if (shadowOn && phongShading && (object === car || object === stopSign)) {
        stack.push(shadowMatrix);
        pushMatrix(shadowMatrix, "shadowMatrix");
        drawShadow(object);
        shadowMatrix = stack.pop();
    }

    for(let i = 0; i < children.length; i++) {
        hierarchy(children[i]);
    }

    modelMatrix = stack.pop();
}

/**
 * Renderer's call to draw
 * @param object
 */
function draw(object) {

    if (object === stopSign) {
        drawStopSign();
    }
    else if (object === lamp) {
        drawLamp();
    }
    else if (object === car) {
        drawCar();
    }
    else if (object === street) {
        drawStreet();
    }
    else if (object === bunny) {
        drawBunny();
    }
    else if (object === null) { // camera
        cameraMatrix = lookAt(cameraPosition, currentAt, up);
        pushMatrix(cameraMatrix, "cameraMatrix");
    }

}

/**
 * Create stop sign
 */
function createStopSign() {

    // get position, normal, texture
    for (let i = 0; i < stopSign.faces.length; i++) {
        position1.push(stopSign.faces[i].faceVertices);
        normal1.push(stopSign.faces[i].faceNormals);
        texCoord1.push(stopSign.faces[i].faceTexCoords);
    }

    // get diffuse map
    for (let i = 0; i < position1.length; i++) {
        for (let j = 0; j < position1[i].length; j++) {
            for (let key of stopSign.diffuseMap.keys()) {
                if (stopSign.faces[i].material === key) {
                    material1.push(stopSign.diffuseMap.get(key));
                }
            }
        }
    }

    // get specular map
    for (let i = 0; i < position1.length; i++) {
        for (let j = 0; j < position1[i].length; j++) {
            for (let key of stopSign.specularMap.keys()) {
                if (stopSign.faces[i].material === key) {
                    specular1.push(stopSign.specularMap.get(key));
                }
            }
        }
    }

    // Bind buffer
    pushData(position1, positionBuffer1);
    pushData(normal1, normalBuffer1);
    pushData(texCoord1, texBuffer1);
    pushData2(material1, materialBuffer1);
    pushData2(specular1, specularBuffer1);

    // Get vertex count
    vertexCount1 = flatten2(position1).length / 4;

    // Create texture
    texture1 = gl.createTexture();
    let image = new Image();
    image.crossOrigin = "anonymous";
    image.src = stopSign.imagePath;
    image.onload = function() {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        let textureLocation = gl.getUniformLocation(program, "tex1");
        gl.uniform1i(textureLocation, 1); // Use texture unit 1
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Create next object
        createLamp();
    };

}

/**
 * Create lamp
 */
function createLamp() {

    // get position, normal
    for (let i = 0; i < lamp.faces.length; i++) {
        position2.push(lamp.faces[i].faceVertices);
        normal2.push(lamp.faces[i].faceNormals);
    }

    // get diffuse map
    for (let i = 0; i < position2.length; i++) {
        for (let j = 0; j < position2[i].length; j++) {
            for (let key of lamp.diffuseMap.keys()) {
                if (lamp.faces[i].material === key) {
                    material2.push(lamp.diffuseMap.get(key));
                }
            }
        }
    }

    // get specular map
    for (let i = 0; i < position2.length; i++) {
        for (let j = 0; j < position2[i].length; j++) {
            for (let key of lamp.specularMap.keys()) {
                if (lamp.faces[i].material === key) {
                    specular2.push(lamp.specularMap.get(key));
                }
            }
        }
    }

    // bind buffer
    pushData(position2, positionBuffer2);
    pushData(normal2, normalBuffer2);
    pushData2(material2, materialBuffer2);
    pushData2(specular2, specularBuffer2);

    // get vertex count
    vertexCount2 = flatten2(position2).length / 4;

    // create next item
    createCar();

}

/**
 * Create car
 */
function createCar() {

    // get position
    for (let i = 0; i < car.faces.length; i++) {
        position3.push(car.faces[i].faceVertices);
        normal3.push(car.faces[i].faceNormals);
    }

    // get diffuse map
    for (let i = 0; i < position3.length; i++) {
        for (let j = 0; j < position3[i].length; j++) {
            for (let key of car.diffuseMap.keys()) {
                if (car.faces[i].material === key) {
                    material3.push(car.diffuseMap.get(key));
                }
            }
        }
    }

    // get specular map
    for (let i = 0; i < position3.length; i++) {
        for (let j = 0; j < position3[i].length; j++) {
            for (let key of car.specularMap.keys()) {
                if (car.faces[i].material === key) {
                    specular3.push(car.specularMap.get(key));
                }
            }
        }
    }

    // bind buffer
    pushData(position3, positionBuffer3)
    pushData(normal3, normalBuffer3);
    pushData2(material3, materialBuffer3);
    pushData2(specular3, specularBuffer3);

    // get vertex count
    vertexCount3 = flatten2(position3).length / 4;

    createStreet();

}

/**
 * Create street
 */
function createStreet() {

    // get position
    for (let i = 0; i < street.faces.length; i++) {
        position4.push(street.faces[i].faceVertices);
        normal4.push(street.faces[i].faceNormals);
    }

    // get diffuse map
    for (let i = 0; i < position4.length; i++) {
        for (let j = 0; j < position4[i].length; j++) {
            for (let key of street.diffuseMap.keys()) {
                if (street.faces[i].material === key) {
                    material4.push(street.diffuseMap.get(key));
                }
            }
        }
    }

    // get specular map
    for (let i = 0; i < position4.length; i++) {
        for (let j = 0; j < position4[i].length; j++) {
            for (let key of street.specularMap.keys()) {
                if (street.faces[i].material === key) {
                    specular4.push(street.specularMap.get(key));
                }
            }
        }
    }

    // bind buffer
    pushData(position4, positionBuffer4)
    pushData(normal4, normalBuffer4);
    pushData2(material4, materialBuffer4);
    pushData2(specular4, specularBuffer4);

    // get vertex count
    vertexCount4 = flatten2(position4).length / 4;

    createBunny();

}

/**
 * Create bunny
 */
function createBunny() {

    // get position
    for (let i = 0; i < bunny.faces.length; i++) {
        position5.push(bunny.faces[i].faceVertices);
        normal5.push(bunny.faces[i].faceNormals);
    }

    // get diffuse map
    for (let i = 0; i < position5.length; i++) {
        for (let j = 0; j < position5[i].length; j++) {
            for (let key of bunny.diffuseMap.keys()) {
                if (bunny.faces[i].material === key) {
                    material5.push(bunny.diffuseMap.get(key));
                }
            }
        }
    }

    // get specular map
    for (let i = 0; i < position5.length; i++) {
        for (let j = 0; j < position5[i].length; j++) {
            for (let key of bunny.specularMap.keys()) {
                if (bunny.faces[i].material === key) {
                    specular5.push(bunny.specularMap.get(key));
                }
            }
        }
    }

    // bind buffer
    pushData(position5, positionBuffer5)
    pushData(normal5, normalBuffer5);
    pushData2(material5, materialBuffer5);
    pushData2(specular5, specularBuffer5);

    // get vertex count
    vertexCount5 = flatten2(position5).length / 4;

}

/**
 * Draw stop sign
 */
function drawStopSign() {

    // set useTexture
    let useTextureLocation = gl.getUniformLocation(program, "useTexture");
    gl.uniform1i(useTextureLocation, stopSign.textured);

    // bind buffer and enable vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
    enableVertex("vPosition", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer1);
    enableVertex("vNormal", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer1);
    enableVertex("vTexCoord", 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer1);
    enableVertex("vColor", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, specularBuffer1);
    enableVertex("vSpecular", 4);

    // draw
    if (phongShading) { // lighting
        for (let i = 0; i < vertexCount1; i += 3) {
            pushLighting(1, i);
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    } else {
        for (let i = 0; i < vertexCount1; i += 3) {
            ambientProduct = mult(lightAmbient, material1[i]);
            pushUniform(ambientProduct, "ambientProduct");
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    }

}

/**
 * Draw lamp
 */
function drawLamp() {

    // set useTexture
    let useTextureLocation = gl.getUniformLocation(program, "useTexture");
    gl.uniform1i(useTextureLocation, lamp.textured);

    // bind buffer and enable vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
    enableVertex("vPosition", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer2);
    enableVertex("vNormal", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer2);
    enableVertex("vColor", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, specularBuffer2);
    enableVertex("vSpecular", 4);

    // disable not needed vertex
    disableVertex("vTexCoord");

    // lighting
    if (phongShading) {
        for (let i = 0; i < vertexCount2; i += 3) {
            pushLighting(2, i);
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    } else {
        for (let i = 0; i < vertexCount2; i += 3) {
            ambientProduct = mult(lightAmbient, material2[i]);
            pushUniform(ambientProduct, "ambientProduct");
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    }

}

/**
 * Draw car
 */
function drawCar() {

    // set useTexture
    let useTextureLocation = gl.getUniformLocation(program, "useTexture");
    gl.uniform1i(useTextureLocation, car.textured);

    // bind buffer and enable vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer3);
    enableVertex("vPosition", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer3);
    enableVertex("vNormal", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer3);
    enableVertex("vColor", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, specularBuffer3);
    enableVertex("vSpecular", 4);

    // disable not needed vertex
    disableVertex("vTexCoord");

    // lighting
    if (phongShading) {
        for (let i = 0; i < vertexCount3; i += 3) {
            pushLighting(3, i);
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    } else {
        for (let i = 0; i < vertexCount3; i += 3) {
            ambientProduct = mult(lightAmbient, material3[i]);
            pushUniform(ambientProduct, "ambientProduct");
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    }

}

/**
 * Draw street
 */
function drawStreet() {

    // set useTexture
    let useTextureLocation = gl.getUniformLocation(program, "useTexture");
    gl.uniform1i(useTextureLocation, street.textured);

    // bind buffer and enable vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer4);
    enableVertex("vPosition", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer4);
    enableVertex("vNormal", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer4);
    enableVertex("vColor", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, specularBuffer4);
    enableVertex("vSpecular", 4);

    // disable not needed vertex
    disableVertex("vTexCoord");

    if (phongShading) {
        for (let i = 0; i < vertexCount4; i += 3) {
            pushLighting(4, i);
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    } else {
        for (let i = 0; i < vertexCount4; i += 3) {
            ambientProduct = mult(lightAmbient, material4[i]);
            pushUniform(ambientProduct, "ambientProduct");
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    }

}

/**
 * Draw bunny
 */
function drawBunny() {

    // set useTexture
    let useTextureLocation = gl.getUniformLocation(program, "useTexture");
    gl.uniform1i(useTextureLocation, bunny.textured);

    // bind buffer and enable vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer5);
    enableVertex("vPosition", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer5);
    enableVertex("vNormal", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer5);
    enableVertex("vColor", 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, specularBuffer5);
    enableVertex("vSpecular", 4);

    // disable not needed vertex
    disableVertex("vTexCoord");

    // draw
    if (phongShading) {
        for (let i = 0; i < vertexCount5; i += 3) {
            pushLighting(5, i);
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    } else {
        for (let i = 0; i < vertexCount5; i += 3) {
            ambientProduct = mult(lightAmbient, material5[i]);
            pushUniform(ambientProduct, "ambientProduct");
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }
    }

}

/**
 * Draw shadow
 * @param object
 */
function drawShadow(object) {
    let loc1 = gl.getUniformLocation(program, "vShadowOn");
    gl.uniform1i(loc1, 1);
    let loc2 = gl.getUniformLocation(program, "fShadowOn");
    gl.uniform1i(loc2, 1);

    if (object === stopSign) {
        drawStopSign();
    } else if (object === car) {
        drawCar();
    }

    gl.uniform1i(loc1, 0);
    gl.uniform1i(loc2, 0);
}

/**
 * Draw skybox
 */
function drawSkybox() {
    if (skyBoxOn) {
        // set isSkyBox and disable vNormal
        gl.uniform1i(gl.getUniformLocation(program, "isSkyBox"), 1);
        disableVertex("vNormal");

        // bind buffer and enable vertex
        gl.bindBuffer(gl.ARRAY_BUFFER, pointsArrayCubeBuffer);
        enableVertex("vPosition", 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsArrayBuffer);
        enableVertex("vTexCoord", 2);

        // tranform the cube to be a sky box
        let m = modelMatrix;
        pushMatrix(mult(scalem(25, 25, 25), mat4()), "modelMatrix");

        // Draw different images for each face
        for (let i = 0; i < 36; i += 3) {
            gl.uniform1i(gl.getUniformLocation(program, "vFaceIndex"), i / 6);
            gl.drawArrays(gl.TRIANGLES, i,  3);
        }

        // set !isSkyBox, reset model matrix back, re-enable vNormal
        gl.uniform1i(gl.getUniformLocation(program, "isSkyBox"), 0);
        pushMatrix(m, "modelMatrix");
        enableVertex("vNormal", 4);
    }
}

/**
 * Draw reflection
 * @param object
 */
function drawReflection(object) {

    pushMatrix((inverse(cameraMatrix)), "cameraInverseMatrix");


    let loc1 = gl.getUniformLocation(program, "reflectionOn");
    gl.uniform1i(loc1, 1);

    if (object === bunny) {
        drawBunny();
    } else if (object === car) {
        drawCar();
    }

    gl.uniform1i(loc1, 0);

}

/**
 * Push flat lighting
 */
function pushFlatLighting() {
    if (!phongShading) {
        diffuseProduct = vec4(0,0,0,1);
        specularProduct = vec4(0,0,0,1);
        pushUniform(diffuseProduct, "diffuseProduct");
        pushUniform(specularProduct, "specularProduct");
    }
}

/**
 * Push phong lighting for objects
 * @param object
 * @param i
 */
function pushLighting(object, i) {

    if (object === 1) {
        diffuseProduct = mult(lightDiffuse, material1[i]);
        specularProduct = mult(lightSpecular, specular1[i]);
        ambientProduct = mult(lightAmbient, material1[i]);
    }
    else if (object === 2) {
        diffuseProduct = mult(lightDiffuse, material2[i]);
        specularProduct = mult(lightSpecular, specular2[i]);
        ambientProduct = mult(lightAmbient, material2[i]);
    }
    else if (object === 3) {
        diffuseProduct = mult(lightDiffuse, material3[i]);
        specularProduct = mult(lightSpecular, specular3[i]);
        ambientProduct = mult(lightAmbient, material3[i]);
    }
    else if (object === 4) {
        diffuseProduct = mult(lightDiffuse, material4[i]);
        specularProduct = mult(lightSpecular, specular4[i]);
        ambientProduct = mult(lightAmbient, material4[i]);
    }
    else if (object === 5) {
        diffuseProduct = mult(lightDiffuse, material5[i]);
        specularProduct = mult(lightSpecular, specular5[i]);
        ambientProduct = mult(lightAmbient, material5[i]);

    }

    pushUniform(diffuseProduct, "diffuseProduct");
    pushUniform(specularProduct, "specularProduct");
    pushUniform(ambientProduct, "ambientProduct");

}

/**
 * Camera animation calculations
 */
function calculateCameraInitialAngle() {
    let x = initialCameraPosition[0];
    let z = initialCameraPosition[2];
    initialCameraAngle = Math.atan2(z, x);
    cameraAngle = initialCameraAngle;
}
function updateCameraPosition() {
    if (cameraAnimation) {
        let deltaTime = 0.005;
        cameraAngle += deltaTime;
        cameraPosition[0] = cameraRadius * Math.cos(cameraAngle);
        cameraPosition[2] = cameraRadius * Math.sin(cameraAngle);
        cameraPosition[1] = cameraHeight + bobbingHeight * Math.sin(cameraAngle * bobbingFrequency);
    }
    if (cameraAttached) {
        let cameraOffset = translate(-0.05, 1, 1.2);
        let carTransform = carPosition;
        let newCameraMatrix = mult(carTransform, cameraOffset);
        cameraPosition = vec3(newCameraMatrix[0][3], newCameraMatrix[1][3], newCameraMatrix[2][3]);
        let forwardOffset = vec3(
            carTransform[0][2],
            carTransform[1][2],
            carTransform[2][2]  
        );
        currentAt = add(cameraPosition, forwardOffset);

    }
}

/**
 * Car animation calculations
 */
function calculateCarInitialAngle() {
    let x = initialCarPosition[0];
    let z = initialCarPosition[2];
    initialCarAngle = Math.atan2(z, x);
    carAngle = initialCarAngle;
}
function updateCarPosition() {
    if (carAnimation) {
        let deltaTime = 0.005;
        carAngle -= deltaTime;
        let x = carRadius * Math.cos(carAngle);
        let z = carRadius * Math.sin(carAngle);
        let y = initialCarPosition[1];
        carPosition = mult(translate(x, y, z), rotateY((-carAngle + Math.PI) * (180 / Math.PI)));
    }
}

/**
 * shadow calculations
 */
function pushShadow() {
    if (shadowOn) {
        let lightProjection = mat4();
        lightProjection[3][3] = 0;
        lightProjection[3][1] = -1/lightPosition[1];
        shadowMatrix = mult(lightProjection, translate(-lightPosition[0], -lightPosition[1], -lightPosition[2]));
        shadowMatrix = mult(translate(lightPosition[0], lightPosition[1], lightPosition[2]), shadowMatrix);
    } else {
        shadowMatrix = mat4();
    }
}

/**
 * Handle keyboard events and updates the scene
 * s switch shadow on/off
 * d switch eagle view/car hood view
 * c start/stop camera animation
 * m start/stop car animation
 * l switch phong/flat shading
 * e switch skybox on/off
 * r switch car reflection on/off
 * f switch bunny reflection on/off
 * @param evt the keyboard event
 */
function handleKeyPress(evt) {
    switch(evt.code) {
        case "KeyL":
            phongShading = !phongShading
            let phongShadingLocation = gl.getUniformLocation(program, "phongShading");
            gl.uniform1i(phongShadingLocation, phongShading);
            if (!phongShading) {
                shadowOn = false;
                pushShadow();
                pushFlatLighting();
            }
            break;
        case "KeyC":
            cameraAttached = false;
            cameraPosition = initialCameraPosition;
            cameraAnimation = !cameraAnimation;
            break;
        case "KeyM":
            carAnimation = !carAnimation;
            updateMusic();
            break;
        case "KeyD":
            cameraAnimation = false;
            cameraAttached = !cameraAttached;
            if(!cameraAttached) {
                cameraPosition = initialCameraPosition;
                currentAt = at;
            }
            break;
        case "KeyS":
            if (phongShading) {
                shadowOn = !shadowOn;
                pushShadow();
            }
            break;
        case "KeyE":
            skyBoxOn = !skyBoxOn;
            break;
        case "KeyR":
            if (skyBoxOn) {
                carReflectionOn = !carReflectionOn;
            }
            break;
        case "KeyF":
            if (skyBoxOn) {
                bunnyReflectionOn = !bunnyReflectionOn;
            }
            break;
    }
}

/**
 * Play music according to car animation on/off
 */
function updateMusic() {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    if (audioElement.paused) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
}

let image1, image2, image3, image4, image5;

/**
 * Load the skybox images
 */
function loadSkyBox() {
    loadSkyBoxPositiveX();
}
function loadSkyBoxPositiveX() {
    let image = new Image();
    image.crossOrigin = "";
    image.src = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/skybox_posx.png";
    image.onload = function() {
        images[0] = image;
        configureTexture2(image);
        loadSkyBoxNegativeX();
    }
}
function loadSkyBoxNegativeX() {
    let image = new Image();
    image.crossOrigin = "";
    image.src = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/skybox_negx.png";
    image.onload = function() {
        images[1] = image;
        configureTexture3(image);
        loadSkyBoxPositiveY();
    }
}
function loadSkyBoxPositiveY() {
    let image = new Image();
    image.crossOrigin = "";
    image.src = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/skybox_posy.png";
    image.onload = function() {
        images[2] = image;
        configureTexture4(image);
        loadSkyBoxNegativeY();
    }
}
function loadSkyBoxNegativeY() {
    let image = new Image();
    image.crossOrigin = "";
    image.src = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/skybox_negy.png";
    image.onload = function() {
        images[3] = image;
        configureTexture5(image);
        loadSkyBoxPositiveZ();
    }
}
function loadSkyBoxPositiveZ() {
    let image = new Image();
    image.crossOrigin = "";
    image.src = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/skybox_posz.png";
    image.onload = function() {
        images[4] = image;
        configureTexture6(image);
        loadSkyBoxNegativeZ();
    }
}
function loadSkyBoxNegativeZ() {
    let image = new Image();
    image.crossOrigin = "";
    image.src = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/skybox_negz.png";
    image.onload = function() {
        images[5] = image;
        configureTexture7(image);
        configureCubeMap();
        renderRecursiveWay();
    }
}


function configureCubeMap() {
    let cubeMap = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    console.log(images[0]);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[0]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[1]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[2]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[3]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[4]);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[5]);

    let textureLocation = gl.getUniformLocation(program, "texMap");
    gl.uniform1i(textureLocation, 0);


}


/**
 * Configure the skybox images
 * @param image
 */
function configureImage(image) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
function configureTexture2(image) {
    texture2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.uniform1i(gl.getUniformLocation(program, "tex2"), 2);
    configureImage(image);
}
function configureTexture3(image) {
    texture3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.uniform1i(gl.getUniformLocation(program, "tex3"), 3);
    configureImage(image);
}
function configureTexture4(image) {
    texture4 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.uniform1i(gl.getUniformLocation(program, "tex4"), 4);
    configureImage(image);
}
function configureTexture5(image) {
    texture5 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, texture5);
    gl.uniform1i(gl.getUniformLocation(program, "tex5"), 5);
    configureImage(image);
}
function configureTexture6(image) {
    texture6 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, texture6);
    gl.uniform1i(gl.getUniformLocation(program, "tex6"), 6);
    configureImage(image);
}
function configureTexture7(image) {
    texture7 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, texture7);
    gl.uniform1i(gl.getUniformLocation(program, "tex7"), 2);
    configureImage(image);
}

/**
 * Create skybox cube
 */
function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 0, 4, 7, 3);
    quad( 5, 1, 2, 6 );
    quad( 6, 7, 4, 5 );
    quad( 5, 4, 0, 1 );
}
function quad(a, b, c, d) {
    let minT = 0.0;
    let maxT = 1.0;
    let texCoord = [
        vec2(minT, minT),
        vec2(minT, maxT),
        vec2(maxT, maxT),
        vec2(maxT, minT)
    ];
    let vertices = [
        vec4( -1, -1,  1, 1.0 ),
        vec4( -1,  1,  1, 1.0 ),
        vec4(  1,  1,  1, 1.0 ),
        vec4(  1, -1,  1, 1.0 ),
        vec4( -1, -1, -1, 1.0 ),
        vec4( -1,  1, -1, 1.0 ),
        vec4(  1,  1, -1, 1.0 ),
        vec4(  1, -1, -1, 1.0 )
    ];
    pointsArrayCube.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    pointsArrayCube.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    pointsArrayCube.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    pointsArrayCube.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    pointsArrayCube.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    pointsArrayCube.push(vertices[d]);
    texCoordsArray.push(texCoord[3]);
    pointsArrayCubeBuffer = gl.createBuffer();
    pushData2(pointsArrayCube, pointsArrayCubeBuffer);
    enableVertex("vPosition", 4);
    texCoordsArrayBuffer = gl.createBuffer();
    pushData2(texCoordsArray, texCoordsArrayBuffer);
    enableVertex("vTexCoord", 2);
}

/**
 * Wait until the model is loaded
 * @param Model the model
 * @returns {Promise<unknown>} Continue waiting or not
 */
function waitForModel(Model) {
    return new Promise(resolve => {
        let checkInterval = setInterval(() => {
            if (Model.objParsed && Model.mtlParsed) {
                clearInterval(checkInterval); // Stop checking
                resolve(); // Continue execution
            }
        }, 100); // Check every 100ms
    });
}

/** inverse model matrix when camera is on car hood
 * @returns {*}
 */
function applyInverseTransformation() {
    let inverseModelMatrix = inverse(modelMatrix);
    let cameraTransformed = mult(inverseModelMatrix, vec4(cameraPosition[0], cameraPosition[1], cameraPosition[2], 1));
    return vec3(cameraTransformed[0], cameraTransformed[1], cameraTransformed[2]);
}

/**
 * Load the music in
 */
function loadMusic() {
    audioContext = new window.AudioContext();
    audioElement = document.getElementById("audioElement");
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);
    audioElement.loop = true;
}

/**
 * Push the matrix
 * @param data is the matrix
 * @param uniformName is the name of the shader matrix that data belongs to
 */
function pushMatrix(data, uniformName) {
    let matrixLoc = gl.getUniformLocation(program, uniformName);
    gl.uniformMatrix4fv(matrixLoc, false, flatten(data));
}

/**
 * Push the vec4
 * @param data is the vec4
 * @param uniformName is the name of the vec4 that data belongs to
 */
function pushUniform(data, uniformName) {
    let loc = gl.getUniformLocation(program, uniformName);
    gl.uniform4fv(loc, flatten(data));
}

/**
 * Push data
 * @param data is the data of the attribute
 * @param buffer is the buffer
 *
 */
function pushData(data, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten2(data), gl.STATIC_DRAW);
}
function pushData2(data, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW);
}

/**
 * Enable vertex
 * @param attName attribute name
 * @param size size of the attribute
 */
function enableVertex(attName, size) {
    let attrib = gl.getAttribLocation(program, attName);
    gl.vertexAttribPointer(attrib, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrib);
}

/**
 * Disable vertex
 * @param attName attribute name
 */
function disableVertex(attName) {
    let attrib = gl.getAttribLocation(program, attName);
    gl.disableVertexAttribArray(attrib);
}
