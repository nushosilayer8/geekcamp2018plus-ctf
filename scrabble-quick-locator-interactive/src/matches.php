<?php 
  include('init.php')
?>
<?php
  if(!isset($_SESSION['user'])){
    header("Location: ./login.php");
    exit();
  }
  if(isset($_GET['debug'])){
      highlight_file(__FILE__);
      exit();
  }

  $search = "%%";

  function with_blacklist($str){
      //NO SPACES!
      if(preg_match("/[ ]/", $str)){
        die("ATTEMPT TO SQLI DETECTED. INITIATING KILL MODE ZZZZZ");
      }
      return "%$str%";
  }

  if(isset($_POST['search'])){
      $search = with_blacklist($_POST['search']);
  }

  $res = $scrabblematches->query("select p1,p2,result from matches where p1 like '".$search."'");
  $matches = array();
  while($match = $res->fetch_object()){
    $matches[] = $match;
  }
?>
<?php 
  include('header.php')
?>

  <body class="text-center">

    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header class="masthead mb-auto">
        <div class="inner">
          <div class="masthead-brand">
          <img src="./assets/icon.png" width="72" height="72">
          <h3 class="">Scrabble Quick Locator Interactive</h3>
          </div>
          <nav class="nav nav-masthead justify-content-center">
            <a class="nav-link" href="index.php">Index</a>
            <a class="nav-link active" href="matches.php">Match History</a>
          </nav>
        </div>
      </header>

      <main role="main" class="inner cover">
        <h1 class="cover-heading">Match History</h1>
        <p class="lead">HA! I have a <a style="color:blue" href="./matches.php?debug">blacklist</a> now, and a different db! bypass dis!!</p>
        <form method="POST">
            <input name="search" placeholder="Search p1"/>
            <button name="submit">Submit</button>
        </form>
      </main>

      <div id="output">
      <?php
        foreach($matches as $match){
            echo "<div class='card' style='color:black'><h2 class='card-title'>$match->p1 vs $match->p2</h2><p class='card-text'>result = HAHA NOT SHOWING TO U</p></div>";
        }
      ?>
      </div>

      <footer class="mastfoot mt-auto">
        <div class="inner">
        
        </div>
      </footer>
    </div>
  </body>
<?php 
  include('footer.php')
?>
