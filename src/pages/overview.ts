/**
 * Úvodní (domácí) stránka s informacemi o aktuálním semestru
 * a školních aktualitách
 */
export const overview = () => {
	modifyNavigation();
};


const NavigationHiddenElements = /(studnews|study|courses|study-v|reg|admin|other|logoff)\./;

/**
 * Upraví položky navigace na stránce (původní velké modrá tlačítka)
 *
 * Nejedná se o upravení hlavní horní navigace WISu
 */
function modifyNavigation(){
	const navContainer = document.querySelector(".content .sbb");
	if(!navContainer) return;

	for (const element of Array.from(navContainer.children)) {
		const link = element.getElementsByTagName("a");
		if(link.length === 0) continue;

		if(NavigationHiddenElements.test(link[0].href)){
			element.remove();
		}
	}
}
