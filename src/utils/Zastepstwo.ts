interface Zastepstwo {
	zastepstwo: boolean;
	data: number;
	godzina: number;
	nauczyciel: string;
	klasa: string;
	przedmiot: string | undefined;
	zastepca: string | undefined;
	sala: string | undefined;
	uwagi: string | undefined;
	grupa: string | undefined;
}

class Zastepstwo {
	constructor(
		zastepstwo: boolean,
		data: number,
		godzina: number,
		nauczyciel: string,
		klasa: string,
		przedmiot: string | undefined = undefined,
		zastepca: string | undefined = undefined,
		sala: string | undefined = undefined,
		uwagi: string | undefined = undefined,
		grupa: string | undefined = undefined
	) {
		this.zastepstwo = zastepstwo;
		this.data = data;
		this.godzina = godzina;
		this.nauczyciel = nauczyciel;
		this.klasa = klasa;
		this.przedmiot = przedmiot;
		this.zastepca = zastepca;
		this.sala = sala;
		this.uwagi = uwagi;
		this.grupa = grupa;
	}
}

export default Zastepstwo;
