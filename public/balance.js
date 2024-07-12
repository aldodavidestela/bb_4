function Balance(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [email, setEmail]    = React.useState('');
  const currentUser          = React.useContext(UserContext);

  // Getting authentication status
  auth.onAuthStateChanged((userCredential) => {
    if (userCredential) {
      currentUser.user = userCredential;
      //console.log(`currentUser: ${currentUser.user.email}`);
      setEmail(currentUser.user.email);
      setShow(false);
      document.getElementById('currentUserEmail').innerHTML = `Logged in as: ${currentUser.user.email}`;
    } else {
      setShow(true)
      currentUser.user = {};
      document.getElementById('currentUserEmail').innerHTML = "Not logged in";
    }
  });

  return (
    <Card
      bgcolor="info"
      header="Balance"
      status={status}
      body={show ?
        <BalanceMsg setShow={setShow} setStatus={setStatus}/> :
        <BalanceForm setShow={setShow} setStatus={setStatus}/>}
    />
  )

}

function BalanceMsg(props){
  return (<>
    <h5>No user is logged in</h5>
    <a href='#/login/' className="btn btn-primary" data-toggle="tooltip" title="Login with your user credentials">Login</a>
  </>);
}

function BalanceForm(props){
  const [email, setEmail]     = React.useState('');
  const [balance, setBalance] = React.useState('');
  const currentUser           = React.useContext(UserContext);

  // Getting current balance for user
  console.log(currentUser.user.email);
  const url = `/account/getbalance/${currentUser.user.email}`;
  (async () => {
      var res   =  await fetch(url);
      var userData  =  await res.json();
      console.log(JSON.stringify(userData));
      console.log("Balance: "+userData.balance);
      setBalance(userData.balance);
  })();

  function refreshPage() {
    history.go(0);
  }

  return (<>

    <h4>Your current balance is: {Math.round(balance*100)/100}</h4>
    
    <button type="button" 
      className="btn btn-primary" 
      onClick={refreshPage}>
        Refresh
    </button>

  </>);
}