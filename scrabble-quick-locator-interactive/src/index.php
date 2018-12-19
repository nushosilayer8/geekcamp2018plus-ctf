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

  <body class="text-center">

    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header class="masthead mb-auto">
        <div class="inner">
          <div class="masthead-brand">
          <img src="./assets/icon.png" width="72" height="72">
          <h3 class="">Scrabble Quick Locator Interactive</h3>
          </div>
          <nav class="nav nav-masthead justify-content-center">
            <a class="nav-link active" href="#">Index</a>
            <a class="nav-link" href="matches.php">Match History</a>
          </nav>
        </div>
      </header>

      <main role="main" class="inner cover">
        <h1 class="cover-heading">Search Words</h1>
        <p class="lead">Flag: flag{5ql1_d4_b3st}</p>
        <input id="search" placeholder="Type 'a'"/>
      </main>

      <div id="output">
      </div>

      <footer class="mastfoot mt-auto">
        <div class="inner">
        
        </div>
      </footer>
    </div>
    <script>
    let out = $("#output");
    $("#search").bind("input", function(){
      let v = $(this).val();
      out.empty()
      if(v == null || v == "") return;

      // try to GET this without any params! its so awesome!
      $.get("./search.php", {data: v}, res => {
        let arr = JSON.parse(res);
        for(let d of arr){
          console.log(d);
          out.append("<div class='card' style='margin:10px;color:black;'><h5 class='card-title'>"+d.name+"</h5><p class='card-text'>"+d.def+"</p></div>");
        }
      })
    });
    </script>
  </body>
<?php 
  include('footer.php')
?>
