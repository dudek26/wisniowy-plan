import React from "react";
import { Dropdown } from "react-bootstrap";
import Cookies from "universal-cookie";

import { useState, useEffect } from "react";

const cookies = new Cookies();

function Navbar() {
	const defTheme = cookies.get("theme") ? cookies.get("theme") : 1;

	const [theme, setTheme] = useState(defTheme);
	const click = (theme: React.SetStateAction<number>) => {
		setTheme(theme);
	};
	useEffect(() => {
		document.body.style.backgroundImage = `url(/background/${theme}.png)`;
		cookies.set("theme", theme, {
			path: "/",
			expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 365),
		});
	}, [theme]);

	let themeItems = [1, 2, 3, 4, 5, 6, 7, 8];

	//@ts-ignore
	const CustomToggle = React.forwardRef(({ onClick }, ref) => (
		<div
			className="header-themes-button text-color"
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			<img src="/button/themes.svg" className="header-button-icon" />
			Motyw
		</div>
	));

	return (
		<div className="header text-color">
			<div className="header-logo">
				<img src="/wisniowyplan.png" className="header-icon" />
				Wiśniowy Plan
			</div>
			<Dropdown align={{ lg: "end" }} data-bs-theme="dark">
				<Dropdown.Toggle as={CustomToggle} />
				<Dropdown.Menu>
					{themeItems.map((i) => (
						<Dropdown.Item
							key={i}
							onClick={() => {
								click(i);
							}}
						>
							<img
								src={`/background/${i}.png`}
								className="theme-icon"
							/>
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
}

export default Navbar;
