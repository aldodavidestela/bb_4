function NavBar(){
  return(

    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid"> 
      <a className="navbar-brand" href="#">Aldo's Bad Bank v3</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="nav nav-pills me-auto">
          <li className="nav-item">
            <a className="nav-link" id="navCreateAccount" href="#/CreateAccount/">Create Account</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="navLogin" href="#/login/">Login</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="navDeposit" href="#/deposit/">Deposit</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="navWithdraw" href="#/withdraw/">Withdraw</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="navBalance" href="#/balance/">Balance</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="navAllData" href="#/alldata/">AllData</a>
          </li>          
        </ul>
        <span id="currentUserEmail" className="navbar-text ml-auto">
          Not logged in
        </span>
      </div>
      </div>
    </nav>

  );
}