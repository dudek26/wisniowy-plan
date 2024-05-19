function Navbar() {
  function handleThemes() {
    alert("soon");
  }

  return (
    <div className="header text-color">
      <div className="header-logo">
        <img src="/wisniowyplan.png" className="header-icon" />
        Wiśniowy Plan
      </div>

      <div className="header-themes-button text-color" onClick={handleThemes}>
        <img src="/button/themes.svg" className="header-button-icon" />
        Motyw
      </div>
    </div>
  );
}

export default Navbar;
