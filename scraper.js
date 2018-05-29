const puppeteer = require('puppeteer');

(async () => {

    // let firstName = process.env.firstName;

    // async function TakeScreenshot(name) {
    //     var currentDate = (new Date).getDay() + "d" + (new Date).getMonth() + "m" + (new Date).getFullYear() + "T" + (new Date).getHours() + "h" + (new Date).getMinutes() + "m" + (new Date).getSeconds() + 's'
    //     await page.screenshot({ path: 'test/screenshots/' + currentDate + '_' + name + '.png', fullPage: true });
    // }
	// https://www.mlb.com/scores/2018-05-26

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// await page.goto('http://chezrevel.net');

	// let gamesList = await page.evaluate(() => {
	// 	let list = document.querySelectorAll('#hp > div.hp-list.docs > ul > li');

	// 	let data = [];
	// 	for (const item of list) {
	// 		let title = item.childNodes[0].innerText; // Select the title

	// 		data.push({title});
	// 	}

	// 	return data;

	// });

	// console.log('gamesList', gamesList);

	await page.goto('https://www.baseball-reference.com/teams/CLE/2018-schedule-scores.shtml');

	let gamesList = await page.evaluate(() => {
		let list = document.querySelectorAll('#team_schedule > tbody > tr:not([class="thead"]');

		let data = [];

		for (const liste of list) {
			if(liste.childNodes[2].innerText === 'boxscore'){
				let game = liste.childNodes[0].innerText;
				let result = liste.childNodes[6].innerText;

				data.push({game: game, result: result});
			}

		}


		return data;

	});

	console.log('gamesList', gamesList);


    // ---------------------------------------------------------


	// await page.waitFor(3000);

	// await page.goto('https://www.mlb.com/scores/2018-05-26');

	// let gamesList = await page.evaluate(() => {
	// 	let gamesContainer = document.querySelectorAll('.mlb-scores__list.mlb-scores__list--games')[0];

	// 	let gamesEls = gamesContainer.querySelectorAll('li');

	// 	console.log(await gamesEls);

	// 	for (const gameEl of gamesEls) {

	// 	}

	// 	const gameTeams = []
	// 	for (const gameEl of gamesEls) {

	// 		let teamAway = gameEl.querySelectorAll('.g5-component--mlb-scores__linescore__table__team-row.g5-component--mlb-scores__linescore__table__team-row--away')[0];

	// 		teamAway.querySelector('.g5-component--mlb-scores__team__info__name--abbrev').textContent;
	// 		console.log('teamAway', teamAway);
	// 		gameTeams.push(teamAway);


	// 	}

	// 	return gamesEls;
	// });

	// console.log('gamesList', gamesList);



	// let teams = await gamesList.map(function(gameBody) {
		//console.log('gameBody', gameBody);

		// teams.push(gameBody);

		// let searchValue = '';
		// let teamsEls = gameBody.querySelectorAll('.g5-component--mlb-scores__linescore__table__team-row')

		// teams.push(i);
		// for (const teamEl of teamsEls) {
		// 	let didTeamLoose = teamEl.querySelector('.td g5-component--mlb-scores__team').classList.contains('g5-component--mlb-scores__team--loser')

		// 	// teams.push(
		// 	// 	{
		// 	// 		date: 'date',

		// 	// 	}
		// 	// )
		// }



		// return searchValue;
	// });

	//console.log('teams', teams);

	// for (let i = 1; i <= listLength; i++) {

	// 	console.log('i', i);
	// 	// change the index to the next child
	// 	// let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
	// 	// let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);

	// 	// let username = await page.evaluate((sel) => {
	// 	// 	return document.querySelector(sel).getAttribute('href').replace('/', '');
	// 	//   }, usernameSelector);

	// 	// let email = await page.evaluate((sel) => {
	// 	// 	let element = document.querySelector(sel);
	// 	// 	return element? element.innerHTML: null;
	// 	//   }, emailSelector);

	// 	// // not all users have emails visible
	// 	// if (!email)
	// 	//   continue;

	// 	// console.log(username, ' -> ', email);

	// 	// TODO save this user
	// }

	await browser.close();
})();