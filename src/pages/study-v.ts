//TODO všechno

function getCourseData(){
	let table: HTMLTableElement | null =
		document.querySelector("div[role=main] > div:first-of-type > table tbody");

	if(!table) return;

	console.log(table);
}

function modifyCourses(){
	getCourseData();
}

/**
 * Zobrazení vlastní předmětů v tomto roce
 */
export const studyV = () => {
	modifyCourses();
};
