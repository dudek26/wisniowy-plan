import { Badge, Placeholder, OverlayTrigger, Card } from "react-bootstrap";
import schoolData from "../data/data.json";
import { useState, useEffect } from "react";
import Lekcja from "../utils/Lekcja";
import Nauczyciel from "../utils/Nauczyciel";
import Zastepstwo from "../utils/Zastepstwo";
import PlanOddzialu from "../utils/Plan";

const apiURL = "https://wisniowy-plan-backend.onrender.com/";
const planyURL = "plany/";
const zastepstwaURL = "zastepstwa/";
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

function title(
	oddzial: string,
	isLoading: boolean,
	isZLoading: boolean,
	mobile: boolean = false
) {
	if (!mobile) {
		if (isLoading)
			return (
				<>
					Ładowanie planu lekcji dla oddziału <b>{oddzial}</b>...
				</>
			);
		if (isZLoading)
			return (
				<>
					Ładowanie zastępstw dla oddziału <b>{oddzial}</b>...
				</>
			);
		return (
			<>
				Plan lekcji dla oddziału <b>{oddzial}</b>
			</>
		);
	} else {
		if (isLoading) return <>Ładowanie planu lekcji...</>;
		if (isZLoading) return <>Ładowanie zastępstw...</>;
		return (
			<>
				Plan lekcji <b>{oddzial}</b>
			</>
		);
	}
}

function sala(lekcja: Lekcja, zastepstwoOverride: boolean = false) {
	const przedmiot =
		zastepstwoOverride &&
		lekcja.zastepstwo?.zastepstwo &&
		(lekcja.zastepstwo?.grupa == lekcja.grupa || !lekcja.grupa)
			? lekcja.zastepstwo.przedmiot
			: lekcja.przedmiot;
	if (przedmiot == "wf")
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
	else
		return zastepstwoOverride && lekcja.zastepstwo?.zastepstwo
			? lekcja.zastepstwo.sala
			: lekcja.sala;
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
	loading: boolean,
	zastepstwoOverride: boolean | undefined = false
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

	if (
		zastepstwoOverride &&
		lekcja.zastepstwo?.zastepstwo &&
		(lekcja.zastepstwo?.grupa == lekcja.grupa || !lekcja.grupa)
	)
		return lekcja.zastepstwo.zastepca;

	let map = nauczyciele.map((nauczyciel) => {
		if (nauczyciel[0].inicjaly == lekcja.nauczyciel)
			return nauczyciel[0].imie + ". " + nauczyciel[0].nazwisko;
	});
	return map;
};

const fullPrzedmiot = (lekcja: Lekcja, zastepstwoOverride: boolean = false) => {
	let przedmiot =
		zastepstwoOverride &&
		lekcja.zastepstwo?.zastepstwo &&
		(lekcja.zastepstwo?.grupa == lekcja.grupa || !lekcja.grupa)
			? lekcja.zastepstwo.przedmiot
			: lekcja.przedmiot;
	if (przedmiot == "") return "";

	//@ts-ignore
	return schoolData.przedmioty[przedmiot]
		? //@ts-ignore
		  schoolData.przedmioty[przedmiot]
		: przedmiot;
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
		date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
	let month: string =
		date.getMonth() + 1 < 10
			? `0${date.getMonth() + 1}`
			: (date.getMonth() + 1).toString();
	let year: string = date.getFullYear().toString();
	let dotw = includeDay ? daysOfTheWeek[date.getDay()] + ", " : "";

	return `${dotw}${day}.${month}.${year}`;
};

function addDays(date: Date, number: number, skipWeekends: boolean = false) {
	date.setDate(date.getDate() + number);
	if (skipWeekends) {
		while (getDayFromMonday(date.getDay()) > 4) {
			number > 0
				? date.setDate(date.getDate() + 1)
				: date.setDate(date.getDate() - 1);
		}
	}
	return date;
}

const getDayFromMonday = (day: number) => {
	return day == 0 ? 6 : day - 1;
};

const skipWeekend = (date: Date) => {
	const ndate = new Date(date);
	if (getDayFromMonday(ndate.getDay()) > 4) {
		ndate.setDate(ndate.getDate() + 2);
	}
	return ndate;
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
	const [zastepstwa, setZastepstwa] = useState([] as Zastepstwo[][]);
	const [zastepstwaDaty, setZastepstwaDaty] = useState([] as number[]);
	const [weekStart, setWeekStart] = useState(new Date());
	const [loading, setLoading] = useState(false);
	const [nLoading, setNLoading] = useState(false);
	const [zLoading, setZLoading] = useState(false);
	const [selectedDay, setSelectedDay] = useState(
		skipWeekend(
			new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				new Date().getDate()
			)
		)
	);
	const [width, setWidth] = useState<number>(window.innerWidth);

	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}
	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);
		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);

	// const isMobile = width <= 768;
	const isMobile = width <= 1173;

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
		setZLoading(true);
		fetch(apiURL + nauczycieleURL)
			.then((res) => res.json())
			.then((data: JSON) => {
				let list: Nauczyciel[][] = [];
				//@ts-ignore
				for (var i in data) list.push([data[i]]);
				setNauczyciele(list);
				setNLoading(false);
			});

		fetch(apiURL + zastepstwaURL)
			.then((res) => res.json())
			.then((data: JSON) => {
				let list: Zastepstwo[][] = [];
				//@ts-ignore
				for (var i in data) list.push([data[i]]);
				setZastepstwa(list);
				let list2: number[] = [];
				list[0].forEach((z) => {
					if (!zastepstwaDaty.includes(z.data)) list2.push(z.data);
				});
				setZastepstwaDaty(list2);
				setZLoading(false);
			});

		const startDate = new Date();
		startDate.setMilliseconds(0);
		startDate.setSeconds(0);
		startDate.setMinutes(0);
		startDate.setHours(0);
		startDate.setDate(
			startDate.getDate() - getDayFromMonday(startDate.getDay())
		);
		if (getDayFromMonday(startDate.getDay()) > 4) addDays(startDate, 7);
		setWeekStart(startDate);
	}, ["once"]);

	let days: Lekcja[][] = [[], [], [], [], []];
	let daysMobile: Lekcja[][] = [[], [], [], [], []];

	const hasZastepstwaData = (lekcja: Lekcja) => {
		let has = false;
		zastepstwaDaty.forEach((d) => {
			const tempDate = new Date(d);
			if (
				tempDate.getDate() == lekcja.data.getDate() &&
				tempDate.getMonth() == lekcja.data.getMonth() &&
				tempDate.getFullYear() == lekcja.data.getFullYear()
			) {
				has = true;
			}
		});
		return has;
	};

	function getZastepstwo(
		lekcja: Lekcja,
		grupa: string | undefined
	): Zastepstwo | undefined {
		if (lekcja.nauczyciel.startsWith("#")) return;

		if (!hasZastepstwaData(lekcja)) return;

		let zast;
		zastepstwa.forEach((z) => {
			const tempData = new Date(z[0].data);
			if (
				grupa &&
				tempData.getDate() == lekcja.data.getDate() &&
				tempData.getMonth() == lekcja.data.getMonth() &&
				tempData.getFullYear() == lekcja.data.getFullYear() &&
				z[0].godzina == lekcja.godzina &&
				z[0].klasa == oddzial &&
				z[0].grupa == grupa.charAt(0)
			)
				zast = z[0];
			else if (
				tempData.getDate() == lekcja.data.getDate() &&
				tempData.getMonth() == lekcja.data.getMonth() &&
				tempData.getFullYear() == lekcja.data.getFullYear() &&
				z[0].klasa == oddzial &&
				z[0].godzina == lekcja.godzina &&
				!lekcja.grupa
			)
				zast = z[0];
		});
		return zast;
	}

	plan.forEach((lekcja) => {
		if (lekcja == null || lekcja[0] == null) return;
		if (lekcja[0].grupa && lekcja[0].grupa != `${grupaZaw}/2`) return;

		let placeholder = new Lekcja(
			addDays(new Date(weekStart), lekcja[0].dzien),
			lekcja[0].godzina,
			lekcja[0].dzien,
			lekcja[0].przedmiot,
			lekcja[0].nauczyciel,
			lekcja[0].sala
		);

		days[lekcja[0].dzien][lekcja[0].godzina - 1] = new Lekcja(
			placeholder.data,
			placeholder.godzina,
			placeholder.dzien,
			placeholder.przedmiot,
			placeholder.nauczyciel,
			placeholder.sala,
			getZastepstwo(placeholder, lekcja[0].grupa),
			lekcja[0].grupa
		);
		daysMobile[lekcja[0].dzien][lekcja[0].godzina - 1] =
			days[lekcja[0].dzien][lekcja[0].godzina - 1];
	});

	days.forEach((day, j) => {
		for (let i = 0; i < day.length; i++) {
			if (!day[i]) {
				day[i] = new Lekcja(
					addDays(new Date(weekStart), j),
					i + 1,
					j,
					"",
					"",
					""
				);
			}
		}
	});

	daysMobile.forEach((day) => {
		if (!day[0]) day.shift();
	});

	useEffect(() => {
		let newDays: Lekcja[][] | undefined = [[], [], [], [], []];

		plan.forEach((lekcja) => {
			if (lekcja == null || lekcja[0] == null) return;
			if (lekcja[0].grupa && lekcja[0].grupa != `${grupaZaw}/2`) return;

			let placeholder = new Lekcja(
				addDays(new Date(weekStart), lekcja[0].dzien),
				lekcja[0].godzina,
				lekcja[0].dzien,
				lekcja[0].przedmiot,
				lekcja[0].nauczyciel,
				lekcja[0].sala
			);

			newDays[lekcja[0].dzien][lekcja[0].godzina - 1] = new Lekcja(
				placeholder.data,
				placeholder.godzina,
				placeholder.dzien,
				placeholder.przedmiot,
				placeholder.nauczyciel,
				placeholder.sala,
				getZastepstwo(placeholder, lekcja[0].grupa),
				lekcja[0].grupa
			);
		});

		newDays.forEach((day, j) => {
			for (let i = 0; i < day.length; i++) {
				if (!day[i]) {
					day[i] = new Lekcja(
						addDays(new Date(weekStart), j),
						i + 1,
						j,
						"",
						"",
						""
					);
				}
			}
		});
		days = newDays;
	}, [weekStart]);

	const placeholderPC = (
		<div className="text-color plan-title">
			<div className="plan-title-arrow left">{"<"}</div>
			<div className="plan-title-el">
				{title(oddzial, loading, zLoading, isMobile)}
			</div>
			<div className="plan-title-arrow right">{">"}</div>
		</div>
	);
	const placeholderMobile = (
		<div className="text-color plan-title">
			<div className="plan-title-arrow left">{"<"}</div>
			<div className="plan-title-el">
				{title(oddzial, loading, zLoading, isMobile)}
			</div>
			<div className="plan-title-arrow right">{">"}</div>
		</div>
	);

	if (plan.length == 0 || zLoading)
		return isMobile ? placeholderMobile : placeholderPC;

	let dzwonki = dzwonkiLimit(plan);

	//@ts-ignore
	const card = (lekcja: Lekcja) => {
		const wyswGrupa = () => {
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

		const uwagi = () => {
			if (lekcja.nauczyciel.startsWith("#")) return;
			if (!hasZastepstwaData(lekcja))
				return (
					<>
						<br />
						Brak danych o zastępstwach.
					</>
				);
			if (!getZastepstwo(lekcja, lekcja.grupa))
				return (
					<>
						<br />
						Brak zaplanowanych zastępstw.
					</>
				);

			if (!getZastepstwo(lekcja, lekcja.grupa)?.zastepstwo)
				return (
					<>
						<br />
						<b>Lekcja odwołana.</b>
					</>
				);

			if (getZastepstwo(lekcja, lekcja.grupa)?.uwagi)
				return (
					<>
						<br />
						Uwagi:{" "}
						<b>{getZastepstwo(lekcja, lekcja.grupa)?.uwagi}</b>
					</>
				);
			return;
		};

		const zaste = getZastepstwo(lekcja, lekcja.grupa);

		let textColor = "light";
		if (zaste) {
			//@ts-ignore
			if (getZastepstwo(lekcja, lekcja.grupa).zastepstwo)
				textColor = "warning";
			else textColor = "danger";
		}

		let borderColor = "secondary";
		if (hasZastepstwaData(lekcja)) {
			if (zaste) {
				//@ts-ignore
				if (zaste.zastepstwo) borderColor = "warning";
				else borderColor = "danger";
			} else borderColor = "light";
		}

		let nauczycielText = <b>{nauczyciel(lekcja, nauczyciele, nLoading)}</b>;
		let salaText = <b>{sala(lekcja)}</b>;
		let przedmiotText = fullPrzedmiot(lekcja);
		if (zaste) {
			if (zaste.zastepca)
				nauczycielText = (
					<>
						<s>{nauczyciel(lekcja, nauczyciele, nLoading)}</s>{" "}
						<b>{zaste.zastepca}</b>
					</>
				);
			else
				nauczycielText = (
					<s>{nauczyciel(lekcja, nauczyciele, nLoading)}</s>
				);

			if (lekcja.sala != zaste.sala)
				salaText = (
					<>
						<s>{sala(lekcja)}</s> <b>{zaste.sala}</b>
					</>
				);

			if (zaste.zastepstwo && lekcja.przedmiot != zaste.przedmiot) {
				przedmiotText = (
					<>
						<s>{fullPrzedmiot(lekcja)}</s>{" "}
						<b>{fullPrzedmiot(lekcja, true)}</b>
					</>
				);
			} else if (!zaste.zastepstwo)
				przedmiotText = (
					<>
						<s>{fullPrzedmiot(lekcja)}</s>
					</>
				);
		}

		return (
			<Card
				style={{ maxWidth: "24rem" }}
				bg="dark"
				text={textColor}
				border={borderColor}
			>
				<Card.Body>
					<Card.Title>
						{lekcja.godzina}. {godziny(lekcja.godzina)}
					</Card.Title>
					<Card.Subtitle style={{ marginBottom: "5px" }}>
						{przedmiotText}
					</Card.Subtitle>
					<Card.Text>
						Nauczyciel: {nauczycielText}
						<br />
						Sala: {salaText}
						{wyswGrupa()}
						{uwagi()}
					</Card.Text>
					<Card.Footer>
						<small>{formatDate(lekcja.data, true)}</small>
					</Card.Footer>
				</Card.Body>
			</Card>
		);
	};

	const infoButton = (lekcja: Lekcja, onMobile: boolean = false) => {
		if (lekcja.przedmiot == "") return;

		let placement = "left";
		if (lekcja.dzien < 3 && !onMobile) placement = "right";

		return (
			<OverlayTrigger
				//@ts-ignore
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

	function nextWeek() {
		setWeekStart(addDays(new Date(weekStart), 7));
	}
	function prevWeek() {
		setWeekStart(addDays(new Date(weekStart), -7));
	}

	function nextDay() {
		const date = new Date(selectedDay);
		if (date.getDay() == 5) nextWeek();
		setSelectedDay(addDays(new Date(date), 1, true));
	}
	function prevDay() {
		const date = new Date(selectedDay);
		if (date.getDay() == 1) prevWeek();
		setSelectedDay(addDays(new Date(date), -1, true));
	}

	const mobileVersion = (
		<>
			<div className="text-color plan-title">
				<div className="plan-title-arrow left" onClick={prevDay}>
					{"<"}
				</div>
				<div className="plan-title-el">
					{title(oddzial, loading, zLoading, isMobile)}
				</div>
				<div className="plan-title-arrow right" onClick={nextDay}>
					{">"}
				</div>
			</div>
			<div className="plan-days text-color">
				{
					// @ts-ignore
					<div
						className={`plan mobile h-${
							daysMobile[getDayFromMonday(selectedDay.getDay())]
								.length
						}`}
						key={selectedDay.getDay()}
					>
						<div className="plan-element mobile plan-element-title first">
							{
								//@ts-ignore
								schoolData.dni[
									daysStr[
										getDayFromMonday(selectedDay.getDay())
									]
								]
							}
							<br />
							<span className="plan-date">
								{formatDate(selectedDay, false)}
							</span>
						</div>
						{daysMobile[getDayFromMonday(selectedDay.getDay())].map(
							(lekcja: Lekcja, i) => {
								if (lekcja.przedmiot == "") return;
								lekcja.setDate(selectedDay);
								const day =
									days[
										getDayFromMonday(selectedDay.getDay())
									];
								i++;
								let classname = "plan-element mobile";
								if (!lekcja.przedmiot) classname += " empty";
								if (i == 1) classname += " first";
								if (i == 4 || i == 5) classname += " dpn";
								if (i == 5 || i == 6) classname += " dpp";
								if (i == day.length) classname += " last-nb";
								if (
									lekcja.grupa &&
									lekcja.grupa.charAt(0) ==
										lekcja.zastepstwo?.grupa
								) {
									if (lekcja.zastepstwo?.zastepstwo)
										classname += " zastepstwo";
									else if (lekcja.zastepstwo)
										classname += " odwolane";
								} else if (!lekcja.grupa) {
									if (lekcja.zastepstwo?.zastepstwo)
										classname += " zastepstwo";
									else if (lekcja.zastepstwo)
										classname += " odwolane";
								}

								if (loading)
									return (
										<div className={classname} key={i}>
											<div className="plan-stc">
												<div className="plan-mobile-godzina">
													{i}: {godziny(i)}
												</div>
												<div className="plan-subject mobile">
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
												<div className="plan-teacher mobile">
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
											<div className="plan-mobile-godzina">
												{lekcja.godzina}:{" "}
												{godziny(lekcja.godzina)}
											</div>
											<div className="plan-subject mobile">
												{fullPrzedmiot(lekcja, true)}
											</div>
											<div className="plan-teacher mobile">
												{nauczyciel(
													lekcja,
													nauczyciele,
													nLoading,
													true
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
											{infoButton(lekcja, true)}
										</div>
									</div>
								);
							}
						)}
					</div>
				}
			</div>
		</>
	);
	const pcVersion = (
		<>
			<div className="text-color plan-title">
				<div className="plan-title-arrow left" onClick={prevWeek}>
					{"<"}
				</div>
				<div className="plan-title-el">
					{title(oddzial, loading, zLoading, isMobile)}
				</div>
				<div className="plan-title-arrow right" onClick={nextWeek}>
					{">"}
				</div>
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
								<br />
								<span className="plan-date">
									{formatDate(
										addDays(new Date(weekStart), i),
										false
									)}
								</span>
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
								if (
									lekcja.grupa &&
									lekcja.grupa.charAt(0) ==
										lekcja.zastepstwo?.grupa
								) {
									if (lekcja.zastepstwo?.zastepstwo)
										classname += " zastepstwo";
									else if (lekcja.zastepstwo)
										classname += " odwolane";
								} else if (!lekcja.grupa) {
									if (lekcja.zastepstwo?.zastepstwo)
										classname += " zastepstwo";
									else if (lekcja.zastepstwo)
										classname += " odwolane";
								}

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
												{fullPrzedmiot(lekcja, true)}
											</div>
											<div className="plan-teacher">
												{nauczyciel(
													lekcja,
													nauczyciele,
													nLoading,
													true
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

	return isMobile ? mobileVersion : pcVersion;
}

export default Plan;
