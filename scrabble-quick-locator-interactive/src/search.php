<?php 
  include('init.php')
?>
<?php
if(isset($_GET['data'])){
    $data = $_GET['data'];
    $res = $scrabble->query("select name, def from words where name like '".$data."%'");
    $out = array();
    while($row = $res->fetch_object()){
        $out[] = $row;
    }
    echo json_encode($out);
} else {
    highlight_file(__FILE__);
}
?>