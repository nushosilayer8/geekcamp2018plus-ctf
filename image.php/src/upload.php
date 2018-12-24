<?php
if (isset($_GET["source"])) {
	show_source(__FILE__);
	return;
}

if (!isset($_FILES["image"])) {
	include "header.php";
	echo "<br><font color=red>File not specified</font>";
	include "footer.php";
	return;
}

$file_tmp_name = $_FILES["image"]["tmp_name"];
$file_name = $_FILES["image"]["name"];

// ensure the file is an image
$check = getimagesize($file_tmp_name);
if ($check == false) {
	include "header.php";
	echo "<br><font color=red>File is not an image</font>";
	include "footer.php";
	return;
}

// no remote exec here because $file_tmp_name is safe
$file_tmp_result_name = $file_tmp_name.".resized.jpg";
exec("gm convert ".$file_tmp_name." -resize 128x128 ".$file_tmp_result_name);

// no overwriting files here because basename ONLY strips paths
$target_resized_file = "uploads/".basename($file_name);
$ok = rename($file_tmp_result_name, $target_resized_file);

if (!$ok) {
	include "header.php";
	echo "<br><font color=red>Unable to move file</font>";
	include "footer.php";
	return;	
}

include "header.php";
?>
<br>File uploaded to <a href="<?php echo $target_resized_file; ?>">
	<?php echo $target_resized_file; ?>
</a>
<?php
include "footer.php";
?>
