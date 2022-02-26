<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
 <html>
  <body>
  <table border="0" cellpadding="10" align="left">
		<tr align="left">
			<td style="font-weight:bold">To:</td><td style="font-style:italic"><xsl:value-of select="email/to"/></td>
		</tr>
		<tr align="left">
			<td style="font-weight:bold">From:</td><td style="font-style:italic"><xsl:value-of select="email/from"/></td>
		</tr>
		<tr align="left">
			<td style="font-weight:bold">Cc:</td><td style="font-style:italic"><xsl:value-of select="email/cc"/></td>
		</tr>
		<tr align="left">
			<td style="font-weight:bold">Subject:</td><td style="font-style:italic"><xsl:value-of select="email/subject"/></td>
		</tr>
		<tr align="left">
			<td colspan="2" style="border-top:1px solid black;border-bottom:1px dotted black;"><xsl:value-of select="email/body"/></td>
		</tr>
		<xsl:for-each select="EMAIL/SIGNATURE">
		<tr align="left">
			<td colspan="2" style="font-weight:bold;font-style:italic;border-bottom:1px dotted black;"><xsl:value-of select="."/></td>
		</tr>
		</xsl:for-each>
  </table>
  </body>
 </html>
</xsl:template>
</xsl:stylesheet>