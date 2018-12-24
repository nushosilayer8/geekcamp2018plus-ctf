<?php
include "header.php";
?>
<form action="upload.php" method="POST" enctype="multipart/form-data">
	<input type="file" name="image" accept="image/*">
	<button type="submit">
		Upload
	</button>
</form>
<a href="upload.php?source">View source</a>
<?php
include "footer.php";
?>
