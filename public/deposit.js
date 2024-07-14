function Deposit(){
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
      bgcolor="warning"
      header="Deposit"
      status={status}
      body={show ? 
        <DepositMsg setShow={setShow} setStatus={setStatus}/> :
        <DepositForm setShow={setShow} setStatus={setStatus}/>}
    />
  )
}

function DepositMsg(props){
  return (<>
    <h5>No user is logged in</h5>
    <a href='#/login/' className="btn btn-primary" data-toggle="tooltip" title="Login with your user credentials">Login</a>
  </>);
} 

function DepositForm(props){
  const [balance, setBalance]   = React.useState(0);
  const [amount, setAmount]     = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const currentUser             = React.useContext(UserContext);

  // Getting current balance for user
  console.log(currentUser.user.email);
  const url = `/account/getbalance/${currentUser.user.email}`;
  (async () => {
      var res   =  await fetch(url);
      var dbBalance  =  Number(await res.text());
      console.log("Balance: "+dbBalance);
      setBalance(dbBalance);
  })();

  React.useEffect(() => {
    if (!amount) {
      if (!disabled) {
        setDisabled(true);
      }else{
        setDisabled(false);
      }
    }
  },[amount]);

  function handle() {
    if(!isNaN(amount) && Number(amount) > 0) { //Validation
      console.log(`amount: ${amount}`);
      const url = `/account/update/${currentUser.user.email}/${amount}`; //Updating
      (async () => {
          // Sending the data to server and then awaiting the response
          var res   =  await fetch(url);
          var data  =  await res.json();
          console.log(data);
          setBalance(data.balance);
      })();
      // Setting the status messages
      props.setStatus(`You have successfully deposited ${Math.round(Number(amount)*100)/100}!`); 
      setAmount(''); 
    } else if (Number(amount) < 0) {
      props.setStatus(`ERROR: Deposit amount cannot be 0 or negative.`);
      setAmount(''); 
    } else {
      props.setStatus(`ERROR: Deposit amount is not valid.`);
      setAmount(''); 
    }
  };


  return(<>
    <h4>Current balance: {Math.round(balance*100)/100}</h4>
    Deposit Amount<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} 
      onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-primary" 
      onClick={handle}>
        Deposit
      </button>

  </>);
}