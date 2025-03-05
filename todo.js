const myButton = document.getElementById("addBtn");
const myBlock = document.getElementById("theblock");


myBlock.addEventListener("click", function(event) {

    
    
        if (event.target.classList.contains("todo-style")){
            var yesNo = window.prompt("Do you really want to remove this todo?");

            if (yesNo != null){
                if (yesNo.toLowerCase() == "yes"){
                event.target.remove();

                //removes the cookie
                document.cookie = "todo=; expires=Thu, 01 Jan 1990 00:00:00 UTC; path=/;";
            }
   

            else if (yesNo.toLocaleLowerCase() == "no"){
               window.alert("Carry On");
            }

            else{
                window.alert("Yes or No, bitch?");
            }
}
}
});


myButton.onclick = () =>
{
    var todo = window.prompt();
    console.log(todo);

    if (todo.length > 0){
        newTodo = document.createElement("div");
        newTodo.innerText = todo;
        
        newTodo.classList.add("todo-style");

        myBlock.prepend(newTodo);

        //stores the cookie as key value pair where todo is the value
        //currently only the latest todo is being saved and everytime new todo is entered the previous one is being overridden; 
        //Note: should take care of this.
        document.cookie = "todo=" + encodeURIComponent(todo);

    }
};


