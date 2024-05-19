import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { useQuery } from "@tanstack/react-query";

const planURL = "https://planlekcji.staff.edu.pl/";
const planLista = "lista.html";

function Oddzialy(
  oddzialy: (string | null)[],
  isLoading: boolean,
  error: Error | null
) {
  if (isLoading) {
    return <Dropdown.Item key={"loading"}>{"Ładowanie..."}</Dropdown.Item>;
  }
  if (error) {
    return <Dropdown.Item key={"error"}>{"Błąd."}</Dropdown.Item>;
  }
  return oddzialy.map((oddzial) => (
    <Dropdown.Item key={oddzial} href={`/oddzial/${oddzial}`}>
      {oddzial}
    </Dropdown.Item>
  ));
}

function ClassSelector() {
  const {
    data: oddzialy = [],
    isLoading,
    error,
  } = useQuery({
    queryFn: () =>
      fetch(planURL + planLista)
        .then((res) => res.text())
        .then((data) => {
          let parser = new DOMParser();
          let docPlanOddzialy = parser.parseFromString(data, "text/html");
          let plans = docPlanOddzialy.querySelectorAll("ul").item(0).children;
          let list: (string | null)[] = [];
          for (let plan of plans) {
            list.push(plan.textContent);
          }
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
          //@ts-ignore
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
                //@ts-ignore
                !value || child.props.children.toLowerCase().includes(value)
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
          <Dropdown.Toggle variant="secondary">Wybierz oddział</Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu}>
            {Oddzialy(oddzialy, isLoading, error)}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default ClassSelector;
