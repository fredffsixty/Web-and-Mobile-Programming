<!DOCTYPE html>
<html>
	<head>
		<title>Risposta GET</title>
	</head>
	<body>
		<?php
			if ($_GET[name]!="" && $_GET[surname]!="") {
				echo "<p>Buongiorno $_GET[name] $_GET[surname]</p>";
			} else if ($_GET[name]==""){
				echo "<p>Buongiorno Signor $_GET[surname]</p>";
			} else echo "<p>Ciao $_GET[name]!</p>";
		?>	
	</body>
</html>
