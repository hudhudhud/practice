class Animal{
    private name:string;
    constructor(theName:string){this.name=theName;}
}
class Rhino extends Animal{
    constructor(){super("hd")}
}
class Employee{
    private name:string;
    constructor(theName:string){this.name=theName}
}

let animal=new Animal('pig');
let hd=new Rhino()
let employee = new Employee("bob")

animal=hd;

let a=window as any;