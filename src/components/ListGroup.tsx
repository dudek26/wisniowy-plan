import { MouseEvent } from "react";

function ListGroup() {
  const items = ["2tm1", "2tm2", "2tb"];

  const handleClick = (event: MouseEvent) =>
    console.log(`(${event.clientX}, ${event.clientY})`);

  return (
    <>
      <h1>List</h1>
      {items.length === 0 ? <p>Nie odnaleziono oddziałów.</p> : null}
      <ul className="list-group">
        {items.map((item) => (
          <li key={item} className="list-group-item" onClick={handleClick}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
