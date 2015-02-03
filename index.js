var util = require('util');
var Device = require('zetta-device');

var CAR = module.exports = function(car) {
  this.speed = 0;
  this.car = car;
  Device.call(this);
}

util.inherits(CAR, Device);

CAR.prototype.init = function(config) {
  config
  .type('car')
  .monitor('speed')
  .state('idle')
  .when('idle', { allow: ['startCar'] })
  .when('started', { allow: ['accelerateCar'] })
  .when('halted', { allow: ['accelerateCar'] })
  .when('accelerating', { allow: ['releaseAccelerator'] } )
  .when('cruising', { allow: ['brakeCar', 'accelerateCar'] } )
  .when('braking', { allow: ['releaseBrake'] } )
  .map('startCar', this.startCar)
  .map('accelerateCar', this.accelerateCar)
  .map('releaseAccelerator', this.releaseAccelerator)
  .map('brakeCar', this.brakeCar )
  .map('releaseBrake', this.releaseBrake );
};

CAR.prototype.startCar = function(cb) {
  this.state = 'started';
  cb();
}

CAR.prototype.accelerateCar = function(cb) {
  this.state = 'accelerating';
  var self = this;
  var accelerate;

  accelerate = setInterval(function() {
    if (self.speed == 150) {
      clearInterval(accelerate);
    }
    else if (self.state == "cruising") {
      clearInterval(accelerate);
    }
    else {
      self.speed++;
    }
  }, 500);

  cb();
}

CAR.prototype.releaseAccelerator = function(cb) {
  this.state = 'cruising';
  cb();
}

CAR.prototype.brakeCar = function(cb) {
  this.state = 'braking';
  var self = this;
  var brake;

  brake = setInterval(function() {
    if (self.speed == 0) {
      clearInterval(brake);
      this.state = 'halted';
    }
    else if (self.state == "cruising") {
      clearInterval(brake);
    }
    else {
      self.speed--;
    }
  }, 500);

  cb();
}

CAR.prototype.releaseBrake = function(cb) {
  this.state = 'cruising';
  cb();
}
