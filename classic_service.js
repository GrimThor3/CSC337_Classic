/*
* File Name: classic_service.js
* Author: Rafael Jeffery
* Purpose: Server-side code
*/
"use strict";

const express = require("express");
const app = express();
let fs = require('fs');
let process = require('process');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


app.use(express.static('public'));
console.log('Web service started');

// Sets port to either heroku port or 3000 (local host)
app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	console.log(req);
	let mode = req.query.mode;
	console.log("Mode: " + mode);
	if (mode === "signup") {
		let name = req.query.name;
		let email = req.query.email;
		let password = req.query.password;

		let dir = 'public/users/' + escape(email);

		if (!fs.existsSync(dir)) {
			fs.mkdir(dir, { recursive: true }, function(err) {
	 			if (err) {
	 				throw err;
	 			}
	 		});
	 		let dir2 = 'public/users/' + escape(email) + '/settings.txt';
	 		let contents = "Name: " + escape(name) + "\nPassword: " + escape(password) + "\nImage Source: img/noimg.png";
	 		fs.writeFileSync(dir2, contents);
	 		let dir3 = 'public/users/' + escape(email);
	 		fs.mkdir(dir3, { recursive: true }, function (err) {
	 			if (err) {
	 				throw err;
	 			}
	 		});
	 		let dir4 = 'public/users/' + escape(email) + '/status.txt';
	 		fs.writeFileSync(dir4, "");
		} else {
			res.send("Incorrect creditentials");
		}
	} else if (mode === "login") {
		let email = req.query.email;
		let password = req.query.password;

		console.log(email);

		let settingPath = "public/users/" + escape(email) + "/settings.txt";
		if (fs.existsSync(settingPath)) {
			let file = fs.readFileSync(settingPath, 'utf8');
			let fileContents = file.split('\n');
			if (fileContents[0].split(": ")[1] == password) {
				let data = {};
				data["image"] = fileContents[1].split(": ")[1];
				let statusPath = 'public/users/' + escape(email) + '/status.txt';
				data["status"] = fs.readFile(statusPath, function(err) {
					if (err) {
						throw err;
					}
				});
			} else {
				res.send("Incorrect creditentials");
			}
		} else {
			res.send("Incorrect creditentials");
		}
	} else if (mode === "getuser") {
		console.log("hit");
		let email = req.query.email;

		let setDir = 'public/users/' + escape(email) + '/settings.txt';
		let statusDir = 'public/users/' + escape(email) + '/status.txt';

		let settingsFile = fs.readFileSync(setDir, 'utf8');
		let statusFile = fs.readFileSync(statusDir, 'utf8');

		let data = {};

		let setFileContents = settingsFile.split('\n');
		data['name'] = setFileContents[0].split(': ')[1];
		data['imgsrc'] = setFileContents[2].split(': ')[1];
		data['status'] = statusFile;

		console.log(JSON.stringify(data));

		res.send(JSON.stringify(data));
	} else if (mode === "changeimg") {
		let email = req.query.email;
	}
});

app.post('/', jsonParser, function(req, res) {
	res.header("Access-Control-ALlow-Origin", "*");
	res.header("Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, Content-Typed, Accept");
	
	let email = req.body.email;
	let status = req.body.status;
	let statusFile = 'public/users/' + escape(email) + "/status.txt";
	fs.writeFile(statusFile, status, 'utf8', (function(err) {
		if (err) {
			throw err;
		}
	}));
	
	res.send(status);
});

app.listen(app.get('port'));
