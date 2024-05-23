function Plan() {
	return (
		<div>
			<div className="cs text-color plan-title">
				Plan lekcji dla oddziału PLACEHOLDER
			</div>
			<div className="plan-days text-color">
				<div className="plan hours">
					<div className="plan-element plan-element-title first">
						Godzina
					</div>
					<div className="plan-element first">1 - 8:00-8:45</div>
					<div className="plan-element">2 - 8:50-9:35</div>
					<div className="plan-element">3 - 9:40-10:25</div>
					<div className="plan-element">4 - 10:30-11:15</div>
					<div className="plan-element">5 - 11:35-12:20</div>
					<div className="plan-element">6 - 12:40-13:25</div>
					<div className="plan-element">7 - 13:30-14:15</div>
					<div className="plan-element">8 - 14:20-15:05</div>
					<div className="plan-element">9 - 15:10-15:55</div>
					<div className="plan-element last-nb">10 - 16:00-16:45</div>
				</div>
				<div className="plan monday">
					<div className="plan-element plan-element-title first">
						Poniedziałek
					</div>
					<div className="plan-element first">
						Dominik Męczkowski lekcja
					</div>
					<div className="plan-element last">
						Dominik Męczkowski lekcja2
					</div>
				</div>
				<div className="plan tuesday">
					<div className="plan-element plan-element-title first">
						Wtorek
					</div>
				</div>
				<div className="plan wednesday">
					<div className="plan-element plan-element-title first">
						Środa
					</div>
				</div>
				<div className="plan thursday">
					<div className="plan-element plan-element-title first">
						Czwartek
					</div>
				</div>
				<div className="plan friday">
					<div className="plan-element plan-element-title first">
						Piątek
					</div>
				</div>
			</div>
		</div>
	);
}

export default Plan;
