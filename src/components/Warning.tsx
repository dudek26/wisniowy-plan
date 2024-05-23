import Alert from "react-bootstrap/Alert";

function Warning() {
	return (
		<div className="alert">
			<Alert variant="warning" className="mb-0" data-bs-theme="light">
				<Alert.Heading>Strona w budowie</Alert.Heading>
				<p>
					Projekt Wiśniowy Plan jest w budowie. Na stronie mogą
					wystąpić błędy, braki w funkcjonalności oraz przerwy w
					działaniu. Prosimy o cierpliwość.
				</p>
				<hr />
				<p className="mb-0">
					Jeśli chcesz pomóc w tworzeniu strony możesz to zrobić na{" "}
					<Alert.Link href="https://github.com/dudek26/wisniowy-plan">
						GitHubie
					</Alert.Link>
					.
				</p>
			</Alert>
		</div>
	);
}

export default Warning;
