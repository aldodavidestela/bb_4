function Withdraw(){
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
      bgcolor="success"
      header="Withdraw"
      status={status}
      body={show ? 
        <WithdrawMsg setShow={setShow} setStatus={setStatus}/> :
        <WithdrawForm setShow={setShow} setStatus={setStatus}/>}
    />
  )
}

function WithdrawMsg(props){
  return (<>
    <h5>No user is logged in</h5>
    <a href='#/login/' className="btn btn-primary" data-toggle="tooltip" title="Login with your user credentials">Login</a>
  </>);
} 

function WithdrawForm(props){
  const [balance, setBalance]   = React.useState(0);
  const [amount, setAmount]     = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const currentUser             = React.useContext(UserContext);

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
      if(!isNaN(amount) && Number(amount) > 0 && Number(balance) >= Number(amount)) { //Validation
        const newAmount = (-1)*Number(amount);
        console.log(`amount: ${newAmount}`);
        const url = `/account/update/${currentUser.user.email}/${newAmount}`; //Updating
        (async () => {
            // Sending the data to server and then awaiting the response
            var res   =  await fetch(url);
            var data  =  await res.json();
            console.log(data);
            setBalance(data.balance);
        })();
        // Setting the status messages
        props.setStatus(`You have successfully withdrawn ${Math.round(Number(amount)*100)/100}!`); 
        setAmount(''); 
      } else if (Number(amount) < 0) {
        props.setStatus(`ERROR: Withdraw amount cannot be 0 or negative.`);
        setAmount(''); 
      } else if (Number(balance) < Number(amount)) {
        props.setStatus(`ERROR: Withdraw amount cannot be greater than the balance amount.`);
        setAmount('');
      } else {
        props.setStatus(`ERROR: Deposit amount is not valid.`);
        setAmount(''); 
      }
    };


  return(<>
    <h4>Current balance: {Math.round(balance*100)/100}</h4>
    Withdraw Amount<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} 
      onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-primary" 
      onClick={handle}>
        Withdraw
    </button>

  </>);
}
