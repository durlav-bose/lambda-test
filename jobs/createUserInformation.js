const useragent = require("useragent");

/**
 * Create user information object
 *
 * @param Object headers
 * @param Object connection req.connection 
 */
module.exports = (headers, connection) => {
    var ip = headers["x-real-ip"] || connection.remoteAddress;
	const agent = useragent.parse(headers['user-agent']);
    const browser = agent.toAgent();
    const os = agent.os.toString();
    const device = agent.device.toString();

    const obj = {
        device: device,
        os: os,
        browser: browser,
        time: Date.now(),
        ip: ip
    };

    return obj;
};