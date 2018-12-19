<?php 
  include('init.php')
?>
<?php
  if(!isset($_SESSION['user'])){
    header("Location: ./login.php");
    exit();
  }
?>
<?php 
  include('header.php')
?>
<body>
        <?php
            echo "Tada: flag{5ql1_d4_b3st}";
        ?>
</body>
<?php 
  include('footer.php')
?>
