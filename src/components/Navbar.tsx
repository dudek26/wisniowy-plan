import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

import { useState, useEffect } from "react";

function Navbar() {
  const [theme, setTheme] = useState(1);
  const click = (theme: React.SetStateAction<number>) => {
    setTheme(theme);
  };
  useEffect(() => {
    document.body.style.backgroundImage = `url(/background/${theme}.png)`;
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
              onClick={() => {
                click(i);
              }}
            >
              <img src={`/background/${i}.png`} className="theme-icon" />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Navbar;
