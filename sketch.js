body{
margin:0;
background:linear-gradient(160deg,#14213d,#0b132b);
font-family:Arial, Helvetica, sans-serif;
overflow:hidden;
}

#app{
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
height:100vh;
width:100vw;
}

#canvas-holder{
display:flex;
justify-content:center;
align-items:center;
}

#controls{
margin-top:20px;
}

button{
padding:12px 25px;
border:none;
background:#ff7aa2;
color:white;
font-size:16px;
border-radius:8px;
cursor:pointer;
}

button:hover{
background:#ff4f87;
}

/* MOBILE (portrait) */
@media (max-width:768px){

#canvas-holder canvas{
width:95vw !important;
height:75vh !important;
}

}

/* DESKTOP (landscape) */
@media (min-width:769px){

#canvas-holder canvas{
width:900px !important;
height:550px !important;
}

}
