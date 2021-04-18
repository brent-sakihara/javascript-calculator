import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

const calc = [{id: "par1", sym: "("},{id: "par2", sym: ")"},{id: "back", sym: "<-"},{id: "clear", sym: "AC"},{id: "seven", sym: "7"},{id: "eight", sym: "8"},{id: "nine", sym: "9"},{id: "divide", sym: "÷"},{id: "four", sym: "4"},{id: "five", sym: "5"}, {id: "six", sym: "6"},{id: "multiply", sym: "×"}, {id: "one", sym: "1"}, {id: "two", sym: "2"}, {id: "three", sym:"3"}, {id: "subtract", sym: "-"},{id: "zero", sym: "0"}, {id: "decimal", sym: "."}, {id: "equals",sym: "="}, {id: "add", sym: "+"}];

const opReg = /[\+\-\×\÷]+$/;
const subtractReg = /-/;
const otherOps = /[^0-9\-]/;
const hasDecimal = /[0-9]\.[0-9]*$/;
const parReg = /\($/;
const paring = /[0-9]+[\+\-\×\÷]+[0-9]+$/;
let charCount = 1;
let par1Count = 0;
let par2Count = 0;
let substring = "";

class Calculator extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      screen: "0",
      prev: ""
    };
    this.validNum = this.validNum.bind(this);
    this.validOperator = this.validOperator.bind(this);
    this.validDecimal = this.validDecimal.bind(this);
    this.back = this.back.bind(this);
    this.par1 = this.par1.bind(this);
    this.par2 = this.par2.bind(this);
    this.clear = this.clear.bind(this);
    this.equal = this.equal.bind(this);
  }
  
  validNum(symbol){
    if (this.state.screen == "0" || this.state.screen == "ERROR"){
      this.setState({
        screen: symbol
      })
    }
    else if (charCount < 17){
     this.setState({
      screen: this.state.screen + symbol
    });
      charCount++;
    }
  }
  
  validOperator(symbol){
    if(!parReg.test((this.state.screen) || symbol == "-") && charCount < 17){
    if (opReg.test(this.state.screen) && symbol != "-"){
        this.setState({
        screen: this.state.screen.replace(opReg, symbol)
      });
    }
    else{
      this.setState({
        screen: this.state.screen + symbol
      });
    }
      charCount++;
    }
  }
  
  validDecimal(){
    if (this.state.screen == "0" || this.state.screen == "ERROR"){
      this.setState({
        screen: "."
      });
    }
      else if (!hasDecimal.test(this.state.screen) && charCount < 17){
      this.setState({
        screen: this.state.screen + "."
      });
        charCount++;
    }
  }
  
  back(){
    if(this.state.screen != "0" && this.state.screen != "ERROR"){
      if(this.state.screen.length == 1){
        this.setState({
          screen: "0"
        });
      }
      else{
        substring = this.state.screen.substring(this.state.screen.length-1,this.state.screen.length);
        if (substring == "("){
          par1Count--;
        }
        if(substring == ")"){
          par2Count--;
        }
        substring = "";
        this.setState({
          screen: this.state.screen.substring(0, this.state.screen.length-1)
        });
        charCount--;
      }
    }
  }
  
  par1(){
    if(this.state.screen == "0" || this.state.screen == "ERROR"){
      this.setState({
        screen: "("
      });
      par1Count++;
    }
    else if (charCount < 17){
      if(opReg.test(this.state.screen)){
        this.setState({
      screen: this.state.screen + "("
    });
         par1Count++;
        charCount++;
      }
      }
  }
  
  par2(){
    if(paring.test(this.state.screen) && par1Count > par2Count && charCount < 17){
      this.setState({
        screen: this.state.screen + ")"
      });
      par2Count++;
      charCount++;
    }
  }
  
  clear(){
    this.setState({
      screen: "0",
      prev: ""
    });
    par1Count = 0;
    par2Count = 0;
    charCount = 1;
  }
  
  equal(){
    let evaluation = this.state.screen;
    if (par1Count > par2Count){
      this.setState({
        prev: evaluation + "=",
        screen: "ERROR"
      });
      par1Count = 0;
      par2Count = 0;
      charCount = 1;
      return;
    }
    while(opReg.test(evaluation)){
      evaluation = evaluation.substring(0, evaluation.length-1);
    }
    evaluation = evaluation.replace(/×/g, "*");
    evaluation = evaluation.replace(/÷/g, "/");
    const equalTo = eval(evaluation);
    if(equalTo.length > 17){
      equalTo = equalTo.toFixed(17);
    }
    
    this.setState({
      prev: this.state.screen + "=",
      screen: equalTo
    });
    par1Count = 0;
      par2Count = 0;
      charCount = 1;
  }
  
  render(){
    const numReg = /[0-9]/;
    const decReg = /\./;
    const clearReg = /AC/;
    const equalsReg = /=/;
    
    let buttons = calc.map((obj)=>{
      if (numReg.test(obj.sym)){
        return(<button id = {obj.id} onClick = {() => this.validNum(obj.sym)}>{obj.sym}</button>);
      }
      else if (decReg.test(obj.sym)){
        return(<button id = {obj.id} onClick = {this.validDecimal}>{obj.sym}</button>);
      }
      else if (clearReg.test(obj.sym)){
        return(<button id = {obj.id} onClick = {this.clear}>{obj.sym}</button>);
      }
      else if (equalsReg.test(obj.sym)){
        return(<button id = {obj.id} onClick = {this.equal}>{obj.sym}</button>);
      }
      else if (obj.sym == "("){
        return (<button id = {obj.id} onClick = {this.par1}>{obj.sym}</button>)
      }
      else if (obj.sym == ")"){
        return (<button id = {obj.id} onClick = {this.par2}>{obj.sym}</button>)
      }
      else if (obj.sym == "<-"){
        return (<button id = {obj.id} onClick = {this.back}>{obj.sym}</button>)
      }
      return(<button id = {obj.id} onClick = {() => this.validOperator(obj.sym)}>{obj.sym}</button>);
    })
    
    return(
      <div>
        <div id = "output">
        <div id = "previous">
          {this.state.prev}
        </div>
        <div id = "display">
          {this.state.screen}
        </div>
        </div>
        {buttons}
      </div>
    );
  }
};

ReactDOM.render(<Calculator />, document.getElementById("calculator"));