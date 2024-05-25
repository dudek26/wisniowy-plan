import Navbar from "./components/Header";
import "./App.css";
import Warning from "./components/Warning";
import Body from "./components/Body";

function App() {
	return (
		<div className="content">
			<Navbar />
			<Warning />
			<Body />
		</div>
	);
}

export default App;
