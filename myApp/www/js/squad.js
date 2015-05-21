angular.module('starter.squad', []).factory('Squad', function (Operator) {

    /**
     * Constructor, with class name
     */
    function Squad(id, operators, image) {
        this.id = id;
        this.operators = [];
        if (!operators instanceof Array) {
            console.log('Trying to add an non Array object!!');
        } else if(operators){
            for (var i = 0; i < operators.length; i++) {
                var obj = operators[i];
                this.addOperator(obj);
            }
        }
    }
    Squad.prototype.addOperator = function (operator) {
        if (!operator instanceof Operator) {
            console.log('Trying to add an non Operator object!!');
        } else {
            this.operators[operator.username] = operator;
        }
    };
    Squad.prototype.removeOperator = function (operator) {
        if (!operator instanceof Operator) {
            console.log('Trying to remove an non Operator object!!');
        }
        this.operators.splice(operator);
    };
    Squad.prototype.operatorsCount = function () {
        return this.operators.length;
    };
    return Squad;
});