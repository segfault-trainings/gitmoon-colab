///
/// gitmoon - A demo projects for segfault-trainings Git workshop
///
/// Licensed under Creative Commons Attribution Share Alike 4.0 International
/// See https://github.com/segfault-trainings/gitworkshop/blob/master/LICENSE
///
"use strict";

// context for all "global" three.js objects
let ctx = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000),
    renderer: new THREE.WebGLRenderer({ antialias: true }),
    textureLoader: new THREE.TextureLoader(),
    moons: [],
    texts: [],
};

// create moons
new Moon("fuchsia");

// __INSERT_MOON_HERE__

// Function to setup the scene for our awesome moons :)
setup();
function setup() {
    // setup the scene, camera and renderer
    ctx.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( ctx.renderer.domElement );
    new THREE.OrbitControls( ctx.camera, ctx.renderer.domElement );
    ctx.camera.position.z = 10;

    // set space background
    var spaceGeometry = new THREE.SphereGeometry(500, 50, 50);
    var spaceMaterial = new THREE.MeshPhongMaterial({
      map: ctx.textureLoader.load(spaceImage),
      side: THREE.DoubleSide,
      shininess: 0
    });
    var space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    ctx.scene.add(space);

    // create an ambient lighting
    let ambientLight = new THREE.AmbientLight(0x888888)
    ctx.scene.add(ambientLight);

    // create a directional lighting
    let directionalLight = new THREE.DirectionalLight(0xFDFCF0, 1)
    directionalLight.position.set(20, 10, 20)
    ctx.scene.add(directionalLight);

    // create a renderer for our scene
    let render = function() {
        ctx.moons.forEach(function(moon, i) {
            // rotate the moon on the X- and Y-Axis
            moon.rotation.x += 0.005;
            moon.rotation.y += 0.005;

            // position the moon according to its index in the moon-registry
            moon.position.x = -5 * i;
            moon.position.z = -5 * i;
        });

        ctx.texts.forEach(function(text, i) {
            if (text) {
                text.position.x = -5 * i;
                text.position.z = -5 * i;
                text.position.y = 2;
            }
        });

	ctx.renderer.render(ctx.scene, ctx.camera);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
};

// Function to create a new moon on the scene
function Moon(color, text) {
    // create the moon gemoetry
    let geometry = new THREE.SphereGeometry(2, 50, 50);
    // load moon textures
    let moonTexture = ctx.textureLoader.load(moonImage);
    const loader = new THREE.FontLoader();


    let moonDisplacementMap = ctx.textureLoader.load(moondisplacementImage);
    // create the moon material
    let material = new THREE.MeshPhongMaterial({
        color: color,
        map: moonTexture,
        displacementMap: moonDisplacementMap,
        displacementScale: 0.06,
        bumpMap: moonDisplacementMap,
        bumpScale: 0.04,
        specular: 0x333333,
        shininess: 25,
    });

    let moon = new THREE.Mesh(geometry, material);
    ctx.moons.push(moon);
    ctx.scene.add(moon);

    if (text) {
        let textSprite = makeTextSprite(text, {
            fontsize: 20,
            textColor: {
                r: 255,
                g: 255,
                b: 255,
                a: 1.0
            }
        });

        ctx.texts.push(textSprite);
        ctx.scene.add(textSprite);
    } else {
        ctx.texts.push(undefined);
    }

    return moon;
};


function makeTextSprite( message, parameters ) {
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:0, g:0, b:255, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    ctx.camera.aspect = window.innerWidth / window.innerHeight;
    ctx.camera.updateProjectionMatrix();
    ctx.renderer.setSize(window.innerWidth, window.innerHeight);
}
