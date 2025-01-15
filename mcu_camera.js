module.exports = function(RED) {
    function McuCamera(config) {
        RED.nodes.createNode(this,config);
        console.log(config);
    }
    RED.nodes.registerType("mcu_camera", McuCamera);
}
