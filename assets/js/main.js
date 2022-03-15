const roundNums = 2;

const app = Vue.createApp({
    data() {
        return {
            result: '',
            buttons: [
                {
                    type: "operation-second",
                    value: "e",
                },

                {
                    type: "operation-second",
                    value: "PI",
                },
                {
                    type: "operation-second",
                    value: "log",
                },
                {
                    type: "reset",
                    value: "DEL"
                },
                {
                    type: "operation-second",
                    value: "()",
                },
                {
                    type: "operation-second",
                    value: "sqrt",
                    text: "√"
                },
                {
                    type: "operation-second",
                    value: "1/x",
                },
                {
                    type: "operation-second",
                    value: "x^2",
                    text: "x²"
                },
                {
                    type: "operation-second",
                    value: "sin",
                },
                {
                    type: "operation-second",
                    value: "cos",
                },
                {
                    type: "operation-second",
                    value: "tan",
                },
                {
                    type: "operation-second",
                    value: "ctan",
                },
                {
                    type: "num",
                    value: "7",
                },
                {
                    type: "num",
                    value: "8",
                },
                {
                    type: "num",
                    value: "9",
                },
                {
                    type: "operation",
                    value: "+",
                },
                {
                    type: "num",
                    value: "4",
                },
                {
                    type: "num",
                    value: "5",
                },
                {
                    type: "num",
                    value: "6",
                },
                {
                    type: "operation",
                    value: "-",
                },
                {
                    type: "num",
                    value: "1",
                },
                {
                    type: "num",
                    value: "2",
                },
                {
                    type: "num",
                    value: "3",
                },
                {
                    type: "operation",
                    value: "*",
                    text: "×"
                },
                {
                    type: "num",
                    value: "0",
                },
                {
                    type: "operation-second",
                    value: ".",
                },
                {
                    type: "operation-second",
                    value: "+/-",
                    text: "±"
                },
                {
                    type: "operation",
                    value: "/",
                    text: "÷"
                },

            ],
            statusExp: 0,
            // for mode 2
            modeCalculator: 1,
            initialValue: 0,
            savedValue: "",
            operator: 0
        }
    },
    template: `
    <div class="app-calculator">
        <div class="journal">
            <span class="journal-icon" @click='changeJournalPos()'>
                <i class="icon-more-vertical"></i>
            </span>
            <div class="journal-container">
                <h5>Журнал вычислений</h5>
            </div>
        </div>

        <div class="container">        
            <div class="change-mode">
                <span class="change-mode__title mode-1">обычный</span>
                <span class="change-mode__container mode" @click="modeCalc"> 
                    <span class="mode-circle"></span>
                </span>
                <span class="change-mode__title mode-2">выражения</span> 
            </div>

            <input @keyup.enter="calc()" type="text" v-model="result" placeholder="0" class="container__screen" @input="inputCl()">

            <div class="container__buttons">
                <button-calc v-for="button in buttons" :data="button" @getValue="getValue($event)"></button-calc>
            </div>
            
            <div class="container__calc">
                <button @click="reset()" class="button-calc" data-type="reset">C</button>
                <button @click="calc()" class="button-calc getValue">=</button>
            </div>
            
        </div>

        <div class="modal">
            <b>Внимание!</b>
            <p></p>
        </div>
    </div>    
    `,
    methods: {
        getValue: function (event) {
            let target = event.target,
                value = target.value;

            if(!this.modeCalculator){ // mode = 0 - режим ввода выражения
                switch (value) {
                    case "PI":
                        this.input(Math.PI);
                        break;                    
                    case "()":
                        this.addBracket();
                        break;
                    case "DEL":
                        this.del();
                        break;
                    case "e":
                        this.exponential();
                        break;
                    case "log":
                        this.getLog();
                        break;
                    case "1/x":
                        this.getInverseFraction();
                        break;
                    case "cos":
                    case "sin":
                    case "tan":
                    case "ctan":
                        this.getTrigonometry(value);
                        break;
                    case "+/-":
                        this.changeSign();
                        break;
                    case "x^2":
                        this.getStepen();
                        break;
                    case "sqrt":
                        this.getSqrt();
                        break;
                    default:
                        this.input(value);
                        break;
                }
                    
            } else { // mode = 1 - режим ввода чисел
                switch (value) {
                    case "PI":
                        this.input(Math.PI);
                        break;
                    case "1/x":
                        this.getInverseFraction();
                        break;
                    case "()":
                        this.modalWindow("modal_error", "Функция не поддерживается в данном режиме")    
                        break;
                    case "DEL":
                        this.del();
                        break;
                    case "e":
                        this.exponential();
                        break;
                    case "log":
                        this.getLog();
                        break;
                    case "cos":
                    case "sin":
                    case "tan":
                    case "ctan":
                        this.getTrigonometry(value);
                        break;
                    case "+/-":
                        this.changeSign();
                        break;
                    case "x^2":
                        this.getStepen();
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
            }
        },
        inputCl(){
            this.result = this.result.replace(/[A-Za-zА-Яа-яЁё'"#$%^&!@№;:?]/,'')
        },
        input (char) {            
            if(this.result.length >= 10 && this.modeCalculator){
                this.result = "0"
                this.savedValue = ""
                this.modalWindow("modal_warring", "Переполение строки, результаты сброшены.");
                return 0;
            }

            if(this.modeCalculator && this.result.indexOf(".") != -1 && char == ".") return;
                
            if(this.result == "0")
                this.result = ""; 

            if(this.savedValue == "0")
                this.savedValue = ""; 

            this.result = this.result.toString();

            let lastSymbol = this.result[this.result.length - 1];

            if((lastSymbol == "+" || lastSymbol == "*" || lastSymbol == "/"
            || lastSymbol == "-" || lastSymbol == ".") &&
            (char == "+" || char == "-" || char == "*" || char == "/" || char == ".")){
                this.result = this.result.slice(0, -1);
                this.savedValue = this.savedValue.slice(0, -1);
            }
            
            if(this.modeCalculator)
                this.savedValue += char
            
            this.result += char;
            this.result = this.result.replace(/[A-Za-zА-Яа-яЁё]/,'')

        },
        addBracket() {
            this.result = "(" + this.result + ")";
        },
        reset() {
            this.result = '0';
            this.savedValue = ""
        },
        calc() {
            let str = this.result;
            if(!this.modeCalculator){
                if(this.checkNullDel(this.result)) return;
                this.result = eval(this.result);
            } else {
                if(this.checkNullDel(this.savedValue)) return;
                str = this.savedValue;
                this.result = eval(this.savedValue);
                this.savedValue = ""
            }
            this.checkNum();
            this.addJournal(str + " = <b>" + this.result + "</b>");
            this.operator = 0; 
        },
        del() {
            this.result = this.result.toString();
            if (this.result.length === 1) {
                this.result = "0";
            } else {
                this.result = this.result.slice(0, -1);
            }
        },
        exponential(){
            if(this.statusExp){                
                this.result = Number(this.result).toFixed(3)
                this.result = this.result.replace(/\.?0+$/,'')
                this.statusExp = 0;
            }
            else{
                this.result = Number(this.result).toExponential(roundNums);
                this.statusExp = 1;
            }
        },
        getLog(){
            let str = this.result;
            this.result = (Math.log(eval(this.result)) / Math.log(10));
            this.checkNum();
            this.addJournal("log 10 (" + str + ")^2 = <b>" + this.result + "</b>");
        },
        getTrigonometry(type){
            let num = Number(eval(this.result));
            let str = this.result;
            if(isNaN(num)) {
                this.result = "0";
                return;
            }

            switch(type){
                case "tan":
                    this.result = Math.tan(num);
                    break;
                case "ctan":
                    this.result = 1 / Math.tan(num);
                    break;
                case "sin":
                    this.result = Math.sin(num);
                    break;
                case "cos":
                    this.result = Math.cos(num);
                    break;
            }
            this.checkNum();

            this.addJournal(type + "(" + str + ") = <b>" + this.result + "</b>");            
        },
        changeSign(){
            if(this.result.substring(0, 1) == "-")
                this.result = this.result.substring(1, this.result.length)
            else
                this.result = "-" + this.result
        },
        getStepen(){
            let str = this.result; 
            this.result = eval(this.result) * eval(this.result);
            this.checkNum();
            this.addJournal("(" + str + ")^2 = <b>" + this.result + "</b>");
        },
        getSqrt(){
            let str = this.result; 
            this.result = eval(this.result); 
            if(this.result < 0){                
                this.modalWindow("modal_warring", "Корень из отрицательного числа " + this.result + " пока считать нет сил!");
                this.result = "0"
                this.savedValue = "";
                return;
            }
            this.result = Math.sqrt(this.result);
            this.checkNum();
            this.addJournal("sqrt(" + str + ") = <b>" + this.result + "</b>");
        },
        getInverseFraction(){
            let str = "1/" + this.result;
            this.result = eval(str);
            this.checkNum();
            this.addJournal(str + " = <b>" + this.result + "</b>");
        },
        checkNum(){
            this.result = Number(this.result);
            if(isNaN(this.result)) {
                this.result = "0";
                return;
            }
            if(!Number.isInteger(this.result))
                this.result = Number(this.result).toFixed(roundNums);
                
            this.result = this.result.toString();
            if((this.result.length >= 10 && this.modeCalculator) || this.result == "Infinity"){
                this.result = "0"
                this.savedValue = ""
                this.modalWindow("modal_warring", "Переполение строки, результаты сброшены.");
                return;
            }   
        },
        checkNullDel(val){
            if(val.indexOf('/0') != -1){
                this.result = "0"
                this.savedValue = ""
                this.modalWindow("modal_error", "Вы делите на ноль, а так нельзя!");
                this.operator = 0;
                return true;
            }
            return false;
        },
        changeJournalPos(){
            let journal = document.querySelector(".journal-container")
            if(journal.classList.contains("journal-container_open"))
            journal.classList.remove('journal-container_open')
            else journal.classList.add('journal-container_open')
        },
        addJournal(str){            
            let journal = document.querySelector(".journal-container");
            journal.innerHTML += "<p>" + str + "</p>"
        },
        modeCalc(){            
            this.modeCalculator = this.modeCalculator == 0 ? 1 : 0;
            this.result = "0";

            if(!this.modeCalculator){
                document.body.classList.add('mode-2')
            } else {
                document.body.classList.remove('mode-2')
            }
        },
        operationAdd(opr){
            console.log(this.operator);
            console.log(this.savedValue)
            if(this.operator){
                this.result = eval(this.savedValue);
                this.savedValue = this.result + opr;
            } else {
                this.savedValue = this.result + opr;
            }
            this.operator = opr;
            this.result = "0"
        },
        modalWindow(classM, mess){
            let modal = document.querySelector('.modal');
            modal.classList.toggle("modal_open");
            modal.classList.remove("modal_error", "modal_warring");
            modal.classList.add(classM);
            modal.querySelector('p').textContent = mess
            setTimeout(() => {
                modal.classList.toggle("modal_open");
            }, 1500);
        }
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