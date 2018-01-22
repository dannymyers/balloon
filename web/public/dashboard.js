var socket = io();

function createCube(elementName){

  //https://www.slideshare.net/fwdays/fun-with-javascript-and-sensors-by-jan-jongboom
  var container = document.getElementById(elementName);  
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( 100, 100 );
  container.appendChild(renderer.domElement);
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(
		35,			// Field of view
		100 / 100,	// Aspect ratio
		0.1,		// Near
		10000		// Far
	);
	camera.position.set( 10, 10, 10 );
  camera.lookAt( scene.position );
  
  var geometry = new THREE.BoxGeometry( 5, 5, 5 );

  var s1 = new THREE.MeshBasicMaterial({color: 0xFF0000});
  var s2 = new THREE.MeshBasicMaterial({color: 0x00FF000});
  var s3 = new THREE.MeshBasicMaterial({color: 0x0000FF});
  var s4 = new THREE.MeshBasicMaterial({color: 0xFF00FF});
  var s5 = new THREE.MeshBasicMaterial({color: 0x00FFFF});
  var s6 = new THREE.MeshBasicMaterial({color: 0xFFFF00});
  
  //var material = new THREE.MeshLambertMaterial( { color: 0x876878 } );
  var material = [s1, s2, s3, s4, s5, s6];
  var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

  var light = new THREE.PointLight( 0xFFFF00 );
	light.position.set( 10, 0, 10 );
  scene.add( light );

  renderer.setClearColor( 0xdddddd, 1);
  renderer.render( scene, camera );

  return { mesh: mesh, scene: scene, renderer: renderer, camera: camera };
}

var vm = new Vue({
  el: '#app',
  data: {
    sensor: {
      currentExternalTemperature: 0,
      currentInternalTemperature: 0,
      currentPressure: 0,
      maxExternalTemperature: 0,
      maxInternalTemperature: 0,
      maxPressure: 0,
      minExternalTemperature: 0,
      minInternalTemperature: 0,
      minPressure: 0,
      time: ''
    }
  },
  created: function() {
    var gyroScene = createCube("gyro");
    var accelScene = createCube("accel");
    var rotationScene = createCube("rotation");
    socket.on('update-telemetry', function(sensorData) {
      //console.log(sensorData);
      this.sensor = sensorData;

      /*
      var M_PI = 3.14159265358979323846;
      var accelerationX = sensorData.gyroData.accel.x;
      var accelerationY = sensorData.gyroData.accel.y;
      var accelerationZ = sensorData.gyroData.accel.z;
      
      var pitch = 180 * Math.atan (accelerationX/Math.sqrt(accelerationY*accelerationY + accelerationZ*accelerationZ))/M_PI;
      var roll = 180 * Math.atan (accelerationY/Math.sqrt(accelerationX*accelerationX + accelerationZ*accelerationZ))/M_PI;
      var yaw = 180 * Math.atan (accelerationZ/Math.sqrt(accelerationX*accelerationX + accelerationZ*accelerationZ))/M_PI;

      sensorData.gyroData.rotation.x = pitch;
      sensorData.gyroData.rotation.y = roll;
      sensorData.gyroData.rotation.z = yaw;      
      */

      gyroScene.mesh.rotation.x = sensorData.gyroData.gyro.x  / 60;
      gyroScene.mesh.rotation.y = sensorData.gyroData.gyro.y  / 60;
      gyroScene.mesh.rotation.z = sensorData.gyroData.gyro.z  / 60;
      gyroScene.renderer.render( gyroScene.scene, gyroScene.camera );

      accelScene.mesh.rotation.x = sensorData.gyroData.accel.x  / 60;
      accelScene.mesh.rotation.y = sensorData.gyroData.accel.y  / 60;
      accelScene.mesh.rotation.z = sensorData.gyroData.accel.z  / 60;
      accelScene.renderer.render( accelScene.scene, accelScene.camera );

      rotationScene.mesh.rotation.x = sensorData.gyroData.rotation.x  / 60;
      rotationScene.mesh.rotation.y = sensorData.gyroData.rotation.y  / 60;
      rotationScene.mesh.rotation.z = sensorData.gyroData.rotation.z  / 60;
      rotationScene.renderer.render( rotationScene.scene, rotationScene.camera );
            
    }.bind(this));
  }
});