class System{
    constructor(base64Image,packDate,owner,reserveComponent,aadComponent,containerComponent,mainComponent){
        this.base64Image = base64Image;
        this.packDate = packDate;
        this.dueDate = this.addDays(this.packDate,180)
        this.owner = owner?owner:new Owner();
        
        this.reserveComponent = reserveComponent?reserveComponent:new Component();
        this.reserveComponent.type = 'reserve';

        this.aadComponent = aadComponent?aadComponent:new Component();
        this.reserveComponent.type = 'aad';

        this.containerComponent = containerComponent?containerComponent:new Component();
        this.containerComponent.type = 'container';

        this.mainComponent = mainComponent?mainComponent:new Component();
        this.mainComponent.type = 'main';

        this.validationMessage = "";
    }

    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    getDaysTillDue(){
        return (this.dueDate-new Date())/ (1000 * 60 * 60 * 24);
    }

    updateDueDate(){
        this.dueDate = this.addDays(this.packDate,180)       
    }

    isValid(){
        if(this.dueDate && this.dueDate != "Invalid Date" && this.packDate && this.packDate != "Invalid Date"){
            this.validationMessage = "";
            return true
        }else{
            this.validationMessage = "Please ensure you have entered a valid pack date!"
            return false
        }
    }
}