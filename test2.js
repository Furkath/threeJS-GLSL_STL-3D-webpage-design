let container, stats;

let camera, cameraTarget, scene, renderer;

let tou;
let jiao=[];
let meshB=[];
let wei;
let bnum;
let plane;

var base = Math.sqrt(30*30+3*3);

var clock = new THREE.Clock();
var runtime = new ShaderFrogRuntime();

var longShadert = 'MeronSoda_s_BRDF.json';
var longShaderb = 'MeronSoda_s_BRDF_copper.json';
var longShaderj = 'MeronSoda_s_BRDF_red.json';

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 3, 0.15, 3 );

    cameraTarget = new THREE.Vector3( 0, - 0.25, 0 );

    scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0x72645b );
    //scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

    // Ground

    //var planeG = new THREE.PlaneGeometry(140,140);//( 140,140 );
    //var planeG = new THREE.SphereGeometry( 100, 20, 20 );
    var planeG = new THREE.BoxGeometry( 100, 100, 100 );
    plane =  new THREE.Mesh(planeG);//, new THREE.MeshBasicMaterial({color: 0x72645b}));
    runtime.load([
        'Star_Field.json'
        //'Pause_Screen_Background.json'
    ], function(shaders) {
        mtlt = runtime.get(shaders[0].name);
        plane.material = mtlt;
        plane.material.side = THREE.BackSide;
    });

    //const plane = new THREE.Mesh(
    //    new THREE.PlaneGeometry( 400, 400 ),
    //    new THREE.MeshPhongMaterial( { color: 0xcbcbcb, specular: 0x474747 } )
    //);
    //plane.rotation.x = - Math.PI / 2;
    //plane.rotation.y =  Math.PI / 3;
    //plane.position.y = 10;
    //plane.position.x = -50;
    scene.add( plane );

    plane.receiveShadow = true;


    // ASCII file

    const loader = new THREE.STLLoader();


    var meshBalls = [];
    for (let id = 0; id<200;id++)
    {
    var ball = new THREE.SphereGeometry( 0.06+0.06*Math.random(), 20, 20 );
    meshBalls.push( new THREE.Mesh( ball ) );
    meshBalls[id].position.x = -20+40*Math.random();
    meshBalls[id].position.z = -20+40*Math.random();
    meshBalls[id].position.y = -4+8*Math.random()-5;
    meshBalls[id].rotation.x = Math.PI*(1-2*Math.random());
    meshBalls[id].rotation.z = Math.PI*(1-2*Math.random());
    meshBalls[id].rotation.y = Math.PI*(1-2*Math.random());

    }

    var RGB = [];
    var mltBalls = [];
    for (let id = 0; id<200;id++)
    {
        RGB.push ({
            "r": Math.random(), 
            "g": Math.random(), 
            "b": Math.random() 
        } );
        runtime.load([
            'dash/'+id.toString()+'.json'
        ], function(shaders) {
            mltBalls.push ( runtime.get(shaders[0].name) );
            mltBalls[id].uniforms.image.value = new THREE.ImageUtils.loadTexture('./thumb_contrast-noise.png');
            mltBalls[id].uniforms.Caustic_Image_Based1542394968990_145_color.value = RGB[id];
            mltBalls[id].uniforms.brightness.value = 4;
            meshBalls[id].material = mltBalls[id];
            scene.add( meshBalls[id] );
        });   
        
    }

    /*let rgbvalue = {
        "r": Math.random(), 
        "g": Math.random(), 
        "b": Math.random() 
    };
    runtime.load([
        'Fork_of_Nuetral.json'
    ], function(shaders) {
        var mltBalls = runtime.get(shaders[0].name) ;
        mltBalls.uniforms.image.value = new THREE.ImageUtils.loadTexture('./thumb_contrast-noise.png');
        for (let id = 0; id<200;id++)
        {
            mltBalls.uniforms.Caustic_Image_Based1542394968990_145_color.value = rgbvalue;
            meshBalls[id].material = mltBalls;
        }
    }); */

    /*// Binary files

    const material = new THREE.MeshPhongMaterial( { color: 0xd5d5d5, specular: 0x494949, shininess: 200 } );

    loader.load( './models/stl/binary/pr2_head_pan.stl', function ( geometry ) {

        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.set( 0, - 0.37, - 0.6 );
        mesh.rotation.set( - Math.PI / 2, 0, 0 );
        mesh.scale.set( 2, 2, 2 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add( mesh );

    } );

    loader.load( './models/stl/binary/pr2_head_tilt.stl', function ( geometry ) {

        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.set( 0.136, - 0.37, - 0.6 );
        mesh.rotation.set( - Math.PI / 2, 0.3, 0 );
        mesh.scale.set( 2, 2, 2 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add( mesh );

    } );*/

    /*// Colored binary STL
    loader.load( './models/stl/binary/colored.stl', function ( geometry ) {

        let meshMaterial = material;

        if ( geometry.hasColors ) {

            meshMaterial = new THREE.MeshPhongMaterial( { opacity: geometry.alpha, vertexColors: true } );

        }

        const mesh = new THREE.Mesh( geometry, meshMaterial );

        mesh.position.set( 0.5, 0.2, 0 );
        mesh.rotation.set( - Math.PI / 2, Math.PI / 2, 0 );
        mesh.scale.set( 0.3, 0.3, 0.3 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add( mesh );

    } );*/

    loader.load( 
        './tou.stl', 
        //'./output.stl',
        function ( geometry ) {
        //const material = new THREE.MeshPhongMaterial( { color: 0xff9c7c, specular: 0x494949, shininess: 200 } );
        tou =  new THREE.Mesh( geometry) ;//, material );
        runtime.load([
            longShadert
            //'GradientPaintingShader.json'
            ], function(shaders) {
            mtl = runtime.get(shaders[0].name);
            tou.material = mtl;          
        });
        tou.scale.set( 0.15, 0.15, 0.15 );
        tou.position.set( 0, 5, 0 );
        tou.rotation.set( - Math.PI / 2,  0,  0 );
        scene.add( tou );
    } );

    for (let i =0; i<4; i++)
    {
        var selc;
        if (i==0 || i==2) 
        {selc = './jiao.stl';} 
        else 
        {selc = './jiao2.stl';}
        loader.load( 
        selc,
        //'./jiao.stl', 
        //'./output.stl',
        function ( geometry ) {
        //const material = new THREE.MeshPhongMaterial( { color: 0xff9c7c, specular: 0x494949, shininess: 200 } );
        jiao.push (  new THREE.Mesh( geometry) );//, material );
        runtime.load([
            longShaderj
            //'GradientPaintingShader.json'
            ], function(shaders) {
            mtl = runtime.get(shaders[0].name);
            jiao[i].material = mtl;          
        });
        jiao[i].scale.set( 0.12, 0.12, 0.12 );
        jiao[i].position.set( 0, 5, 0 );
        jiao[i].rotation.set( - Math.PI / 2,  0,  -Math.PI / 2 );
        scene.add( jiao[i] );
    } );
    }

    bnum =14;
    for (let i =0; i<bnum; i++)
    {
    loader.load( 
        //'./output.stl', 
        './bodyy.stl', 
        function ( geometry ) {
        //const material = new THREE.MeshPhongMaterial( { color: 0xff9c7c, specular: 0x494949, shininess: 200 } );
        meshB.push( new THREE.Mesh( geometry) );//, material );

        runtime.load([
            longShaderb
            //'GradientPaintingShader.json'
            ], function(shaders) {
            mtl = runtime.get(shaders[0].name);

            meshB[i].material = mtl;
           
        });

        //mesh.rotation.set( 0, - Math.PI / 2, 0 );

        //meshB[i].scale.set( 0.5, 0.25, 0.5 );
        meshB[i].scale.set( 0.2, 0.1, 0.2 );
        meshB[i].position.set( 0, - 0.25, 0. );
        meshB[i].rotation.set( - Math.PI / 2, 0, 0 );
        //meshB[0].castShadow = true;
        //meshB[0].receiveShadow = true;

        scene.add( meshB[i] );

    } );
    }
    //var meshc = mesh.clone();

    loader.load( 
        './wei.stl', 
        //'./output.stl',
        function ( geometry ) {
        //const material = new THREE.MeshPhongMaterial( { color: 0xff9c7c, specular: 0x494949, shininess: 200 } );
        wei =  new THREE.Mesh( geometry) ;//, material );
        runtime.load([
            longShadert
            //'GradientPaintingShader.json'
            ], function(shaders) {
            mtl = runtime.get(shaders[0].name);
            wei.material = mtl;          
        });
        wei.scale.set( 0.11, 0.11, 0.11 );
        wei.position.set( 0, 0, 0 );
        wei.rotation.set( - Math.PI / 2,  0,  0 );
        scene.add( wei );
    } );
    
    var topGeometry = new THREE.SphereGeometry( 3, 20, 20 );
    meshTop = new THREE.Mesh( topGeometry );
    meshTop.position.y = 10-5;
    runtime.load([
        //'GradientPaintingShader.json'
        //'Fork_of_New_Composed_Shader2.json'
        //'Fork_of_New_Composed_Shader2.json'
        'Sun.json'
    ], function(shaders) {
        mtlt = runtime.get(shaders[0].name);
        //mtlt.uniforms.wavetexture.value = new THREE.ImageUtils.loadTexture('./test.png');
        meshTop.material = mtlt;
    });
    scene.add( meshTop );

/*
    loader.load( 
        './output.stl', 
        function ( geometry ) {
        var met1 =  new THREE.Mesh( geometry) ;    
        runtime.load([
            './Funny_Bunny.json'
            ], function(shaders) {
            mtl = runtime.get(shaders[0].name);
            met1.material = mtl;
        });
        met1.scale.set( 0.5, 0.25, 0.5 );
        met1.position.set( 0, - 0.25, 0. );
        met1.rotation.set( - Math.PI / 2, 0, 0 );
        scene.add( met1 );
    } );

    loader.load( 
        './bodyy.stl', 
        function ( geometry ) {
        var met2 =  new THREE.Mesh( geometry) ;    
        runtime.load([
            './Funny_Bunny.json'
            ], function(shaders) {
            mtl = runtime.get(shaders[0].name);
            met2.material = mtl;
        });
        met2.scale.set( 0.2, 0.2, 0.2 );
        met2.position.set( 0, - 0.25-3, 0. );
        met2.rotation.set( - Math.PI / 2, 0, 0 );
        scene.add( met2 );
    } );
*/


    // Lights

    //scene.add( new THREE.HemisphereLight( 0x8d7c7c, 0x494966, 3 ) );

    //addShadowedLight( 1, 1, 1, 0xffffff, 3.5 );
    //addShadowedLight( 0.5, 1, - 1, 0xffd500, 3 );
    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //renderer.shadowMap.enabled = true;

    container.appendChild( renderer.domElement );

    // stats

    //stats = new Stats();
    //container.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', onWindowResize );
    //document.getElementById('canvas').appendChild(renderer.domElement);

}

function addShadowedLight( x, y, z, color, intensity ) {

    const directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    requestAnimationFrame( animate );

    render();
    //stats.update();

}

function render() {

    //mesh.position.y += 0.001;

    var timeR = clock.getElapsedTime();
    runtime.updateShaders(timeR);
    const timer = 0.0;

    var thetat = 0.2*(timeR + 0.6);
    tou.position.x = Math.cos(thetat)*15;
    tou.position.z = Math.sin(thetat)*15;
    tou.position.y = Math.cos(3*thetat)*1-5+0.5;
   
    if(Math.sin(thetat)>0)
    {
    tou.rotation.y = -Math.atan(Math.sin(3*thetat)*2.*3/15);
    }
    else{
    tou.rotation.y = Math.atan(Math.sin(3*thetat)*2.*3/15);
    }
    tou.rotation.z = -thetat;

    var thetaj = 0.2*(timeR - 1.5);
    jiao[0].position.x = Math.cos(thetaj)*17;
    jiao[0].position.z = Math.sin(thetaj)*17;
    jiao[0].position.y = Math.cos(3*thetaj)*1-2-5;
    //jiao[0].rotation.z = -Math.PI/2;
    if(Math.sin(thetaj)>0)
    {
        jiao[0].rotation.y = -Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    else{
        jiao[0].rotation.y = Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    jiao[0].rotation.z = -thetaj;
    
    jiao[1].position.x = Math.cos(thetaj)*13;
    jiao[1].position.z = Math.sin(thetaj)*13;
    jiao[1].position.y = Math.cos(3*thetaj)*1-2-5;
    //jiao[0].rotation.z = -Math.PI/2;
    if(Math.sin(thetaj)>0)
    {
        jiao[1].rotation.y = -Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    else{
        jiao[1].rotation.y = Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    jiao[1].rotation.z = -thetaj;


     thetaj = 0.2*(timeR - 4.5);
    jiao[2].position.x = Math.cos(thetaj)*17;
    jiao[2].position.z = Math.sin(thetaj)*17;
    jiao[2].position.y = Math.cos(3*thetaj)*1-2-5;
    //jiao[2].rotation.z = -Math.PI/2;
    if(Math.sin(thetaj)>0)
    {
        jiao[2].rotation.y = -Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    else{
        jiao[2].rotation.y = Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    jiao[2].rotation.z = -thetaj;

    jiao[3].position.x = Math.cos(thetaj)*13;
    jiao[3].position.z = Math.sin(thetaj)*13;
    jiao[3].position.y = Math.cos(3*thetaj)*1-2-5;
    //jiao[0].rotation.z = -Math.PI/2;
    if(Math.sin(thetaj)>0)
    {
        jiao[3].rotation.y = -Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    else{
        jiao[3].rotation.y = Math.atan(Math.sin(3*thetaj)*2.*3/15);
    }
    jiao[3].rotation.z = -thetaj;

for(let i =0;i<bnum;i++)
{
    var time = timeR - 0.6*i;
    var theta = 0.2*time;
    if (i > 8)
    {
        meshB[i].scale.x = 0.2 - (i-8)*0.015 ;
        meshB[i].scale.z = 0.2 - (i-8)*0.015 ;
        meshB[i].scale.y = 0.2 - (i-8)*0.02*(  0.3-0.07*Math.abs(Math.cos(3*theta))  );
    }
    else
    {
        meshB[i].scale.y = 0.3-0.07*Math.abs(Math.cos(3*theta));
    }
    meshB[i].position.x = Math.cos(theta)*15;
    meshB[i].position.z = Math.sin(theta)*15;
    meshB[i].position.y = Math.cos(3*theta)*1-5;
    if(Math.sin(theta)>0)
    {
    meshB[i].rotation.y = -Math.atan(Math.sin(3*theta)*2.*3/15);
    }
    else{
    meshB[i].rotation.y = Math.atan(Math.sin(3*theta)*2.*3/15);
    }
    meshB[i].rotation.z = -theta;
}

    var thetaw = 0.2*(timeR - 0.6*bnum+0.1);
    wei.position.x = Math.cos(thetaw)*15;
    wei.position.z = Math.sin(thetaw)*15;
    wei.position.y = Math.cos(3*thetaw)*1-5+0.5-0.5;

    if(Math.sin(thetaw)>0)
    {
    wei.rotation.y = -Math.atan(Math.sin(3*thetaw)*2.*3/15);
    }
    else{
    wei.rotation.y = Math.atan(Math.sin(3*thetaw)*2.*3/15);
    }
    wei.rotation.z = -thetaw;

    //camera.position.x = Math.cos( timer ) * 10;
    //camera.position.z = Math.sin( timer ) * 10;
    camera.position.x = 30+Math.cos(0.3*time)*5;//cos(0.1*time)*5;
    camera.position.y = 0+Math.sin(0.3*time)*5-5;//sin(0.1*time)*5-5;

    var len = Math.sqrt(camera.position.x*camera.position.x+camera.position.y*camera.position.y+9);
    var diff = len-base;
    plane.position.x = camera.position.x*diff/len;
    plane.position.y = camera.position.y*diff/len;
    plane.position.z = camera.position.z*diff/len;
    //meshTop.position.x = camera.position.x*diff/len;
    //meshTop.position.y = camera.position.y*diff/len;
    //meshTop.position.z = camera.position.z*diff/len;

    var angly = Math.atan(camera.position.z/camera.position.x);
    //plane.rotation.y = Math.PI / 3;
    plane.rotation.y =  - angly ;//+ Math.PI / 3;
    //plane.rotateY(Math.PI / 3);
    //meshTop.rotation.y = - angly;//Math.PI / 3 - angly;
    var anglz = Math.atan(
    Math.sqrt(camera.position.y*camera.position.y)
    /
    Math.sqrt(camera.position.x*camera.position.x+camera.position.z*camera.position.z)
    );
    plane.rotation.z = -anglz;
    //meshTop.rotation.z = -anglz;
    //camera.lookAt( cameraTarget );
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.render( scene, camera );

}
