interface Nauczyciel {
	inicjaly: String,
	imie: String,
	nazwisko: String
}

class Nauczyciel {
	constructor(inicjaly:String, imie:String, nazwisko:String) {
		this.inicjaly = inicjaly;
		this.imie = imie;
		this.nazwisko = nazwisko;
	}
}

export default Nauczyciel