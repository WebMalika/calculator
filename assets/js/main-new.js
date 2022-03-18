const roundNums = 8;

const app = Vue.createApp({
    data() {
        return {
            buttons: [
                {
                    type: "main",
                    value: "F",
                    valueFunc: "F"
                },
                {
                    value: "e",
                    valueFunc: "e"
                },
                {
                    value: "PI",
                    valueFunc: "PI",
                    text: "π"
                },
                {
                    type: "reset",
                    value: "DEL"
                },
                {
                    value: "sin",
                    valueFunc: "sin"
                },
                {
                    value: "cos",
                    valueFunc: "cos"
                },
                {
                    value: "tan",
                    valueFunc: "tan"
                },
                {
                    value: "x^2",
                    text: "x²",
                    valueFunc: "x^n",
                    textFunc: "xⁿ",
                },
                {
                    value: "7",
                    valueFunc: "asin",
                },
                {
                    value: "8",
                    valueFunc: "acos",
                },
                {
                    value: "9",
                    valueFunc: "atan"
                },
                {
                    type: "operation",
                    value: "+",
                },
                {
                    value: "4",
                    valueFunc: "lg",
                },
                {
                    value: "5",
                    valueFunc: "ln",
                },
                {
                    value: "6",
                    valueFunc: "e^n",
                    textFunc: "eⁿ", 
                },
                {
                    type: "operation",
                    value: "-",
                },
                {
                    value: "1",
                    valueFunc: "1/x",
                },
                {
                    value: "2",
                    valueFunc: "10^n",
                    textFunc: "10ⁿ",
                },
                {
                    valueFunc: "sqrt", 
                    textFunc: "√x", 
                    text: "3",
                    value: "3",
                },
                {
                    type: "operation",
                    value: "*",
                    text: "×"
                },
                {
                    value: "0",
                    valueFunc: "000",
                },
                {
                    type: 'other',
                    value: ".",
                },
                {
                    value: "+/-",
                    text: "±",
                    type: 'other'
                },
                {
                    type: "operation",
                    value: "/",
                    text: "÷"
                },

            ],
            statusExp: 0,
            expStep: '0',
            savedValue: "",
            operator: 0,
            showValue: '0'
        }
    },
    template: `
    <div class="app-calculator">
        <div class="container">
            <div class="container__screen calc-screen">
                <div class="calc_screen__show_mode">DEG</div>
                <div class='calc-screen__show-res'>{{savedValue}}</div>

                <div class="calc-screen__enter">
                    <input @keyup.enter="calc()" type="text" v-model="showValue" placeholder="0" class="calc-screen__main-input" @input="inputCl()">
                    <span class="calc-screen__exp-status" :class="{active: statusExp}">E</span>
                    <input type="number" v-model="expStep" class="calc-screen__exp-input" :class="{active: statusExp}" readonly>
                </div>
            </div>
            

            <div class="container__buttons">
                <button-calc v-for="button in buttons" :data="button" @getValue="getValue($event)"></button-calc>
            </div>
            
            <div class="container__calc">
                <button @click="reset()" class="button-calc" data-type="reset">C</button>
                <button @click="calc()" class="button-calc getValue" data-type='main'>=</button>
            </div>
            
        </div>
    </div>    
    `,
    methods: {
        getValue: function (event) {
            let target = event.target,
                value = target.value;

            if(this.statusExp && value != "e"){
                this.inputStepExp(value);
                return;
            }

            switch (value) {
                case "F":
                    this.changeBtnFuncs();
                    break;
                case "PI":
                    this.input("π");
                    break;
                case "1/x":
                    this.getInverseFraction();
                    break;
                case "DEL":
                    this.del();
                    break;
                case "e":
                    this.exponential();
                    break;
                case "lg":
                    this.getLog(10);
                    break;
                case "ln":
                    this.getLog(Math.E);
                    break;
                case "cos":
                case "sin":
                case "tan":
                case "asin":
                case "acos":
                case "atan":
                    this.getTrigonometry(value);
                    break;
                case "+/-":
                    this.changeSign();
                    break;
                case "x^2":
                    this.getStepen(2);
                    break;
                case "x^n":
                    this.getStepen();
                    break;
                case "10^n":
                    this.getStepen(10);
                    break;
                case "e^n":
                    this.getStepen("e");
                    break;
                case "sqrt":
                    this.getSqrt();
                    break;
                case "+":
                case "-":
                case "/":
                case "*":
                    this.operationAdd(value);
                    break;
                default:
                    this.input(value);
                    break;
            }
        },
        inputCl(){
            this.showValue = this.showValue.replace(/[A-Za-zА-Яа-яЁё'"#$%^&!@№;:?]/,'')
        },
        changeBtnFuncs(){
            for(let i in this.buttons){
                if(this.buttons[i].type == "operation" 
                || this.buttons[i].type == "reset"
                || this.buttons[i].type == "other") continue;

                let tmpFunc = this.buttons[i].value,
                    tmpText = "";
                if(this.buttons[i].textFunc) tmpText = this.buttons[i].text;

                this.buttons[i].value =  this.buttons[i].valueFunc;
                this.buttons[i].valueFunc = tmpFunc;

                if(tmpText){
                    this.buttons[i].text = this.buttons[i].textFunc;
                    this.buttons[i].textFunc = tmpText;
                } 

            }
        },
        input (char) {
            // очищение стартового символа
            if((this.showValue == "0" && char != "."))
                this.showValue = "";

            if(this.operator){
                this.showValue = "";
                this.operator = 0;
            }
            // запрет ввода множества точек
            if(this.showValue.indexOf(".") != -1 && char == ".") return; 

            this.showValue += char;

        },
        inputStepExp(char) {
            if(this.statusExp){
                if(char == "DEL"){
                    this.expStep = this.expStep.slice(0, -1);
                    return;
                }
                
                char = Number(char);
                if(!Number.isInteger(char)) return;

                if(this.expStep.length > 2)
                    return;

                if(this.expStep == '0')
                    this.expStep = "";

                this.expStep += char;
            }
        },
        reset() {
            this.showValue = '0';
            this.savedValue = ""
            this.expStep = this.statusExp = 0
        },
        calc() {
            if(this.checkNullDel(this.savedValue)) return;

            if(this.expStep){
                this.showValue = this.showValue + "e+" + this.expStep;
                this.expStep = 0;
            }

            this.savedValue += this.showValue;
            this.savedValue = this.savedValue.replace(/\e\^/g, Math.E + "^").replace(/\^/g,"**").replace(/π/g, Math.PI) // замена всех ^ на ** // замена всех π на PI

            this.showValue = eval(this.savedValue);
            this.savedValue = '';
            this.operator = 0;

            this.checkNum(); 
        },
        del() {
            this.showValue = this.showValue.toString();
            if (this.showValue.length === 1) {
                this.result = "0";
            } else {
                this.showValue = this.showValue.slice(0, -1);
            }
        },
        exponential(){
            this.statusExp =  this.statusExp ? false : true;
        },
        getLog(base){
            this.showValue = (Math.log(eval(this.showValue + "e+" + this.expStep)) / Math.log(base));
            this.checkNum();
        },
        getTrigonometry(type){
            let st = this.showValue.replace(/\e\^/g, Math.E + "^").replace(/\^/g,"**").replace(/π/g, "*" + Math.PI);

            let num = eval((st + "e+" + this.expStep) * Math.PI / 180);

            if(isNaN(num)) {
                this.showValue = "0";
                return;
            }

            switch(type){
                case "tan":
                    this.showValue = Math.tan(num);
                    break;
                case "sin":
                    this.showValue = Math.sin(num);
                    break;
                case "cos":
                    this.showValue = Math.cos(num);
                    break;
                case "asin":
                    this.showValue = Math.asin(num);
                    break;
                case "atan":
                    this.showValue = Math.atan(num);
                    break;
                case "acos":
                    this.showValue = Math.acos(num);
                    break;
            }
            console.log(this.showValue);
            this.checkNum();         
        },
        changeSign(){
            if(this.showValue.substring(0, 1) == "-")
                this.showValue = this.showValue.substring(1, this.showValue.length)
            else
                this.showValue = "-" + this.showValue
        },
        getStepen(st){
            if(st == 2)
                this.showValue += "^2";
            else if(st == 10)
                this.showValue = "10^";
            else if(st == "e")
                this.showValue = "e^";
            else 
                this.showValue += "^";
        },
        getSqrt(){
            if(this.showValue < 0){
                this.showValue = "0"
                this.savedValue = "";
                return;
            }
            this.showValue = Math.sqrt(this.showValue);
            this.checkNum();
        },
        getInverseFraction(){
            this.showValue = eval("1/" + this.showValue);
            this.checkNum();
        },
        checkNum(){
            if(this.showValue.toString().indexOf("e+") != -1){
                let tmp_arr = this.showValue.toString().split("e+");
                this.showValue = tmp_arr[0];
                this.expStep = tmp_arr[1];
            }
            else if(this.showValue.toString().length > 2 && this.showValue > 10){
                let tmp_int = Math.round(this.showValue),
                    tmp_st = tmp_int.toString().length - 1,
                    tmp = this.showValue / (10 ** tmp_st);

                this.showValue = tmp;
                this.expStep = tmp_st;
            }

            this.showValue = Number(this.showValue);
            if(isNaN(this.showValue)) {
                this.showValue = "0";
                return;
            }
            if(!Number.isInteger(this.showValue))
                this.showValue = Number(this.showValue).toFixed(roundNums);
            
            this.showValue = this.showValue.toString().replace(/\.?0+$/,'');  
        },
        checkNullDel(val){
            if(val.indexOf('/0') != -1){
                this.showValue = "0"
                this.savedValue = ""
                this.expStep = 0
                this.statusExp = 0
                this.operator = 0;
                return true;
            }
            return false;
        },
        operationAdd(opr){
            if(this.expStep > 0){
                this.showValue = this.showValue + "e+" + this.expStep;
                this.expStep = 0;
            }
            this.savedValue = this.savedValue + this.showValue + opr;
            this.operator = opr;
        },
    }
})
app.component('button-calc', {
    props: {
        data: Object
    },
    template: `
        <button   
            class="button-calc"
            :value="data.value"
            :function="data.function"
            :data-type="data.type"
            @click="$emit('getValue', $event)"
        >
            {{data.text ? data.text : data.value}}
        </button>
    `
});
app.mount('#app')