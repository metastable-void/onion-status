
require('dotenv').config();

const Koa = require('koa');
const app = new Koa();

const os = require('os');


const PORT = 65535 & (process.env.PORT || 8080);


const runCommand = async (command, args) => {
	return await new Promise((resolve, reject) => {
		execFile(
			String(command)
			, [... args]
			, {encoding: 'utf8'}
			, (error, stdout, stderr) => {
				if (error) {
					console.error(error, stderr);
					reject(error);
				} else {
					resolve(stdout);
				}
			}
		);
	});
};

const getRoutesIpv4 = async () =>
	JSON.parse(await runCommand('/sbin/ip', ['-j', '-4', 'route', 'show']));

const getRoutesIpv6 = async () =>
	JSON.parse(await runCommand('/sbin/ip', ['-j', '-6', 'route', 'show']));


app.use(async ctx => {
	ctx.type = 'application/json';
	ctx.body = JSON.stringify({
		os: os.type(),
		arch: os.arch(),
		systemUptime: os.uptime(),
		processUptime: 0 | process.uptime(),
		pid: process.pid,
		memory: {
			total: os.totalmem(),
			free: os.freemem(),
		},
		hostname: os.hostname(),
		networkInterfaces: os.networkInterfaces(),
	}, null, 4);
});

app.listen(PORT);

