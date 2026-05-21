const genHTML = document.getElementById("json-output");

document.addEventListener("DOMContentLoaded", function() {
    const jsonFile = document.getElementById("json-file-upload");

    jsonFile.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const data = JSON.parse(file.text());
        if (!data || data.length === 0) {
            genHTML.innerHTML = "<p>No data.</p>";
            return;
        }

        genHTML.innerHTML = "";
        genHTML.appendChild(generateHTMLFromJSON(data, genHTML));
    });
});

function generateHTMLFromJSON(jsonData, parent) {
    if (Array.isArray(jsonData)) {

        const arrayElement = loadTemplate("array-template");
        const arrayElementChildren = arrayElement.querySelector("[data-children]")

        jsonData.forEach(object => {
            const objectElement = generateHTMLFromJSON(object, parent);

            arrayElementChildren.appendChild(objectElement);
        });

        return arrayElement;

    } else if (typeof jsonData === "object" && jsonData !== null) {

        const objectElement = loadTemplate("object-template");
        const objectElementChildren = objectElement.querySelector("[data-children]")
        
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const keyvalueElement = loadTemplate("key-value-template");
                
                keyvalueElement.querySelector("[data-name]").textContent = key;
                keyvalueElement.querySelector("[data-value]").textContent = jsonData[key];
                
                objectElementChildren.appendChild(keyvalueElement);
            }
        }
        
        return objectElement;

    } else {
        return document.createTextNode(jsonData);
    }
}

function loadTemplate(templateId) {
    const template = document.getElementById(templateId);

    return template.cloneNode(true).content;
}