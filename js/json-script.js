const genHTML = document.getElementById("json-output");

// FILE UPLOAD

document.addEventListener("DOMContentLoaded", function() {
    const jsonFile = document.getElementById("json-file-upload");
    const instruction1 = document.getElementById("instruction-text1");
    const instruction2 = document.getElementById("instruction-text2");
    const downloadBtn = document.getElementById("download-button");

    jsonFile.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const fileText = await file.text();
        const data = JSON.parse(fileText);
        if (!data || data.length === 0) {
            genHTML.innerHTML = "<p>No data.</p>";
            return;
        }

        jsonFile.classList.remove("upload-button-initial");
        jsonFile.classList.add("upload-button");

        instruction1.classList.remove("instruction-text");
        instruction1.classList.add("hidden-text");
        
        instruction2.classList.remove("hidden-text");
        instruction2.classList.add("instruction-text");
        
        downloadBtn.classList.remove("hidden-text");

        genHTML.innerHTML = "";
        
        genHTML.appendChild(jsonToHtml(data));
    });
});

function jsonToHtml(jsonData) {
    /*
    Generates and populates templates based on current JSON item (arrays, objects, and key-value pairs)
    Value in KV pair can be an array so it's handled as a separate template from the KV pair
    First item encountered is one solid JSON object (makes sense when you think about it)
    Recursion for each child item
    */
    if (Array.isArray(jsonData)) {
        // ARRAY - holds several objects

        const arrayElement = cloneTemplate("array-template");
        const arrayElementChildren = arrayElement.querySelector("[data-children]")

        jsonData.forEach(object => {
            const objectElement = jsonToHtml(object);
            arrayElementChildren.appendChild(objectElement);
        });

        return arrayElement;

    } else if (typeof jsonData === "object" && jsonData !== null) {
        // OBJECT - holds several value-key pairs

        const objectElement = cloneTemplate("object-template");
        const objectElementChildren = objectElement.querySelector("[data-children]")
        
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                // KEY-VALUE PAIR - holds a key and a value of some kind

                const keyvalueElement = cloneTemplate("key-value-template");
                const keyvalueChildren = keyvalueElement.querySelector("[data-children]");
                const value = jsonData[key];

                keyvalueElement.querySelector("[data-name]").textContent = key;

                if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
                    // if the value is an array of objects instead of a value
                    keyvalueChildren.appendChild(jsonToHtml(value));
                } else {
                    if (typeof value == "number") {
                        keyvalueChildren.appendChild(cloneTemplate("value-number-template"));
                        keyvalueChildren.querySelector("[data-number]").value = jsonData[key];
                    } else {
                        keyvalueChildren.appendChild(cloneTemplate("value-text-template"));
                        keyvalueChildren.querySelector("[data-text]").textContent = jsonData[key];
                    }
                }
                
                objectElementChildren.appendChild(keyvalueElement);
            }
        }
        
        return objectElement;

    } else if (typeof jsonData === "string") {
        // SIMPLE TEXT - it's just text, happens sometimes
        const txtElement = cloneTemplate("txt-template");
        txtElement.querySelector("[data-simple]").textContent = jsonData;
        return txtElement;
    } else {
        // SIMPLE NUMBER
        const numElement = cloneTemplate("num-template");
        numElement.querySelector("[data-simple-n]").value = jsonData;
        return numElement;
    }
}

// Gets a template from the html to clone, just easier than writing it each time
function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);

    return template.content.cloneNode(true).firstElementChild;
}



// FILE DOWNLOAD

document.getElementById("download-button").addEventListener("click", () => {
    const newFileObject = htmlToJson(genHTML.firstElementChild);
    downloadNewJSON(newFileObject);
});

// Largely learnt from https://www.30secondsofcode.org/js/s/json-to-file/
function downloadNewJSON(newFileObject) {
    const newFileJSON = JSON.stringify(newFileObject, null, 2);
    const jsonBlob = new Blob([newFileJSON], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonPseudoLink = document.createElement("a");
    jsonPseudoLink.href = jsonUrl;
    jsonPseudoLink.download = "json-output.json";
    jsonPseudoLink.click();
    URL.revokeObjectURL(jsonUrl);
    jsonPseudoLink.remove();
}

// Chooses a handleThing function to use
function htmlToJson(objectElement) {
    if (objectElement.hasAttribute("data-array")) return handleArray(objectElement);

    if (objectElement.hasAttribute("data-object")) return handleObject(objectElement);

    if (objectElement.hasAttribute("data-text") || objectElement.hasAttribute("data-number")) return handleValue(objectElement);
    
    if (objectElement.hasAttribute("data-simple-text")) return handleTxt(objectElement);

    if (objectElement.hasAttribute("data-simple-num")) return handleNum(objectElement);
}

// for each object in the html "array", creates an identical one in an array, which is then returned
function handleArray(objectElement) {
    const newArray = [];
    const objectElementChildren = objectElement.querySelector(":scope > [data-children]");

    objectElementChildren.querySelectorAll(":scope > [data-object], :scope > [data-simple-text]").forEach(obj => {
        const newObject = htmlToJson(obj);
        newArray.push(newObject);
    });

    return newArray;
}

// for each KV-pair in the html "object", creates an identical one in an object, which is then returned
function handleObject(objectElement) {
    const newObject = {};
    const objectElementChildren = objectElement.querySelector(":scope > [data-children]");
    
    objectElementChildren.querySelectorAll(":scope > [data-kv]").forEach(kv => {
        const kvKey = kv.querySelector(":scope > [data-name]").textContent;
        const kvValue = htmlToJson(kv.querySelector(":scope > [data-children]").firstElementChild);

        newObject[kvKey] = kvValue;
    });

    return newObject;
}

// gets KV-pair's value (if it isn't an array) and returns
function handleValue(objectElement) {
    if (objectElement.hasAttribute("data-number")) {
        // this has to be a separate check, because data-text doesn't have a .value
        if (!isNaN(objectElement.value)) {
            return Number(objectElement.value.trim());
        } else {
            return objectElement.value.trim();
        }
    } else {
        return objectElement.textContent.trim();
    }
}

// gets plain text/number from the html and returns it
function handleTxt(objectElement) {
    const objectElementChildren = objectElement.querySelector(":scope > [data-simple]");
    return objectElementChildren.textContent.trim();
}
function handleNum(objectElement) {
    const objectElementChildren = objectElement.querySelector(":scope > [data-simple-n]");
    
    if (!isNaN(objectElement.value)) {
        return Number(objectElementChildren.value.trim());
    } else {
        return objectElementChildren.value.trim();
    }
}


// SHIFT THE STRUCTURE

let htmlOffset = 0;
let scroll = 0;

document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const screenWidth = window.innerWidth;
    const outerBuffer = 300;
    const innerBuffer = 150;

    if (mouseX > screenWidth - innerBuffer) {
        scroll = -3;
    } else if (mouseX > screenWidth - outerBuffer) {
        scroll = -1;
    } else if (mouseX < innerBuffer) {
        scroll = 3;
    } else if (mouseX < outerBuffer) {
        scroll = 1;
    } else {
        scroll = 0;
    }
});

function offset() {
    htmlOffset += scroll * 2;
    htmlTrueOffset = Math.min(htmlOffset, 0);

    genHTML.style.transform = `translateX(${htmlTrueOffset}px)`;
    requestAnimationFrame(offset);
}

offset();