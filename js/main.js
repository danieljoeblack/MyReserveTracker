var app = new Vue({
    el: '#app',
    data: {
        dateCalculatorDate: $.datepicker.formatDate( "dd/mm/yy", new Date( ) ),
        activePage: "welcome",
        currentSystem: new System(),
        systems: []
    },
    methods:{
        //GENERAL
        setPage: function(page){
            this.activePage = page;
        },

        //Reserve Tracker
        saveCurrentSystem(){
            if(this.currentSystem.isValid()){
                this.systems.push(this.currentSystem)
                this.currentSystem = new System()
                $("#edit-modal").modal("hide") 
                
                //save out the new data
                localStorage.setItem("trackedSystems",JSON.stringify(this.systems))
            }else{
                alert(this.currentSystem.validationMessage)
            }
        },
        getDueDateClass(system){
            var daysTillExpiry = system.getDaysTillDue()

            if(daysTillExpiry>30){
                return "green"
            }else if(daysTillExpiry>0){
                return "orange"
            }else{
                return "red"
            }

        },

        //Date Calculator
        getMinus180Days: function(){
            return $.datepicker.formatDate( "dd/mm/yy", this.addDays($.datepicker.parseDate("dd/mm/yy",this.dateCalculatorDate),-180) )
        },
        getPlus180Days: function(){
            return $.datepicker.formatDate( "dd/mm/yy", this.addDays($.datepicker.parseDate("dd/mm/yy",this.dateCalculatorDate),180) )
        },
        addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },
        buildSystemFromJSON(json){
            var owner = new Owner(json.owner.firstName,json.owner.lastName,json.owner.phoneNumber,json.owner.email,json.owner.address)
            var reserveComponent = new Component(json.reserveComponent.make,json.reserveComponent.model,json.reserveComponent.serialNumber,json.reserveComponent.dom,'reserve');
            var aadComponent = new Component(json.aadComponent.make,json.aadComponent.model,json.aadComponent.serialNumber,json.aadComponent.dom,'aad');
            var containerComponent = new Component(json.containerComponent.make,json.containerComponent.model,json.containerComponent.serialNumber,json.containerComponent.dom,'container');
            var mainComponent = new Component(json.mainComponent.make,json.mainComponent.model,json.mainComponent.serialNumber,json.mainComponent.dom,'main');

            var system = new System(json.base64Image,new Date(json.packDate),owner,reserveComponent,aadComponent,containerComponent,mainComponent)

            return system
        },
        startStream: async function (){
            let video = document.querySelector("#video");
            let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;
        }
    },
    filters: {
        formatDate: function (value) {
            if(value instanceof Date && value != "Invalid Date"){
                return $.datepicker.formatDate( "dd/mm/yy",value)
            }else{
                return value
            }
        }
    },
    mounted: function(){
        console.log("Application Mounted!");
        var self = this;
        $( ".datepicker" ).datepicker({ 
            dateFormat: 'dd/mm/yy',
            onSelect: function(){
                if(this.id == 'dateCalculatorDate'){
                    self.dateCalculatorDate = this.value//$.datepicker.parseDate("dd/mm/yy",this.value);  
                }
                else if(this.id == "packDate"){
                    self.currentSystem.packDate = $.datepicker.parseDate("dd/mm/yy",this.value);
                    self.currentSystem.updateDueDate()
                }
            } 
        });

        // //import data
        if(localStorage.getItem("trackedSystems")){
            var importedSystems = JSON.parse(localStorage.getItem("trackedSystems"))
            for(system of importedSystems){
                this.systems.push(this.buildSystemFromJSON(system))
            }
        }

        
        // let click_button = document.querySelector("#click-photo");

        // click_button.addEventListener('click', function() {
        //     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        //     let image_data_url = canvas.toDataURL('image/jpeg');

        //     // data url of the image
        //     console.log(image_data_url);
        // });
    }
})