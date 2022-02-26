<?xml version="1.0" encoding="UTF-8" ?>

<xsl:stylesheet version="1.0" 
	xmlns="urn:prowebmo:emp" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:preserve-space elements="emp:phonenumber" />

	<xsl:template match="/">
		<html>
		<head>
			<title>Employees</title>
			<meta name='referrer' content='no-referrer' />
		</head>
		<body>
		<ul><xsl:for-each select="emp:employees/emp:employee">
			<li><xsl:value-of select="@name" />
				<ol>
				<xsl:for-each select="emp:phonenumber">
				 	<li><xsl:value-of select="@type" /><xsl:value-of select="." /></li>
			 	</xsl:for-each>
			 	</ol></li>
		</xsl:for-each></ul>
		</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
