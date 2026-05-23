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
        genHTML.appendChild(generateHTMLFromJSON(data));
    });
});

function generateHTMLFromJSON(jsonData) {
    if (Array.isArray(jsonData)) {
        // ARRAY - holds several objects

        const arrayElement = cloneTemplate("array-template");
        const arrayElementChildren = arrayElement.querySelector("[data-children]")

        jsonData.forEach(object => {
            const objectElement = generateHTMLFromJSON(object);

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
                    keyvalueChildren.appendChild(generateHTMLFromJSON(value));
                } else {
                    if (typeof value == "number") {
                        keyvalueChildren.appendChild(cloneTemplate("value-number-template"));
                        keyvalueChildren.querySelector("[data-value]").value = jsonData[key];
                    } else {
                        keyvalueChildren.appendChild(cloneTemplate("value-text-template"));
                        keyvalueChildren.querySelector("[data-value]").textContent = jsonData[key];
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