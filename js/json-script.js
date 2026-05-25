const genHTML = document.getElementById("json-output");

document.addEventListener("DOMContentLoaded", function() {
    const jsonFile = document.getElementById("json-file-upload");

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

        //jsonFile.classList.remove("alumni-sans-bold");
        jsonFile.classList.remove("upload-button-initial");
        //jsonFile.classList.add("alumni-sans-normal");
        jsonFile.classList.add("upload-button");

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

    } else {
        //return document.createTextNode(jsonData);
        return null;
    }
}

function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);

    return template.content.cloneNode(true);
}



document.getElementById("download-button").addEventListener("click", () => {
    const newFileJSON = htmlToJson(genHTML.firstElementChild);
    downloadNewJSON(newFileJSON);
});

function downloadNewJSON(newFileJSON) {

}

function htmlToJson(objectElement) {
    if (objectElement.hasAttribute("data-array")) {
        return handleArray(objectElement);
    }
    if (objectElement.hasAttribute("data-object")) {
        return handleObject(objectElement);
    }
    if (objectElement.hasAttribute("data-kv")) {
        return handleKeyValuePair(objectElement);
    }
    if (objectElement.hasAttribute("data-text") || objectElement.hasAttribute("data-number")) {
        return handleValue(objectElement);
    }
}

function handleArray(objectElement) {
    // 1. gets array of child elements
    // 2. loops through them with htmlToJson
    // 3. returns array of this
}

function handleObject(objectElement) {
    // 1. gets array(?) of child elements
    // 2. loops through them with htmlToJson
    // 3. returns object of this
}

function handleKeyValuePair(objectElement) {
    // 1. gets key
    // 2. runs htmlToJson on value
    // 3. returns them as a pair
}

function handleValue(objectElement) {
    if (objectElement.hasAttribute("data-number")) {
        // this has to be a separate check, because data-text doesn't have a .value
        if (!isNaN(objectElement.value)) return Number(objectElement.value);
    } else {
        return objectElement.textContent;
    }
}