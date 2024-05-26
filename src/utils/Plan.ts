import Lekcja from "./Lekcja";

interface Plan {
	oddzial:string,
	lekcje:Lekcja[][]
}

class Plan {
	constructor(oddzial:string, lekcje:Lekcja[][]) {
		this.oddzial = oddzial
		this.lekcje = lekcje
	}
}

export default Plan