interface Lekcja {
	data: Date;
	godzina: number;
	dzien: number;
	przedmiot: string;
	grupa: (string|undefined);
	nauczyciel: string;
	sala: string;
}

class Lekcja {
	constructor(data:Date, godzina:number, dzien:number, przedmiot:string, nauczyciel:string, sala:string, grupa:(string|undefined) = undefined) {
		this.data = data;
		this.godzina = godzina;
		this.dzien = dzien;
		this.przedmiot = przedmiot;
		this.grupa = grupa;
		this.nauczyciel = nauczyciel;
		this.sala = sala;
	}
}

export default Lekcja