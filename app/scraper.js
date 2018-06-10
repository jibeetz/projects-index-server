const fs = require("fs");
const puppeteer = require('puppeteer');
const DataUrl = require('./constants').url;
const Teams = require('./config').teams;

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

			if(result === 'L' || result === 'L-wo')
				result = 0;

			if(result === 'W' || result === 'W-wo')
				result = 1;

			if(result === 'T')
				result = -1;

			resolve(result);
		});
	});

	async function captureTeam(page, team) {

		await page.goto(DataUrl(team.code), {waitUntil: 'networkidle0'});

		let teamConstructed = await page.evaluate(async team => {

			let team_nice_name = document.querySelector('#meta > div:nth-child(2) > h1 > span:nth-child(2)').innerText;
			let year = document.querySelector('#meta > div:nth-child(2) > h1 > span:nth-child(1)').innerText;
			let league = document.querySelector('#meta > div:nth-child(2) > p:nth-child(3) > a:nth-child(2)').innerText;
			let games = document.querySelectorAll('#team_schedule > tbody > tr:not([class="thead"]');

			let teamData = {
				meta: {
					id: team.code,
					league: league,
					year: year,
					team_nice_name: team_nice_name,
					color: team.color
				}
			};

			let data = [];
			let wins = 0;
			let loses = 0;

			for (const game of games) {
				if(game.childNodes[2].innerText === 'boxscore'){
					let gameNumber = parseInt(game.childNodes[0].innerText);
					let result = game.childNodes[6].innerText;
					let cleanedResult = await window.cleanResult(result);

					if(cleanedResult === 1)
						wins += cleanedResult

					if(cleanedResult === 0)
						loses += 1

					let avg = (wins * 1000) / (wins + loses)

					data.push({number: gameNumber, result: cleanedResult, avg: avg, wins: wins, loses: loses})
				}
			}
			teamData.games = data;

			return teamData;

		}, team);

		console.log('teamConstructed', await teamConstructed);

		fs.writeFile(__dirname + '/data/' + teamConstructed.meta.id + '.json', JSON.stringify(teamConstructed), function (err) {
			if (err) return console.log(err);
			console.log('Appended!');
		});

		await page.waitFor(3000);
	}

	for (let team of Teams) {
		await captureTeam(page, team);
	}

	await browser.close();
})();