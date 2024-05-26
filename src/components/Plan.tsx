import { Badge, Placeholder, OverlayTrigger, Card } from "react-bootstrap";
import schoolData from "../data/data.json";
import { useState, useEffect } from "react";
import Lekcja from "../utils/Lekcja";
import Nauczyciel from "../utils/Nauczyciel";
import PlanOddzialu from "../utils/Plan";

const apiURL = "https://wisniowy-plan-backend.onrender.com/";
const planyURL = "plany/";
const nauczycieleURL = "nauczyciele/";

function godziny(godzina: number): string {
	if (godzina < 1 || godzina > 10) return "";

	//@ts-ignore
	return schoolData.dzwonki[`${godzina}`];
}

function dzwonkiLimit(lekcje: Lekcja[][]) {
	const limit = lekcje[lekcje.length - 1][0].godzina;
	let dzwonki = [1];
	for (let i = 2; i <= limit; i++) {
		dzwonki.push(i);
	}

	return dzwonki;
}

function title(oddzial: string, isLoading: boolean) {
	if (isLoading)
		return (
			<>
				Ładowanie planu lekcji dla oddziału <b>{oddzial}</b>...
			</>
		);
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

const nauczyciel = (
	lekcja: Lekcja,
	nauczyciele: Nauczyciel[][],
	loading: boolean
) => {
	if (lekcja.przedmiot == "") return "";

	if (loading) {
		return (
			<Placeholder as="div" animation="wave">
				<Placeholder
					style={{
						width: randWidth(5),
					}}
					size="sm"
				/>{" "}
				<Placeholder
					style={{
						width: randWidth(80),
					}}
					size="sm"
				/>
			</Placeholder>
		);
	}

	let map = nauczyciele.map((nauczyciel) => {
		if (nauczyciel[0].inicjaly == lekcja.nauczyciel)
			return nauczyciel[0].imie + ". " + nauczyciel[0].nazwisko;
	});
	return map;
};

const fullPrzedmiot = (lekcja: Lekcja) => {
	if (lekcja.przedmiot == "") return "";

	//@ts-ignore
	return schoolData.przedmioty[lekcja.przedmiot]
		? //@ts-ignore
		  schoolData.przedmioty[lekcja.przedmiot]
		: lekcja.przedmiot;
};

function randWidth(base: number) {
	return `${base + Math.random() * 30}px`;
}

function getPlan(plany: PlanOddzialu[], oddzial: string) {
	if (plany.length < 1) return undefined;

	let plan = undefined;
	plany.forEach((p) => {
		if (p.oddzial == oddzial) plan = p.lekcje;
	});
	if (!plan) return undefined;

	return plan;
}

const daysOfTheWeek = [
	"Niedziela",
	"Poniedziałek",
	"Wtorek",
	"Środa",
	"Czwartek",
	"Piątek",
	"Sobota",
];

const formatDate = (date: Date, includeDay: Boolean) => {
	let day: string =
		date.getDate() < 10 ? `0${date.getDate}` : date.getDate().toString();
	let month: string =
		date.getMonth() + 1 < 10
			? `0${date.getMonth() + 1}`
			: (date.getMonth() + 1).toString();
	let year: string = date.getFullYear().toString();
	let dotw = includeDay ? daysOfTheWeek[date.getDay()] + ", " : "";

	return `${dotw}${day}.${month}.${year}`;
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
	const [plan, setPlan] = useState([] as Lekcja[][]);
	const [plany, setPlany] = useState([] as PlanOddzialu[]);
	const [nauczyciele, setNauczyciele] = useState([] as Nauczyciel[][]);
	const [loading, setLoading] = useState(false);
	const [nLoading, setNLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		let newPlan = getPlan(plany, oddzial);
		if (!newPlan) {
			fetch(apiURL + planyURL + oddzial)
				.then((res) => res.json())
				.then((data: JSON) => {
					let list: Lekcja[][] = [];
					//@ts-ignore
					for (var i in data) list.push([data[i]]);
					setPlan(list);
					setLoading(false);

					// If plan isn't saved, save it.
					let hasPlan = false;
					plany.forEach((p) => {
						if (p.oddzial == oddzial) hasPlan = true;
					});
					if (!hasPlan) {
						let newPlany = plany;
						newPlany.push(new PlanOddzialu(oddzial, list));
						setPlany(newPlany);
					}
				});
		} else {
			setPlan(newPlan);
			setLoading(false);
		}
	}, [oddzial]);

	useEffect(() => {
		setNLoading(true);
		fetch(apiURL + nauczycieleURL)
			.then((res) => res.json())
			.then((data: JSON) => {
				let list: Nauczyciel[][] = [];
				//@ts-ignore
				for (var i in data) list.push([data[i]]);
				setNauczyciele(list);
				setNLoading(false);
			});
	}, ["once"]);

	let days: Lekcja[][] = [[], [], [], [], []];

	plan.forEach((lekcja) => {
		if (lekcja == null || lekcja[0] == null || lekcja[0].grupa == "2/2")
			return;

		days[lekcja[0].dzien][lekcja[0].godzina - 1] = lekcja[0];
	});

	days.forEach((day, j) => {
		for (let i = 0; i < day.length; i++) {
			if (!day[i])
				day[i] = new Lekcja(new Date(Date.now()), i + 1, j, "", "", "");
		}
	});

	if (plan.length == 0)
		return (
			<div className="cs text-color plan-title">
				{title(oddzial, loading)}
			</div>
		);

	let dzwonki = dzwonkiLimit(plan);

	//@ts-ignore
	const card = (lekcja: Lekcja) => {
		const wyswGrupa = (lekcja: Lekcja) => {
			if (
				lekcja.grupa ||
				lekcja.przedmiot == "religia" ||
				lekcja.przedmiot == "etyka"
			)
				return (
					<>
						<br />
						Grupa: <b>{grupa(lekcja)}</b>
					</>
				);
			else return;
		};
		return (
			<Card
				style={{ maxWidth: "24rem" }}
				bg="dark"
				text="light"
				border="secondary"
			>
				<Card.Body>
					<Card.Title>
						{lekcja.godzina}. {godziny(lekcja.godzina)}
					</Card.Title>
					<Card.Subtitle style={{ marginBottom: "5px" }}>
						{fullPrzedmiot(lekcja)}
					</Card.Subtitle>
					<Card.Text>
						Nauczyciel:{" "}
						<b>{nauczyciel(lekcja, nauczyciele, nLoading)}</b>
						<br />
						Sala: <b>{sala(lekcja)}</b>
						{wyswGrupa(lekcja)}
						<br />
						Brak danych o zastępstwach.
					</Card.Text>
					<Card.Footer>
						<small>{formatDate(new Date(Date.now()), true)}</small>
					</Card.Footer>
				</Card.Body>
			</Card>
		);
	};

	const infoButton = (lekcja: Lekcja) => {
		if (lekcja.przedmiot == "") return;
		const placement = lekcja.dzien < 3 ? "right" : "left";
		return (
			<OverlayTrigger
				placement={placement}
				overlay={card(lekcja)}
				delay={{ show: 200, hide: 0 }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					fill="currentColor"
					className="bi bi-info-circle-fill plan-element-info"
					viewBox="0 0 16 16"
				>
					<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
				</svg>
			</OverlayTrigger>
		);
	};

	return (
		<>
			<div className="cs text-color plan-title">
				{title(oddzial, loading)}
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

								if (loading)
									return (
										<div className={classname} key={i}>
											<div className="plan-stc">
												<div className="plan-subject">
													<Placeholder
														as="div"
														animation="wave"
													>
														<Placeholder
															style={{
																width: randWidth(
																	140
																),
															}}
														/>{" "}
														<Placeholder
															style={{
																width: randWidth(
																	70
																),
															}}
														/>
													</Placeholder>
												</div>
												<div className="plan-teacher">
													<Placeholder
														as="div"
														animation="wave"
													>
														<Placeholder
															style={{
																width: randWidth(
																	5
																),
															}}
															size="sm"
														/>{" "}
														<Placeholder
															style={{
																width: randWidth(
																	80
																),
															}}
															size="sm"
														/>
													</Placeholder>
												</div>
											</div>
											<div className="plan-classroom">
												<Badge bg="secondary" pill>
													<Placeholder
														as="div"
														animation="wave"
													>
														<Placeholder
															style={{
																width: randWidth(
																	1
																),
															}}
															size="xs"
														/>{" "}
													</Placeholder>
												</Badge>
												<br />
												<Badge bg="primary" pill>
													<Placeholder
														as="div"
														animation="wave"
													>
														<Placeholder
															style={{
																width: "20px",
															}}
															size="xs"
														/>{" "}
													</Placeholder>
												</Badge>
											</div>
										</div>
									);

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
													nauczyciele,
													nLoading
												)}
											</div>
										</div>
										<div className="plan-element-right">
											<Badge bg="secondary" pill>
												{sala(lekcja)}
											</Badge>
											<br />
											<Badge bg="primary" pill>
												{grupa(lekcja)}
											</Badge>
											<br />
											{infoButton(lekcja)}
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
