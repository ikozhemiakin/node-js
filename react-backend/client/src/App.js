import React from "react";
import logo from "./logo.svg";
import "./App.css";
// import Category from "./Category";
import Axios from "axios";
// import Category from "./Category";

function App() {
    Axios({
        method: "GET",
        url: "http://localhost:9000/",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        console.log(res.data.message);
    });

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );

    // async componentDidMount() {
    //
    //     Axios({
    //         method: "GET",
    //         url: "http://localhost:3000/",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }).then(res => {
    //         this.setState({name: res.data.name, description: res.data.description});
    //
    //         console.log(res.data.message);
    //     });
    //
    // }
    //
    //     const { isLoading, name, description } = this.state;
    //     return (
    //         <div className="App">
    //             <header className="App-header">
    //                 <img src={logo} className="App-logo" alt="logo" />
    //                 <h1 className="App-title">Welcome to React</h1>
    //             </header>
    //             <p className="App-intro">
    //             </p>
    //             <Category isLoading={isLoading} name={name} description={description} />
    //         </div>
    //     );
        // return (
        //     <div className="App">
        //         <header className="App-header">
        //             <img src={logo} className="App-logo" alt="logo" />
        //             <h1 className="App-title">Welcome to React</h1>
        //         </header>
        //         <ul>
        //             <Category name="Jessica Doe" description="Description" />
        //             {this.state.apiResponse.map(el => (
        //                 <li>
        //                     {el.name}
        //                 </li>
        //             ))}
        //         </ul>
        //     </div>
        // );
    }


export default App;

