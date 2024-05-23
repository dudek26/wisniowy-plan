import Navbar from "./components/Header";
import "./App.css";
import ClassSelector from "./components/ClassSelector";
import Warning from "./components/Warning";
import Plan from "./components/Plan";

function App() {
	return (
		<div className="content">
			<Navbar />
			<Warning />
			<ClassSelector />
			<Plan />
		</div>
	);
}

export default App;
