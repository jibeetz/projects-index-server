const fs = require("fs");
const puppeteer = require('puppeteer');
const DataUrl = require('./config').url;
const TeamIds = require('./config').teams;

(async () => {

	const browser = await puppeteer.launch({headless: false, devtools: true});
	const page = await browser.newPage();

	page.on("error", function(err) {
		theTempValue = err.toString();
		console.log("Page error: " + theTempValue);
	})

	page.on("pageerror", function(err) {
		theTempValue = err.toString();
		console.log("Page error: " + theTempValue);
	})

	await page.exposeFunction('cleanResult', async result => {

		return new Promise((resolve, reject) => {

			if(result === 'L-wo')
				result = 'L';

			if(result === 'W-wo')
				result = 'W';

			resolve(result);
		});
	});

	async function captureTeam(page, teamId) {

		await page.goto(DataUrl(teamId), {waitUntil: 'networkidle0'});

		let team = await page.evaluate(async teamId => {

			let team_nice_name = document.querySelector('#meta > div:nth-child(2) > h1 > span:nth-child(2)').innerText;
			let year = document.querySelector('#meta > div:nth-child(2) > h1 > span:nth-child(1)').innerText;
			let league = document.querySelector('#meta > div:nth-child(2) > p:nth-child(3) > a:nth-child(2)').innerText;
			let games = document.querySelectorAll('#team_schedule > tbody > tr:not([class="thead"]');

			let teamData = {
				meta: {
					id: teamId,
					league: league,
					year: year,
					team_nice_name: team_nice_name
				}
			};

			let data = [];

			for (const game of games) {
				if(game.childNodes[2].innerText === 'boxscore'){
					let gameNumber = game.childNodes[0].innerText;
					let result = game.childNodes[6].innerText;

					const cleanedResult = await window.cleanResult(result);

					data.push({game: gameNumber, result: cleanedResult});
				}
			}
			teamData.scores = data;

			return teamData;

		}, teamId);

		console.log('team', await team);

		fs.writeFile(__dirname + '/data/' + team.meta.id + '.json', JSON.stringify(team), function (err) {
			if (err) return console.log(err);
			console.log('Appended!');
		});

		await page.waitFor(3000);
	}

	for (let teamId of TeamIds) {
		await captureTeam(page, teamId);
	}

	await browser.close();
})();