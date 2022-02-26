<!DOCTYPE html>
<html>
	<head>
		<title>Risposta POST</title>
	</head>
	<body>
		<?php
			if ($_POST[name]!="" && $_POST[surname]!="") {
				echo "<p>Buongiorno $_POST[name] $_POST[surname]</p>";
			} else if ($_POST[name]==""){
				echo "<p>Buongiorno Signor $_POST[surname]</p>";
			} else echo "<p>Ciao $_POST[name]!</p>";
		?>	
	</body>
</html>
