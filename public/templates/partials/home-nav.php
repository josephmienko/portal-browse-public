<body class="home">
  <header>
    <nav>
      <div class="nav-wrapper">
        <a href="" class="logo"><img src="/dist/images/logo-home.png"/></a>
        <ul id="nav" class="right hide-on-med-and-down">
          <li><a href="/browse">Browse</a></li>
          <li><a href="/help">Help</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </div>
    </nav>
    <?php
      /**
       * Need a slightly different markup style because of z-index conflicts when superimposing on an image
       */
    ?>
    <ul id="slide-out" class="side-nav">
      <li><a href="/browse">Browse</a></li>
      <li><a href="/help">Help</a></li>
      <li><a href="/about">About</a></li>
    </ul>
    <a href="#" data-activates="slide-out" class="button-collapse"><i class="fa fa-bars"></i></a>
  </header>
  <main>