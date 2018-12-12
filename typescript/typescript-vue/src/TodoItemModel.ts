class TodoItem{
    public name:string;
    public checked:boolean;
    public del:boolean;
    constructor(theName:string,theChecked:boolean=false,theDel:boolean=false){
        this.name=theName;
        this.checked=theChecked;
        this.del=theDel;
    }
}
export default TodoItem;