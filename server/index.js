const bleno = require('bleno');

const ROBOT_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const BATTERY_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';
const POSITION_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef2';
const STATUS_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef3';

console.log('Bleno - Robot BLE Server');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('RobotBLEServer', [ROBOT_SERVICE_UUID]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new bleno.PrimaryService({
        uuid: ROBOT_SERVICE_UUID,
        characteristics: [
          new bleno.Characteristic({
            uuid: BATTERY_CHARACTERISTIC_UUID,
            properties: ['read', 'notify'],
            value: Buffer.from([Math.floor(Math.random() * 100)]), // Initial random battery
            onReadRequest: function(offset, callback) {
              const batteryLevel = Math.floor(Math.random() * 100);
              console.log('Battery Characteristic Read: ' + batteryLevel + '%');
              callback(this.RESULT_SUCCESS, Buffer.from([batteryLevel]));
            },
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('Battery Characteristic Subscribe');
              this.batteryInterval = setInterval(() => {
                const batteryLevel = Math.floor(Math.random() * 100);
                console.log('Battery Notification: ' + batteryLevel + '%');
                updateValueCallback(Buffer.from([batteryLevel]));
              }, 5000); // Notify every 5 seconds
            },
            onUnsubscribe: function() {
              console.log('Battery Characteristic Unsubscribe');
              if (this.batteryInterval) {
                clearInterval(this.batteryInterval);
                this.batteryInterval = null;
              }
            }
          }),
          new bleno.Characteristic({
            uuid: POSITION_CHARACTERISTIC_UUID,
            properties: ['read', 'notify'],
            value: Buffer.from(JSON.stringify({ x: 0, y: 0, z: 0 })), // Initial position
            onReadRequest: function(offset, callback) {
              const position = {
                x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100),
                z: Math.floor(Math.random() * 100)
              };
              console.log('Position Characteristic Read: ' + JSON.stringify(position));
              callback(this.RESULT_SUCCESS, Buffer.from(JSON.stringify(position)));
            },
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('Position Characteristic Subscribe');
              this.positionInterval = setInterval(() => {
                const position = {
                  x: Math.floor(Math.random() * 100),
                  y: Math.floor(Math.random() * 100),
                  z: Math.floor(Math.random() * 100)
                };
                console.log('Position Notification: ' + JSON.stringify(position));
                updateValueCallback(Buffer.from(JSON.stringify(position)));
              }, 3000); // Notify every 3 seconds
            },
            onUnsubscribe: function() {
              console.log('Position Characteristic Unsubscribe');
              if (this.positionInterval) {
                clearInterval(this.positionInterval);
                this.positionInterval = null;
              }
            }
          }),
          new bleno.Characteristic({
            uuid: STATUS_CHARACTERISTIC_UUID,
            properties: ['read', 'notify'],
            value: Buffer.from('idle'), // Initial status
            onReadRequest: function(offset, callback) {
              const statuses = ['idle', 'moving', 'charging', 'error'];
              const status = statuses[Math.floor(Math.random() * statuses.length)];
              console.log('Status Characteristic Read: ' + status);
              callback(this.RESULT_SUCCESS, Buffer.from(status));
            },
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('Status Characteristic Subscribe');
              this.statusInterval = setInterval(() => {
                const statuses = ['idle', 'moving', 'charging', 'error'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                console.log('Status Notification: ' + status);
                updateValueCallback(Buffer.from(status));
              }, 7000); // Notify every 7 seconds
            },
            onUnsubscribe: function() {
              console.log('Status Characteristic Unsubscribe');
              if (this.statusInterval) {
                clearInterval(this.statusInterval);
                this.statusInterval = null;
              }
            }
          })
        ]
      })
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});

bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});

bleno.on('accept', function(clientAddress) {
  console.log('on -> accept, client: ' + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
  console.log('on -> disconnect, client: ' + clientAddress);
});
