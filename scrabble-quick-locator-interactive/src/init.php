<?php
// Start the session
session_start();
$scrabble = new mysqli("db", "main", "supersecretmainpassword", "scrabble");
$scrabblematches = new mysqli("db", "main", "supersecretmainpassword", "scrabblematches");
?>