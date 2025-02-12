import {Node} from "nodered";
import Camera from "embedded:x-io/imagein/camera";
import Timer from "timer";
let camera, frame, imagetype, width, height;
let cache;

class McuCamera extends Node {
    onStart(config) {
        super.onStart(config);
        imagetype = String(config.imagetype);
        width = Number(config.width);
        height = Number(config.height);
	//console.log("imagetype,width,height:"+imagetype+","+width+","+height);

	const cacheCamera = 'mcu_camera';

	cache ??= new Map;
	camera = cache.get(cacheCamera);
	if (!camera) {
		camera = new Camera({
			width,
			height,
			imageType: imagetype,
			format: "buffer/disposable",
		});
		cache.set(cacheCamera, camera)
		camera.start();
		};
	}

    onMessage(msg, done) {
      try {
	// ignore 2 frames because of frame buffer count (camera_config.fb_count = 3 in camera.c)

	frame?.close();
	frame = camera.read();
	Timer.delay(100);

	frame?.close();
	frame = camera.read();
	Timer.delay(100);

	frame?.close();
	frame = camera.read();
	Timer.delay(100);

	//console.log("size:"+frame.byteLength);
	frame.bytes ??= new Uint8Array(frame);

	msg.payload = Buffer.from(frame.bytes);
	this.send(msg);
	//return msg;
        done();
      } catch (error) {
	done(error);
      }
    };

    static type = "mcu_camera";
    static {
         RED.nodes.registerType(this.type, this)
    };
};

