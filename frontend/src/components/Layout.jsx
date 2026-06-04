import Navbar from "./Navbar";

import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";

import "../styles/Dashboard.css";

function Layout({

children

}){

return(

<div
className=
"layout"
>

<Sidebar/>

<div
className=
"content"
>

<div>

<Navbar/>

<ThemeToggle/>

</div>

{children}

</div>

</div>

);

}

export default Layout;
