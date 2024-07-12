const Route       = ReactRouterDOM.Route;
const Link        = ReactRouterDOM.Link;
const HashRouter  = ReactRouterDOM.HashRouter;
const UserContext = React.createContext(null);

function Card(props){
  function classes(){
    //const bg  = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
    //const txt = props.txtcolor ? ' text-' + props.txtcolor: ' text-white';
    //return 'card mb-3 ' + bg + txt + " h-100 d-flex justify-content-center";
    return 'card w-50 mb-3 ';
  }

  const headerStyle = {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.5em"
  }

  return (
    <div className={classes()}>
      <div className="card-header" style={headerStyle}>{props.header}</div>
      <div className="card-body" style={{textAlign: props.textAlignment ? props.textAlignment : "center"}}>
        {props.title && (<h5 className="card-title">{props.title}</h5>)}
        {props.text && (<p className="card-text">{props.text}</p>)}
        {props.body}
        {props.status && (<div id='createStatus'>{props.status}</div>)}
      </div>
    </div>      
  );    
}
