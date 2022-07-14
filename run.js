const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
let err = null;

// server stuff
app.use(express.json({ strict: false }));

app.get("/", (req, res) => {
	err = null;
	res.sendFile(__dirname + "/dist/index.html");
	render();
});

app.post("/error", (req, res) => {
	err = req.body;
	render();
});

app.use(express.static(__dirname));

server.listen(port);

// term output
const red = (msg) => `\x1b[31m${msg}\x1b[0m`;
const dim = (msg) => `\x1b[2m${msg}\x1b[0m`;

function render() {

	// kaboooooom!
	process.stdout.write("\x1b[2J");
	process.stdout.write("\x1b[H");
	process.stdout.write("kaboom!\n");

	console.log(dim("\n(tip: Cmd + S in editor refresh webview)"));

	// error stack trace
	if (err) {
		console.log("");
		console.error(red(`ERROR: ${err.msg}`));
		if (err.stack) {
			err.stack.forEach((trace) => {
				console.error(`    -> ${trace.file}:${trace.line}:${trace.col}`);
			});
		}
	}

}
