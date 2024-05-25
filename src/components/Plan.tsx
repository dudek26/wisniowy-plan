import { Badge } from "react-bootstrap";
import schoolData from "../data/data.json";
import { useQuery } from "@tanstack/react-query";
import Lekcja from "../utils/Lekcja";
import Nauczyciel from "../utils/Nauczyciel";

const apiURL = "https://wisniowy-plan-backend.onrender.com/";
const planyURL = "plany/";
const nauczycieleURL = "nauczyciele/";

function godziny(godzina: number): string {
	if (godzina < 1 || godzina > 10) return "";

	//@ts-ignore
	return schoolData.dzwonki[`${godzina}`];
}

function fetchPlan(klasa: string) {
	const {
		data: lekcje = [],
		isLoading,
		error,
	} = useQuery({
		queryFn: () =>
			// planURL + planLista
			fetch(apiURL + planyURL + klasa)
				.then((res) => res.json())
				.then((data: JSON) => {
					let list: Lekcja[][] = [];
					//@ts-ignore
					for (var i in data) list.push([data[i]]);
					return list;
				}),
		queryKey: ["lekcje"],
	});

	return { lekcje, isLoading, error };
}
function fetchNauczyciele() {
	const {
		data: nauczyciele = [],
		isLoading,
		error,
	} = useQuery({
		queryFn: () =>
			// planURL + planLista
			fetch(apiURL + nauczycieleURL)
				.then((res) => res.json())
				.then((data: JSON) => {
					let list: Nauczyciel[][] = [];
					//@ts-ignore
					for (var i in data) list.push([data[i]]);
					return list;
				}),
		queryKey: ["nauczyciele"],
	});

	return { nauczyciele, isLoading, error };
}

function dzwonkiLimit(lekcje: Lekcja[][]) {
	const limit = lekcje[lekcje.length - 1][0].godzina;
	let dzwonki = [1];
	for (let i = 2; i <= limit; i++) {
		dzwonki.push(i);
	}

	return dzwonki;
}

function title(oddzial: string, isLoading: boolean, error: Error | null) {
	if (isLoading)
		return `Ładowanie planu lekcji dla oddziału <b>${oddzial}</b>...`;
	if (error)
		return `Wystąpił błąd podczas ładowania planu lekcji dla oddziału <b>${oddzial}</b>.`;
	return (
		<>
			Plan lekcji dla oddziału <b>{oddzial}</b>
		</>
	);
}

function sala(lekcja: Lekcja) {
	if (lekcja.przedmiot == "wf")
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="12"
				fill="currentColor"
				className="bi bi-person-arms-up"
				viewBox="0 0 16 16"
			>
				<path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z" />
				<path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z" />
			</svg>
		);
	else return lekcja.sala;
}
function grupa(lekcja: Lekcja) {
	if (lekcja.przedmiot == "religia") return <b> ✝ </b>;
	if (lekcja.przedmiot == "etyka") return <b> ⚖️ </b>;
	return lekcja.grupa;
}

const daysStr = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const nauczyciel = (lekcja: Lekcja, nauczyciele: Nauczyciel[][]) => {
	if (lekcja.przedmiot == "") return "";
	let map = nauczyciele.map((nauczyciel) => {
		if (nauczyciel[0].inicjaly == lekcja.nauczyciel)
			return nauczyciel[0].imie + ". " + nauczyciel[0].nazwisko;
	});
	return map;
};

function Plan({
	//@ts-ignore
	oddzial,
	//@ts-ignore
	grupaZaw,
	//@ts-ignore
	religia,
	//@ts-ignore
	etyka,
	//@ts-ignore
	grupaSpec,
	//@ts-ignore
	grupaAng,
	//@ts-ignore
	grupaJO2,
}) {
	const oddzialy = fetchPlan(oddzial);
	const nauczyciele = fetchNauczyciele();

	if (oddzialy.isLoading) return;
	if (oddzialy.error) return;

	let dzwonki = dzwonkiLimit(oddzialy.lekcje);

	let days: Lekcja[][] = [[], [], [], [], []];

	oddzialy.lekcje.forEach((lekcja) => {
		if (lekcja == null || lekcja[0] == null || lekcja[0].grupa == "2/2")
			return;

		days[lekcja[0].dzien][lekcja[0].godzina - 1] = lekcja[0];
	});

	days.forEach((day, j) => {
		for (let i = 0; i < day.length; i++) {
			if (!day[i]) day[i] = new Lekcja(i + 1, j, "", "", "");
		}
	});

	return (
		<>
			<div className="cs text-color plan-title">
				{title(oddzial, oddzialy.isLoading, oddzialy.error)}
			</div>
			<div className="plan-days text-color">
				<div className={`plan hours h-${dzwonki.length}`}>
					<div className="plan-element plan-element-title first">
						Godzina
					</div>
					{dzwonki.map((i) => {
						let classname = "plan-element time";
						if (i == 1) classname += " first";
						if (i == 4 || i == 5) classname += " dpn";
						if (i == 5 || i == 6) classname += " dpp";
						if (i == dzwonki.length) classname += " last-nb";
						return (
							<div className={classname} key={i}>
								{i}: {godziny(i)}
							</div>
						);
					})}
				</div>
				{days.map((day, i) => {
					return (
						// @ts-ignore
						<div
							className={`plan ${daysStr[i]} h-${dzwonki.length}`}
							key={i}
						>
							<div className="plan-element plan-element-title first">
								{
									//@ts-ignore
									schoolData.dni[daysStr[i]]
								}
							</div>
							{day.map((lekcja: Lekcja, i) => {
								i++;
								let classname = "plan-element";
								if (!lekcja.przedmiot) classname += " empty";
								if (i == 1) classname += " first";
								if (i == 4 || i == 5) classname += " dpn";
								if (i == 5 || i == 6) classname += " dpp";
								if (i == dzwonki.length)
									classname += " last-nb";
								else if (i == day.length) classname += " last";

								return (
									<div className={classname} key={i}>
										<div className="plan-stc">
											<div className="plan-subject">
												{
													//@ts-ignore
													schoolData.przedmioty[
														lekcja.przedmiot
													]
														? //@ts-ignore
														  schoolData.przedmioty[
																lekcja.przedmiot
														  ]
														: lekcja.przedmiot
												}
											</div>
											<div className="plan-teacher">
												{nauczyciel(
													lekcja,
													nauczyciele.nauczyciele
												)}
											</div>
										</div>
										<div className="plan-classroom">
											<Badge bg="secondary" pill>
												{sala(lekcja)}
											</Badge>
											<br />
											<Badge bg="primary" pill>
												{grupa(lekcja)}
											</Badge>
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</>
	);
}

export default Plan;
