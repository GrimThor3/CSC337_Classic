"use strict";

window.onload = (function() {
	let currentEmail = "";

	document.getElementById("login_button").onclick = login;
	document.getElementById("switch_signup").onclick = switchToSignUp;
	document.getElementById("signup_button").onclick = signup;
	document.getElementById("switch_login").onclick = switchToLogIn;
	document.getElementById("searchButton").onclick = (function() {
		let email = document.getElementById("search").value;
		if (email != "" && email != "Search for friends via email") {
			console.log("searching for " + email);
			loadUser(email);
		}
	});
	document.getElementById("Log off").onclick = switchToSignUp;
	document.getElementById("sendStatus").onclick = updateStatus;
	document.getElementById("home").onclick = (function() {
		loadUser(currentEmail);
	});

	function login() {
		let email = document.getElementById("li_email").value;
		let password = document.getElementById("li_password").value;

		currentEmail = email;

		let url = "https://csc337-classic.herokuapp.com?mode=login&email=" + email + "&password=" + password;
		console.log(url);
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {

			})
			.catch(function(error) {
				console.log(error);
				return;
			});

		loadUser(email);
	}

	function switchToSignUp() {
		let loginPage = document.getElementById("login");
		let signupPage = document.getElementById("signup");
		let page = document.getElementById("hasLoggedIn");

		loginPage.style.display = 'None';
		signupPage.style.display = 'Block';
		page.style.display = 'None';
	}

	function signup() {
		let fname = document.getElementById("su_fname").value;
		let lname = document.getElementById("su_lname").value;
		let email = document.getElementById("su_email").value;
		let password = document.getElementById("su_password").value;

		currentEmail = email;

		let url = "https://csc337-classic.herokuapp.com?mode=signup&name=" + fname + "_" + 
			lname + "&email=" + email + "&password=" + password;
		
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {

			})
			.catch(function(error) {
				console.log(error);
				return;
			});

		loadUser(email);
	}

	function switchToLogIn() {
		let loginPage = document.getElementById("login");
		let signupPage = document.getElementById("signup");
		let page = document.getElementById("hasLoggedIn");

		loginPage.style.display = 'Block';
		signupPage.style.display = 'None';
		page.style.display = 'None';
	}

	function loadUser(email) {
		let loginPage = document.getElementById("login");
		let signupPage = document.getElementById("signup");
		let page = document.getElementById("hasLoggedIn");

		loginPage.style.display = 'None';
		signupPage.style.display = 'None';
		page.style.display = 'Block';

		let url = "https://csc337-classic.herokuapp.com?mode=getuser&email=" + email;
		console.log(url);
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				if (responseText == "Incorrect creditentials") {
					document.getElementById("other").innerHTML = "User not found";
				} else {
					let json = JSON.parse(responseText);

					let name = json['name'].replace('_', ' ');
					console.log("Name: " + name);
					document.getElementById("Name").innerHTML = name;

					console.log("Img Src: " + json['imgsrc']);
					document.getElementById("profilePic").src = json['imgsrc'];

					let status = json['status'];
					console.log("Status: " + status);

					if (status === '') {
						status = '~ No status has been posted ~';
					}

					document.getElementById("status").innerHTML = status;
				}
			})
			.catch(function(error) {
				console.log(error);
			})
	}

	function updateStatus() {
		let newStatus = document.getElementById("newStatus").value;

		let message = {
			email : currentEmail,
			status : newStatus
		};

		let fetchOptions = {
			method : 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body : JSON.stringify(message)
		};
		
		let url = "https://csc337-classic.herokuapp.com?mode=status";

		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				document.getElementById("status").innerHTML = responseText;
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		} else if (response.status === 404) {
			return Promise.reject(new Error("Sorry, we couldn't find that page"));
		} else if (response.status === 410) {
			return Promise.reject(new Error(response.status + ": " + "There was no data to display"))
		} else {
			console.log(response.text());
			return Promise.reject(new Error(response.status + ": " + response.statusText))
		}
	}
});
