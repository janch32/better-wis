import * as utils from './utils';

/**
 * Url kategorií pro zobazení v postranním menu
 *
 * Prakticky všechny stránky, které obsahují velká tlačítka
 */
export enum SubmenuCategories{
	/** Studia */
	Study = "/FIT/st/study.php",

	/** Semestr (v originále "Předměty") */
	Courses = "/FIT/st/courses.php",

	/** Registrace */
	Registration = "/FIT/st/reg.php",

	/** Hesla */
	Accounts = "/FIT/st/admin.php",

	/** Ostatní */
	Other = "/FIT/st/other.php"
}

/**
 * Levé menu pro zobrazní ostatních stránek v kategorii
 *
 * Př.
 * Jsem na stránce "Seznam studií, školení" - Vlevo jsou odkazy na další stránky
 * kategorie "Studia", jako "Závěrčené práce", "Aktuální studium na FIT", ...
 */
export class Submenu{
	private Request = new XMLHttpRequest();
	private Element: HTMLElement;

	constructor(category: string){
		this.Element = document.createElement("nav");
		this.Element.className = "submenu";

		let mainContent = document.querySelector("div[role=main]");
		document.body.insertBefore(this.Element, mainContent);

		this.Request.open("GET", `${category}.${utils.getLang()}`);
		this.Request.responseType = "document";
		this.Request.onload = () => this.Load();
		this.Request.onerror = () => this.Error();
		this.Request.send();
	}

	private Load(){
		let received = this.Request.responseXML;
		if(!received){
			this.Error();
			return;
		}

		let menu = received.querySelector("div[role=main] > ul.sbb");
		if(!menu){
			this.Error();
			return;
		}
		menu.className = "";

		Array.from(menu.getElementsByTagName("a")).forEach(a => {
			const highlighted = a.classList.contains("sbtng");

			a.className = "";

			if(window.location.href.includes(a.href))
				a.classList.add("active");

			if(highlighted) a.classList.add("highlighted");
		});

		let title = document.createElement("div");
		title.className = "title";
		title.append(received.title);

		this.Element.append(title);
		this.Element.append(menu);
	}

	private Error(){
		console.log("Failed to download submenu");
		this.Element.remove();
	}

	public static GetFromCurrentPageUrl(): Submenu | undefined{
		let url = window.location.pathname.replace("/FIT/st/", "").split(".")[0];

		switch(url){
			case "study-s":
			case "study-a":
			case "bci-prj-l":
			case "szz-my":
			case "rizeni":
				return new Submenu(SubmenuCategories.Study);
			case "news-c":
			case "studygs-l":
			case "studyps-l":
			case "phorum-sm":
			case "cfs":
			case "course-h2":
			case "study-v":
				return new Submenu(SubmenuCategories.Courses);
			case "course-reg":
			case "faqreg":
			case "bci-prj-z":
			case "ppr":
				return new Submenu(SubmenuCategories.Registration);
			case "osinfo":
			case "setpass":
			case "csmad":
			case "csmradius":
			case "csmeva":
			case "chpass":
				return new Submenu(SubmenuCategories.Accounts);
			case "room-wr":
			case "event_reg":
			case "ftp":
			case "ca_ndigalt_cvt":
			case "ca_ndigalt_lib":
			case "email-l":
				return new Submenu(SubmenuCategories.Other);
			default:
				return undefined;
		}
	}
}
