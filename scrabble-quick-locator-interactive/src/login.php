<?php 
  include('init.php')
?>
<?php
$msg = null;
if(isset($_POST['email']) && isset($_POST['pass'])) {
  $email = $_POST['email'];
  $pass = $_POST['pass'];
  $res = $scrabble->query("select * from users where email='".$email."' and pass='".$pass."'");
  if($res->num_rows == 1) {
    $_SESSION['user'] = true;
    header("Location: ./index.php");
  } else {
    $msg = "Nope. Maybe look at hint?";
  }
}
?>
<?php 
  include('header.php')
?>
<body class="text-center">

  <form class="form-signin" method="POST">
      <img class="mb-4" src="./assets/icon.png" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Sign into Scrabble Quick Locator Interactive</h1>
      <?php
      if($msg != null){
        echo '<h2 class="h3 mb-3 font-weight-normal">' .$msg. '</h1>';
      }
      ?>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input id="inputEmail" name="email" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" name="pass" class="form-control" placeholder="Password" required>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-muted">&copy; Initium-Eternum</p>
  </form>
</body>
<?php 
  include('footer.php')
?>
