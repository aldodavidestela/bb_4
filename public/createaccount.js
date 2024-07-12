function CreateAccount(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [email, setEmail]   = React.useState('');
  const currentUser         = React.useContext(UserContext);

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
  })

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={show ? 
        <CreateForm setShow={setShow} setStatus={setStatus}/> : 
        <CreateMsg setShow={setShow} setStatus={setStatus}/>}
    />
  )
}

function CreateMsg(props){

  const currentUser = React.useContext(UserContext);

  function logout() {
    firebase.auth().signOut()
      .then(() => {
        console.log("You have signed out successfully!")
        props.setStatus("You have signed out successfully!");
        props.setShow(true);
        document.getElementById('currentUserEmail').innerHTML = "Not logged in";
      })
      .catch((error) => {
        props.setStatus("Error signing out");
      })      
  }

  return(<>
    <h5>You are currently logged in as {currentUser.user.email}</h5>
    <button type="submit" 
      className="btn btn-primary" 
      onClick={logout}>
        Logout
      </button>
  </>);
}

function CreateForm(props){
  const [name, setName]         = React.useState('');
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const currentUser             = React.useContext(UserContext);

  // Validating inputs
  React.useEffect(() => {
    if (!name || !password || !email) {
      if (!disabled) {
        setDisabled(true);
      }
    } else {
        setDisabled(false);
    }
  }, [name, password, email]);


  function handle() { 
    // Creating new account
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            document.getElementById('currentUserEmail').innerHTML = "Logged in as: " + userCredential.user.email;
            console.log('Account created successfully');
            
            // Creating record in 'local' database
            const url = `/account/create/${name}/${email}/${password}`;
            (async () => {
                var res   =  await fetch(url);
                var data  =  await res.json();
                console.log(data);
            })();
            props.setStatus('Account created successfully');
            
        })
        .catch((error) => {    
            var errorMessage = `Error Message: ${error.message}`;
            console.log(errorMessage);
            props.setStatus(errorMessage);
  
            setEmail('');
            setPassword('');
        })
  };

  // Google OAuth2 login function
  function loginGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((userCredential) => {
        // Check if the user already has an account in the database by checking balance
        const url = `/account/getbalance/${userCredential.user.email}`;
        console.log(`url: ${url}`);
        (async () => {
          // Sending the data to server and then awaiting the response
          var res   =  await fetch(url);        
          var userData  =  await res.text();
          console.log(`Database Response: ${userData}`)
          if (userData == '') {
            // Case if user does not exist
            console.log(`User does not exist, creating account`);
            var createAccountMessage = `Account successfully created for: ${userCredential.user.email}`;
            // Setting the account up in the database
            const url = `/account/create/${userCredential.user.displayName}/${userCredential.user.email}/GoogleAuth/`;
            (async () => {
                // Sending the data to server and then awaiting the response
                var res   =  await fetch(url);
                var data  =  await res.json();
                console.log(data);
            })();
            // Setting the status messages
            props.setStatus(createAccountMessage);
          } else {
            // If user does exist, it logs out and shows message for login
            console.log(`User does exist`);
            firebase.auth().signOut()
            props.setStatus("User already exists. Please login.");
          }
        })();
        // Function if correctly signed in
        console.log("You have signed in successfully!");
        console.log("User Credentials: " + JSON.stringify(userCredential));
        currentUser.user = userCredential;
        //Setting the status message
        props.setStatus("You have signed in successfully!");
        setEmail('');
        setPassword('');  
      })
      .catch(function (error) {
        // Function if incorrectly signed in
        console.log("Error signing in");
        // Clear the user inputs
        setEmail('');
        setPassword('');
        // Setting the status message
        props.setStatus(`Error Message: ${error.message}`); 
      });
  }

  return (<>

    Name<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter name" 
      value={name} 
      onChange={e => setName(e.currentTarget.value)} /><br/>

    Email address<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-primary" 
      onClick={handle}>Create Account</button>

<p /> 
    
    <button
        type        = "submit"
        className   = "btn btn-primary" 
        onClick     = {loginGoogle}>  
        <img src="glogo.png" alt="Responsive image" height="15em" width="15em"></img>
        &nbsp; Sign up with Google
    </button>


  </>);
}