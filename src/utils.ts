// Cache zjištěného jazyka stránky
declare global{
	var pageLang: string;
	var currentSection: PageSections;
}

/**
 * Zjištění jazyka stránky
 *
 * @returns Zkratka aktuálního jazyka, pravděpodobně "cs" nebo "en"
 */
export const getLang = (): string => {
	if(globalThis.pageLang) return globalThis.pageLang;

	globalThis.pageLang = document.body.lang;
	if(!globalThis.pageLang){
		// Body nemá lang atribut, zkusíme html element
		globalThis.pageLang = document.documentElement.lang;


		if(!globalThis.pageLang){
			// Ani html nemá lang atribut. Poslední záchrana: podíváme se do horní navigace, jestli
			// v odkazu je identifikátor aktuálního jazyka
			let indexLink: HTMLLinkElement | null =
			document.querySelector('a[href*="/FIT/st/index.php"');
			globalThis.pageLang = indexLink?.href.includes("en") ? "en": "cs";
		}
	}

	return globalThis.pageLang;
};

export enum PageSections{
	None,
	Home,
	Study,
	Courses,
	Registration,
	Accounts,
	Other
}

export const getCurrentSection = (): PageSections =>{
	if(globalThis.currentSection) return globalThis.currentSection;

	const nav = document.querySelector("body > table[role=navigation]");
	if(!nav) return PageSections.None;

	const link = <HTMLAnchorElement>nav.querySelector("a.stabs");
	if(!link) return PageSections.None;
	else if(link.href.includes("index.php")) globalThis.currentSection = PageSections.Home;
	else if(link.href.includes("study.php")) globalThis.currentSection = PageSections.Study;
	else if(link.href.includes("courses.php")) globalThis.currentSection = PageSections.Courses;
	else if(link.href.includes("study-v.php")) globalThis.currentSection = PageSections.Courses;
	else if(link.href.includes("reg.php")) globalThis.currentSection = PageSections.Registration;
	else if(link.href.includes("admin.php")) globalThis.currentSection = PageSections.Accounts;
	else if(link.href.includes("other.php")) globalThis.currentSection = PageSections.Other;
	else return PageSections.None;

	return globalThis.currentSection;
};
