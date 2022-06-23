<!DOCTYPE html>
<html lang="de">
  <?php 
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    require_once("routePath.php");
    require_once(ROOT_PATH . 'include/function.php');
    require_once(ROOT_PATH . 'include/areas.php');
    require_once(ROOT_PATH . 'include/rocks.php');
    require_once(ROOT_PATH . 'include/routes.php');
  ?>

<head>
		<?php require_once(ROOT_PATH . 'includes_header.php'); ?>
</head>


  <body>
    <!-- Start your project here-->
    <!-- Container for demo purpose -->
<div class="container my-5 py-5">

  <!--Main Navigation-->
<header>
  <!-- Sidenav -->
  <nav
    id="sidenav-1"
    class="sidenav"
    data-mdb-hidden="false"
    data-mdb-accordion="true"
  >
    <a
      class="ripple d-flex justify-content-center py-4"
      href="#!"
      data-mdb-ripple-color="primary"
    >
      <img
        id="MDB-logo"
        src="https://mdbcdn.b-cdn.net/wp-content/uploads/2018/06/logo-mdb-jquery-small.webp"
        alt="MDB Logo"
        draggable="false"
      />
    </a>

    <ul class="sidenav-menu">
      <li class="sidenav-item">
        <a class="sidenav-link" href="">
          <i class="fas fa-chart-area fa-fw me-3"></i
          ><span>Webiste traffic</span></a
        >
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link"
          ><i class="fas fa-cogs fa-fw me-3"></i><span>Settings</span></a
        >
        <ul class="sidenav-collapse">
          <li class="sidenav-item">
            <a class="sidenav-link">Profile</a>
          </li>
          <li class="sidenav-item">
            <a class="sidenav-link">Account</a>
          </li>
        </ul>
      </li>
      <li class="sidenav-item">
        <a class="sidenav-link"
          ><i class="fas fa-lock fa-fw me-3"></i><span>Password</span></a
        >
        <ul class="sidenav-collapse">
          <li class="sidenav-item">
            <a class="sidenav-link">Request password</a>
          </li>
          <li class="sidenav-item">
            <a class="sidenav-link">Reset password</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  <!-- Sidenav -->

  <!-- Navbar -->
  <nav
    id="main-navbar"
    class="navbar navbar-expand-lg navbar-light bg-white fixed-top"
  >
    <!-- Container wrapper -->
    <div class="container-fluid">
      <!-- Toggler -->
      <button
        data-mdb-toggle="sidenav"
        data-mdb-target="#sidenav-1"
        class="btn shadow-0 p-0 me-3 d-block d-xxl-none"
        aria-controls="#sidenav-1"
        aria-haspopup="true"
      >
        <i class="fas fa-bars fa-lg"></i>
      </button>

      <!-- Search form -->
      <form class="d-none d-md-flex input-group w-auto my-auto">
        <input
          autocomplete="off"
          type="search"
          class="form-control rounded"
          placeholder='Search (ctrl + "/" to focus)'
          style="min-width: 225px"
        />
        <span class="input-group-text border-0"
          ><i class="fas fa-search"></i
        ></span>
      </form>

      <!-- Right links -->
      <ul class="navbar-nav ms-auto d-flex flex-row">
        <!-- Notification dropdown -->
        <li class="nav-item dropdown">
          <a
            class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-mdb-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-bell"></i>
            <span class="badge rounded-pill badge-notification bg-danger"
              >1</span
            >
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdownMenuLink"
          >
            <li><a class="dropdown-item" href="#">Some news</a></li>
            <li><a class="dropdown-item" href="#">Another news</a></li>
            <li>
              <a class="dropdown-item" href="#">Something else here</a>
            </li>
          </ul>
        </li>

        <!-- Icon -->
        <li class="nav-item">
          <a class="nav-link me-3 me-lg-0" href="#">
            <i class="fas fa-fill-drip"></i>
          </a>
        </li>
        <!-- Icon -->
        <li class="nav-item me-3 me-lg-0">
          <a class="nav-link" href="#">
            <i class="fab fa-github"></i>
          </a>
        </li>

        <!-- Icon dropdown -->
        <li class="nav-item dropdown">
          <a
            class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
            href="#"
            id="navbarDropdown"
            role="button"
            data-mdb-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="flag-united-kingdom flag m-0"></i>
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-united-kingdom flag"></i>English
                <i class="fa fa-check text-success ms-2"></i
              ></a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-poland flag"></i>Polski</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-china flag"></i>中文</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-japan flag"></i>日本語</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-germany flag"></i>Deutsch</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-france flag"></i>Français</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-spain flag"></i>Español</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-russia flag"></i>Русский</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="#"
                ><i class="flag-portugal flag"></i>Português</a
              >
            </li>
          </ul>
        </li>

        <!-- Avatar -->
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-mdb-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp"
              class="rounded-circle"
              height="22"
              alt="Avatar"
              loading="lazy"
            />
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdownMenuLink"
          >
            <li><a class="dropdown-item" href="#">My profile</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- Container wrapper -->
  </nav>
  <!-- Navbar -->
</header>
<!--Main Navigation-->

<!--Main layout-->
<main style="margin-top: 58px">
  <div class="container">
<!-- Section: Product details -->
<section class="mb-8">

  <style>
    .custom-title {
      font-size: 3rem;
    }
    @media (min-width: 1025px) {
      .custom-title {
        font-size: 3.5rem;
      }
    }
    .rounded-custom {
      border-top-left-radius: .5rem;
      border-bottom-left-radius: .5rem;
    }
    @media (max-width: 767px) {
      .rounded-custom {
        border-top-left-radius: .5rem;
        border-bottom-left-radius: 0rem;
        border-top-right-radius: .5rem;
      }
    }
    .rounded-custom-2 {
      border-top-right-radius: .5rem;
      border-bottom-right-radius: .5rem;
    }
    @media (max-width: 767px) {
      .rounded-custom-2 {
        border-top-right-radius: 0rem;
        border-bottom-right-radius: .5rem;
        border-bottom-left-radius: .5rem;
      }
    }
  </style>

  <div class="row">
    <div class="col-md-4 mb-4">
      <div class="card shadow-0 border rounded-5">
        <div class="card-body text-center">
          <p class="text-muted mb-1">Download the app</p>
          <h6 class="mb-0">Get an exclusive $5 off code</h6>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card shadow-0 border rounded-5">
        <div class="card-body text-center">
          <p class="text-muted mb-1">Return when you're ready</p>
          <h6 class="mb-0">60 days of free returns</h6>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card shadow-0 border rounded-5">
        <div class="card-body text-center">
          <p class="text-muted mb-1">Sign up four our newsletter</p>
          <h6 class="mb-0">15% off your first order</h6>
        </div>
      </div>
    </div>
  </div>
  <div class="row gx-0">
    <div class="col-md-6 d-flex align-items-center rounded-custom" style="background-color: #f3f4f6;">
      <div class="px-4 px-lg-5 py-5 py-lg-0">
        <h2 class="custom-title lh-1 ls-tight mb-1" style="font-weight: 900;">
          Focus on what
        </h2>
        <h2 class="custom-title lh-1 ls-tight mb-4" style="font-weight: 900;" >
          matters
        </h2>
        <p class="lead fw-normal text-muted">
          Fugiat nemo laboriosam suscipit voluptas ipsam voluptate tempora. Est distinctio asperiores vero fugiat aliquam.
        </p>
        <button type="button" class="btn btn-primary btn-lg mt-3">
          Shop productivity
        </button>
      </div>
    </div>
    <div class="col-md-6">
      <img class="w-100 rounded-custom-2" src="https://mdbootstrap.com/img/Photos/new-templates/img103.jpg" alt="">
    </div>
  </div>

</section>
<!-- Section: Product details -->

<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button
        class="accordion-button"
        type="button"
        data-mdb-toggle="collapse"
        data-mdb-target="#collapseOne"
        aria-expanded="true"
        aria-controls="collapseOne"
      >
        Accordion Item #1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-mdb-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the first item's accordion body.</strong> It is hidden by default,
        until the collapse plugin adds the appropriate classes that we use to style each
        element. These classes control the overall appearance, as well as the showing and
        hiding via CSS transitions. You can modify any of this with custom CSS or
        overriding our default variables. It's also worth noting that just about any HTML
        can go within the <strong>.accordion-body</strong>, though the transition does
        limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button
        class="accordion-button collapsed"
        type="button"
        data-mdb-toggle="collapse"
        data-mdb-target="#collapseTwo"
        aria-expanded="false"
        aria-controls="collapseTwo"
      >
        Accordion Item #2
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-mdb-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the second item's accordion body.</strong> It is hidden by
        default, until the collapse plugin adds the appropriate classes that we use to
        style each element. These classes control the overall appearance, as well as the
        showing and hiding via CSS transitions. You can modify any of this with custom CSS
        or overriding our default variables. It's also worth noting that just about any
        HTML can go within the <strong>.accordion-body</strong>, though the transition
        does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button
        class="accordion-button collapsed"
        type="button"
        data-mdb-toggle="collapse"
        data-mdb-target="#collapseThree"
        aria-expanded="false"
        aria-controls="collapseThree"
      >
        Accordion Item #3
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-mdb-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the third item's accordion body.</strong> It is hidden by default,
        until the collapse plugin adds the appropriate classes that we use to style each
        element. These classes control the overall appearance, as well as the showing and
        hiding via CSS transitions. You can modify any of this with custom CSS or
        overriding our default variables. It's also worth noting that just about any HTML
        can go within the <strong>.accordion-body</strong>, though the transition does
        limit overflow.
      </div>
    </div>
  </div>
</div>

</div>
<!-- Container for demo purpose -->
  <div class="container">
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="text-center">
        <img
          class="mb-4"
          src="https://mdbootstrap.com/img/logo/mdb-transparent-250px.png"
          style="width: 250px; height: 90px;"
        />
        <h5 class="mb-3">Thank you for using our product. We're glad you're with us.</h5>
        <p class="mb-3">MDB Team</p>
        <a
          class="btn btn-primary btn-lg"
          href="https://mdbootstrap.com/docs/standard/getting-started/"
          target="_blank"
          role="button"
          >Start MDB tutorial</a
        >
      </div>
    </div>
  </div>
  </div>
</main>
<!--Main layout-->

<!--Footer-->
<footer></footer>
<!--Footer-->

  
    <!-- End your project here-->
  </body>

  <!-- MDB ESSENTIAL -->
  <script type="text/javascript" src="node_modules/mdb-ui-kit/js/mdb.min.js"></script>
  <!-- MDB PLUGINS -->
  <script type="text/javascript" src="node_modules/mdb-ui-kit/plugins/js/all.min.js"></script>
  <!-- Custom scripts -->
  <script type="text/javascript">

const sidenav = document.getElementById("sidenav-1");
const sidenavInstance = mdb.Sidenav.getInstance(sidenav);

let innerWidth = null;

const setMode = (e) => {
  // Check necessary for Android devices
  if (window.innerWidth === innerWidth) {
    return;
  }

  innerWidth = window.innerWidth;

  if (window.innerWidth < 1400) {
    sidenavInstance.changeMode("over");
    sidenavInstance.hide();
  } else {
    sidenavInstance.changeMode("side");
    sidenavInstance.show();
  }
};

setMode();

// Event listeners
window.addEventListener("resize", setMode);
  </script>
</html>
