import ClassSelector from "./ClassSelector";
import Plan from "./Plan";
import { useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Body() {
	const [oddzial, setOddzial] = useState(cookies.get("oddzial"));
	const [grupaZaw, setGrupaZaw] = useState(1);
	const [religia, setReligia] = useState(true);
	const [etyka, setEtyka] = useState(true);
	const [grupaSpec, setGrupaSpec] = useState(1);
	const [grupaAng, setGrupaAng] = useState(1);
	const [grupaJO2, setGrupaJO2] = useState(1);

	//@ts-ignore
	function handleOddzial(e) {
		setOddzial(e.target.id);
		cookies.set("oddzial", e.target.id, { path: "/" });
	} //@ts-ignore
	function handleGrupaZaw(e) {
		setGrupaZaw(e.target.value);
	} //@ts-ignore
	function handleReligia(e) {
		setReligia(e.target.value);
	} //@ts-ignore
	function handleEtyka(e) {
		setEtyka(e.target.value);
	} //@ts-ignore
	function handleGrupaSpec(e) {
		setGrupaSpec(e.target.value);
	} //@ts-ignore
	function handleGrupaAng(e) {
		setGrupaAng(e.target.value);
	} //@ts-ignore
	function handleGrupaJO2(e) {
		setGrupaJO2(e.target.value);
	}

	return (
		<>
			<ClassSelector
				oddzial={oddzial}
				grupaZaw={grupaZaw}
				religia={religia}
				etyka={etyka}
				grupaSpec={grupaSpec}
				grupaAng={grupaAng}
				grupaJO2={grupaJO2}
				onOddzial={handleOddzial}
				onGrupaZaw={handleGrupaZaw}
				onReligia={handleReligia}
				onEtyka={handleEtyka}
				onGrupaSpec={handleGrupaSpec}
				onGrupaAng={handleGrupaAng}
				onGrupaJO2={handleGrupaJO2}
			/>
			<Plan
				oddzial={oddzial}
				grupaZaw={grupaZaw}
				religia={religia}
				etyka={etyka}
				grupaSpec={grupaSpec}
				grupaAng={grupaAng}
				grupaJO2={grupaJO2}
			/>
		</>
	);
}

export default Body;
