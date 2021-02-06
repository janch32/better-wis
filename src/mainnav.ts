import * as utils  from './utils';
interface UserInfo{
	/** Login uživatele (xlogin00) */
	login?: string;
	/** Celé jméno včetně titulů */
	name?: string;
	/** Aktuálně vybrané studium */
	study?: string;
	/** Aktuální ročník studia */
	year?: string;
}

interface MenuItem{
	location: string;
	nameCs: string;
	nameEn: string;
	section: utils.PageSections;
}

const menuItems: MenuItem[] = [
	{
		location: "/FIT/st/index.php",
		nameCs: "Přehled",
		nameEn: "Overview",
		section: utils.PageSections.Home
	},
	{
		location: "/FIT/st/study-s.php",
		nameCs: "Studia",
		nameEn: "Study",
		section: utils.PageSections.Study
	},
	{
		location: "/FIT/st/study-v.php",
		nameCs: "Předměty",
		nameEn: "Courses",
		section: utils.PageSections.Courses
	},
	{
		location: "/FIT/st/course-reg.php",
		nameCs: "Registrace",
		nameEn: "Registration",
		section: utils.PageSections.Registration
	},
	{
		location: "/FIT/st/other.php",
		nameCs: "Ostatní",
		nameEn: "Other",
		section: utils.PageSections.Other
	},
];

/**
 * Vlastní hlavní navigace WISu (ta horní)
 */
export const mainNav = () => {
	const user = getUserInfo();
	const nav = createCustomNav(user);
	document.body.prepend(nav);
	console.log(user);
};

function createCustomNav(userData: UserInfo): HTMLElement{
	const lang = utils.getLang();
	const currentSection = utils.getCurrentSection();
	const nav = document.createElement("nav");
	nav.className = "main-nav";

	// Přidání loga
	const logo = document.createElement("a");
	logo.href = "https://fit.vut.cz/."+lang;
	logo.className = "logo";
	logo.title = "Hlavní web VUT FIT";
	nav.appendChild(logo);

	// Přidání navigačních položek na hlavní sekce
	for (const item of menuItems) {
		const link = document.createElement("a");
		link.href = `${item.location}.${lang}`;
		link.textContent = lang === "en" ? item.nameEn : item.nameCs;
		if(currentSection === item.section) link.className = "active";
		nav.appendChild(link);
	}

	// Přidání informací o přihlášeném uživateli
	const user = document.createElement("a");
	user.href = "/FIT/st/osinfo.php." + lang;
	user.className = "user";
	user.innerHTML = `
		<div class="name">${userData.name}</div>
		<div class="login">${userData.login}</div>
		<div class="more-btn"></div>
		`;
	nav.appendChild(user);

	// Vysouvací roleta
	const more = document.createElement("div");
	more.className = "more";
	more.innerHTML = `
	<div class="study">${userData.study}</div>
	<div class="year">${userData.year}</div>
	<a target="_blank" href="https://github.com/janch32/better-wis">Better WIS - Zpětná vazba</a>
	<a target="_blank" href="https://www.vutbr.cz/studis/student.phtml?sn=prohlaseni_studenta">Studis - Prohlášení o bezinfekčnosti</a>
	<div class="buttons">
		<a class="lang" href="${window.location.href.replace(/\.en|\.cs/, "."+(lang === "en" ? "cs" : "en"))}">${(lang === "en" ? "CS" : "EN")}</a>
		<a class="account" href="/FIT/st/osinfo.php.${lang}">${lang === "en" ? "Accounts" : "Účty"}</a>
		<a class="logout" href="/FIT/st/logoff.php.${lang}?logoff=1">${lang === "en" ? "Logout" : "Odhlásit"}</a>
	</div>
	`;
	nav.appendChild(more);

	return nav;
}

/**
 * Získat info o uživateli ze stránky
 *
 * Údaje jsou klasicky na začátku stránky hned pod navigací.
 * Bohužel je to nešťastně jen jako text (není to v elementu), takže je dolování
 * těchto dat trochu těžší. Ale co se dá dělat 🤷‍♀️
 *
 * TODO cachovat, aby se data zobrazili i přes to, že na stránce chybí.
 * (chybí například na stránce https://wis.fit.vutbr.cz/FIT/st/email-l.php.cs)
 */
function getUserInfo(): UserInfo {
	const user: UserInfo = {};
	const main = document.querySelector("body > div[role=main]");
	if(!main) return user;

	const children = main.childNodes;
	if(children.length < 5) return user;

	const loginNode = children[0];
	if(loginNode.nodeType === Node.TEXT_NODE){
		const login = loginNode.textContent?.match(/Login ([^,]*),/);
		if(login && login.length > 1) user.login = login[1];
	}

	if(user.login) loginNode.remove();
	else return user;

	const nameNode = children[0];
	if(nameNode.nodeName === "B"){
		user.name = nameNode.textContent ?? undefined;
	}else return user;

	if(user.name) nameNode.remove();
	else return user;

	const studyNode = children[0];
	if(studyNode.nodeType === Node.TEXT_NODE){
		user.study = studyNode.textContent?.substring(2);
	}else return user;

	if(user.study) studyNode.remove();
	else return user;

	const yearNode = children[1];
	if(yearNode.nodeType === Node.TEXT_NODE){
		const year = yearNode.textContent?.match(/(.*?)( - )?$/);
		if(year && year.length > 1) user.year = year[1];
	}

	if(user.year) yearNode.remove();
	return user;
}
