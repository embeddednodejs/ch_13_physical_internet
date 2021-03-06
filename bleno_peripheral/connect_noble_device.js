var async = require('async');

var NobleDevice = require('noble-device');

var TestDevice = function(peripheral) {
  NobleDevice.call(this, peripheral);
};

TestDevice.is = function(device) {
  var localName = device.advertisement.localName;
  return (localName === 'echo');
};

NobleDevice.Util.inherits(TestDevice, NobleDevice);

TestDevice.discover(function(testDevice) {
  console.log('found ' + testDevice.id);

  testDevice.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  async.series([
      function(callback) {
        console.log('connect');
        testDevice.connect(callback);
      },
      function(callback) {
        console.log('discoverServicesAndCharacteristics');
        testDevice.discoverServicesAndCharacteristics(callback);
      },
      function(callback) {
        console.log('readDeviceName');
        testDevice.readDeviceName(function(error, deviceName) {
          console.log('\tdevice name = ' + deviceName);
          callback();
        });
      },
      function(callback) {
        console.log('disconnect');
        testDevice.disconnect(callback);
      }
    ]
  );
});
