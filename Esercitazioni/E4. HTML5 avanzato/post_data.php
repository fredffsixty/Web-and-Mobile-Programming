<!DOCTYPE html>
<html>

    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>

        <title>Risposta alla form</title>

        <link rel='stylesheet' type='text/css' media='screen' href='form.css'>
        <link rel='icon' sizes='32x32 64x64' href='images/favicon.ico'>

    </head>


    <body>
        <h1>Risposta all'invio dei dati</h1>
        <table style="border-collapse:collapse;margin:auto;border: 1px dotted black" >
            <colgroup>
                <col span="1" style="width:250px;border-right:1px dotted black" >
                <col span="1" style="width:250px" >
            </colgroup>
            <thead>
                <tr style="font-size:1.2em;border-bottom:1px solid black">
                    <th>Informazione</th><th>Valore</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    foreach ($_POST as $name => $value){
                        if ($name == "pass" || $name == "repass")
                            echo "<tr><td>".$name." : </td><td>********</td></tr>";
                        elseif ($name != "ok")
                            echo "<tr><td>".$name." : </td><td>".$value."</td></tr>";
                    }
                ?>
            </tbody>
            </table>
    </body>
</html>