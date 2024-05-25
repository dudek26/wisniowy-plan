import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";

const apiURL = "https://wisniowy-plan-backend.onrender.com/";
const planyURL = "plany/";

function ClassSelector({
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

	//@ts-ignore
	onOddzial,
	//@ts-ignore
	onGrupaZaw,
	//@ts-ignore
	onReligia,
	//@ts-ignore
	onEtyka,
	//@ts-ignore
	onGrupaSpec,
	//@ts-ignore
	onGrupaAng,
	//@ts-ignore
	onGrupaJO2,
}) {
	function Oddzialy(
		oddzialy: string[],
		isLoading: boolean,
		error: Error | null
	) {
		if (isLoading) {
			return (
				<Dropdown.Item key={"loading"}>
					{"Ładowanie oddziałów..."}
				</Dropdown.Item>
			);
		}
		if (error) {
			return (
				<Dropdown.Item key={"error"}>
					{"Wystąpił błąd podczas"} <br />{" "}
					{"ładowania listy oddziałów."}
				</Dropdown.Item>
			);
		}
		return oddzialy.map((oddzial) => (
			<Dropdown.Item key={oddzial} onClick={onOddzial} id={oddzial}>
				{oddzial}
			</Dropdown.Item>
		));
	}

	const {
		data: oddzialy = [],
		isLoading,
		error,
	} = useQuery({
		queryFn: () =>
			// planURL + planLista
			fetch(apiURL + planyURL)
				.then((res) => res.json())
				.then((data: JSON) => {
					let list: string[] = [];
					//@ts-ignore
					for (var i in data) list.push([data[i]]);
					return list;
				}),
		queryKey: ["oddzialy"],
	});

	const CustomMenu = React.forwardRef(
		//@ts-ignore
		({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
			const [value, setValue] = useState("");

			return (
				<div
					// @ts-ignore
					ref={ref}
					style={style}
					className={className}
					aria-labelledby={labeledBy}
				>
					<Form.Control
						autoFocus
						className="mx-3 my-2 w-auto"
						placeholder="Wyszukaj oddział"
						onChange={(e) => setValue(e.target.value)}
						value={value}
					/>
					<ul className="list-unstyled">
						{React.Children.toArray(children).filter(
							(child) =>
								!value ||
								//@ts-ignore
								child.props.children
									.toLowerCase()
									.includes(value)
						)}
					</ul>
				</div>
			);
		}
	);

	return (
		<div className="cs text-color">
			<div className="cs-wp">
				<span className="cs-wp-title">
					<i className="bi bi-calendar"></i>Wiśniowy Plan
				</span>
				<br />
				<span className="cs-wp-description">soon</span>
				<br />
				<br />
				<Dropdown data-bs-theme="dark">
					<Dropdown.Toggle variant="secondary">
						Wybierz oddział
					</Dropdown.Toggle>
					<Dropdown.Menu as={CustomMenu}>
						{Oddzialy(oddzialy, isLoading, error)}
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	);
}

export default ClassSelector;
