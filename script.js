
var addBtn = document.getElementById("add-btn");
var toggleViewBtn = document.getElementById("toggle-view-btn");
var board = document.getElementById("board");
var tableView = document.getElementById("table-view");
var tableBody = document.getElementById("table-body");

var noteCounter = 1;
var notesArray = []; 


addBtn.onclick = function() { createNote(); };

toggleViewBtn.onclick = function() {
    var isBoardVisible = board.style.display !== "none";
    if (isBoardVisible) {
        board.style.display = "none";
        tableView.style.display = "block";
        toggleViewBtn.innerText = "Board View";
        updateTableView();
    } else {
        board.style.display = "block";
        tableView.style.display = "none";
        toggleViewBtn.innerText = "Table View";
    }
};

function createNote() {
    var noteDiv = document.createElement("div");
    noteDiv.className = "note shape-square"; 
    
    
    var offset = (noteCounter * 25) % 250; 
    noteDiv.style.top = (60 + offset) + "px";
    noteDiv.style.left = (60 + offset) + "px";

    var headerDiv = document.createElement("div");
    headerDiv.className = "note-header";

    var titleInput = document.createElement("input");
    titleInput.className = "note-title";
    titleInput.value = "Note " + noteCounter;

    var colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.className = "note-color-picker";
    colorPicker.value = "#fff740"; 
    
    
    colorPicker.oninput = function() { noteDiv.style.backgroundColor = colorPicker.value; };

    var deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.onclick = function() { 
        if(confirm("Permanently delete this note?")) {
            noteDiv.remove(); 
            notesArray = notesArray.filter(function(n) { return n.id !== noteId; });
        }
    };

    
    var shapeBar = document.createElement("div");
    shapeBar.className = "shape-selector";
    [{c:"shape-square",b:"btn-sq"},{c:"shape-circle",b:"btn-cir"},{c:"shape-portrait",b:"btn-port"}].forEach(function(s){
        var b = document.createElement("div");
        b.className = "shape-btn " + s.b;
        b.onclick = function() {
            noteDiv.classList.remove("shape-square", "shape-circle", "shape-portrait");
            noteDiv.classList.add(s.c);
        };
        shapeBar.appendChild(b);
    });

    
    var stickerBar = document.createElement("div");
    stickerBar.className = "sticker-bar";
    var stickerDisplay = document.createElement("div");
    stickerDisplay.className = "sticker-on-note";
    ["📌", "⭐", "🔥", "✅"].forEach(function(emoji) {
        var s = document.createElement("span");
        s.style.cursor = "pointer";
        s.innerText = emoji;
        s.onclick = function() { stickerDisplay.innerText = emoji; };
        stickerBar.appendChild(s);
    });

   
    headerDiv.appendChild(titleInput);
    headerDiv.appendChild(colorPicker);
    headerDiv.appendChild(deleteBtn);
    
    var wrapper = document.createElement("div");
    wrapper.className = "note-content-wrapper";
    
    var textInput = document.createElement("textarea");
    textInput.placeholder = "Type something...";

    
    var imgElement = document.createElement("img");
    imgElement.className = "note-image";
    
    var imgInput = document.createElement("input");
    imgInput.className = "image-input";
    imgInput.placeholder = "Paste image URL...";
    
    
    imgInput.oninput = function() {
        if (imgInput.value.trim() !== "") {
            imgElement.src = imgInput.value;
            imgElement.style.display = "block";
        } else {
            imgElement.style.display = "none";
        }
    };

   
    var checklistContainer = document.createElement("div");
    checklistContainer.className = "checklist-container";
    
    var addCheckBtn = document.createElement("button");
    addCheckBtn.className = "add-check-btn";
    addCheckBtn.innerText = "+ Add Task";
    addCheckBtn.onclick = function() {
        var item = document.createElement("div");
        item.className = "check-item";
        item.innerHTML = '<input type="checkbox"><input type="text" placeholder="Task...">';
        checklistContainer.appendChild(item);
    };

    wrapper.appendChild(textInput);
    wrapper.appendChild(imgElement);
    wrapper.appendChild(imgInput);
    wrapper.appendChild(checklistContainer);
    wrapper.appendChild(addCheckBtn);
    wrapper.appendChild(stickerDisplay);

    noteDiv.appendChild(headerDiv);
    noteDiv.appendChild(shapeBar);
    noteDiv.appendChild(stickerBar);
    noteDiv.appendChild(wrapper);
    board.appendChild(noteDiv);

    // Store note data in array
    var noteId = noteCounter;
    notesArray.push({
        id: noteId,
        titleInput: titleInput,
        textInput: textInput,
        colorPicker: colorPicker
    });

    noteCounter++;
    makeDraggable(noteDiv, headerDiv);
}


function updateTableView() {
    tableBody.innerHTML = ""; 
    notesArray.forEach(function(note) {
        var row = document.createElement("tr");
        
        var idCell = document.createElement("td");
        idCell.innerText = note.id;
        
        var titleCell = document.createElement("td");
        titleCell.innerText = note.titleInput.value;
        
        var contentCell = document.createElement("td");
        contentCell.innerText = note.textInput.value.substring(0, 30) + (note.textInput.value.length > 30 ? "..." : "");
        
        var colorCell = document.createElement("td");
        var colorPreview = document.createElement("div");
        colorPreview.className = "cell-color-preview";
        colorPreview.style.backgroundColor = note.colorPicker.value;
        colorCell.appendChild(colorPreview);
        colorCell.append(" " + note.colorPicker.value);
        
        row.appendChild(idCell);
        row.appendChild(titleCell);
        row.appendChild(contentCell);
        row.appendChild(colorCell);
        
        tableBody.appendChild(row);
    });
}

function makeDraggable(element, handle) {
    var ox = 0, oy = 0;
    handle.onmousedown = function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.className.includes('shape-btn')) return;
        e.preventDefault(); 
        ox = e.clientX - element.offsetLeft; oy = e.clientY - element.offsetTop;
        document.onmousemove = function(e) {
            element.style.left = (e.clientX - ox) + "px";
            element.style.top = (e.clientY - oy) + "px";
        };
        document.onmouseup = function() { document.onmousemove = null; };
    };
}
