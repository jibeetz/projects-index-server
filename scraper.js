const puppeteer = require('puppeteer');

(async () => {

    // let firstName = process.env.firstName;


	const browser = await puppeteer.launch({headless: false, devtools: true, args: ['--start-maximized']});
	const page = await browser.newPage();

	async function captureTeam(page, team) {

		await page.goto('https://www.baseball-reference.com/teams/' + team +'/2018-schedule-scores.shtml', {waitUntil: 'networkidle2'});

		let gamesList = await page.evaluate((team) => {

			let team_nice_name = document.querySelector('#meta > div:nth-child(2) > h1 > span:nth-child(2)').innerText;
			let year = document.querySelector('#meta > div:nth-child(2) > h1 > span:nth-child(1)').innerText;
			let league = document.querySelector('#meta > div:nth-child(2) > p:nth-child(3) > a:nth-child(2)').innerText;

			let teamData = {
				meta: {
					team: team,
					league: league,
					year: year,
					team_nice_name: team_nice_name
				}
			};

			let list = document.querySelectorAll('#team_schedule > tbody > tr:not([class="thead"]');

			let data = [];

			const cleanResult = (result) => {
				if(result === 'L-wo')
					return 'L';

				if(result === 'W-wo')
					return 'W';

				return result;
			}

			for (const liste of list) {
				if(liste.childNodes[2].innerText === 'boxscore'){
					let game = liste.childNodes[0].innerText;
					let result = liste.childNodes[6].innerText;

					result = cleanResult(result)

					data.push({game: game, result: result});
				}

			}

			teamData.scores = data;

			console.log('uhuhuh');

			debugger;

			return teamData;

		}, team);

		console.log('gamesList', await gamesList);

		await page.waitFor(3000);
	}

	const teams = ['CLE', 'BOS', 'NYY']

	for (let team of teams) {
		await captureTeam(page, team);
	}

	await browser.close();
})();