import { mainNav } from './mainnav';
import { overview } from './pages/overview';
import * as utils from './utils';
import { Submenu } from './submenu';
import { studyV } from './pages/study-v';

window.addEventListener("load", () => {
	// Pro případ, kdyby se zpozdilo načítání stylů, tak aby to všem nevypálilo oči
	let html = document.documentElement;
	//if(html) html.style.backgroundColor = "#000000";

	mainNav();

	const page = window.location.pathname.replace("/FIT/st/", "").split(".")[0];
	document.body.setAttribute("page", page);

	document.body.lang = utils.getLang();

	// Načíst skript upravující konkrétní stránku podle aktuální stránky
	switch (page) {
		case "index":
			overview();
			break;
		case "study-v":
			studyV();
			break;
		default:
			break;
	}

	document.body.classList.add("loaded");

	if(!Submenu.GetFromCurrentPageUrl()){
		// Stránka nemá submenu

		document.body.classList.add("nosubmenu");
	}

});

