let elementId = "none";



function fcnDetails(id) { // This function adds and removes the CSS class that will make the elements show up in the details view. It uses a single parameter of the name of the element that was clicked on.
  let elId = "#"+id;
  let tl = new TimelineMax();
  tl.to(elId, 0.3, {opacity:0, scale: 0.5}, 0);
  tl.add(function() {
    console.log(elId);
    if (elementId != "none") { // First it checks to see if the elementId variable is not empty. If it's not, that means there is or was another element that was viewed in the details view.
      if (elementId != id) { // If the element name stored in elementId is not the same as the name of the element clicked on it looks for the element listed in elementId and removes the element_detail class from it. Then the element_detail class is added to the element that was clicked on.
        document.getElementById(elementId).classList.remove("element_detail");
        document.getElementById(id).classList.add("element_detail");
      } else {
        document.getElementById(id).classList.remove("element_detail"); // If the element name in elementId is the same as the one that was clicked on, that means the user clicked on the element details view, so the element_detail class is removed to return the element to the standard size
      }
    } else {
      document.getElementById(id).classList.add("element_detail"); // If the value of elementId is empty, then just add the element_detail class to the element that was clicked on
    }
    elementId = id;
    if (window.getSelection) {window.getSelection().removeAllRanges();} // For some reason, when I would click on elements, it would keep selecting random parts of the text. I'm not sure why it was happening, but it was so these two lines basically deselect any text that was being selected when the user clicks
   else if (document.selection) {document.selection.empty();}
   // TweenMax.from(".element", 0.5, {opacity:0});
  })
  tl.to(elId, 0.3, {opacity:1, scale: 1});
}

let info = []; // This creates an empty array for the information coming from the AJAX call to be stored in. This information will be used to generate the elements, add their information, set the colors, and set their position on the table

// To change the request, edit this url The first URL listed is the actual Github location of the original JSON. The second is a local version of the JSON if you have downloaded this project from Github
let url = "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json";
// let url = "/scripts/elements.json";
// the ajax request
function ajax() {
  let xhr = new XMLHttpRequest();
  // console.log(xhr);
  xhr.open("GET", url, true);
  xhr.onreadystatechange = callback;
  // console.log(xhr.readyState, xhr.status, xhr.statusText);
  xhr.send();

  function callback() {
    // console.log(xhr.readyState, xhr.status, xhr.statusText);
    if (xhr.readyState == 4) {
      let response = JSON.parse(xhr.responseText);
      // console.log(response);
      info = response;
      // console.log(info.elements.length);
      elementBuilder();

    }
  }
}
window.onload = ajax;
// console.log(info);

function elementBuilder() {
  let style = document.createElement('style');
  let elementList = info.elements;
  let tl2 = new TimelineMax();
  tl2.pause();
  for (var element of elementList) { // This is a for..of loop that iterates over an iteratable object like an array or string or object. In this case it's iterating over the list of elements in the table and creating first the CSS then the HTML that will make up the table.
    // console.log(element);
    style.innerHTML += `.${element.name.toLowerCase()} {
      grid-column-start: ${element.xpos};
      grid-column-end: ${element.xpos === 18 ? `-1` : element.xpos + 1};
      grid-row-start: ${element.ypos};
      grid-row-end: ${element.ypos + 1};
    }`
//
    var elementStructure = `<div id="${element.name.toLowerCase()}" class="element ${element.category.toLowerCase().replace(/[^A-Z0-9]+/ig, "_")} ${element.name.toLowerCase()}" onmouseup="fcnDetails('${element.name.toLowerCase()}')">
    <div class="atomicWeight"><span class="hidden">Atomic Weight: </span> ${element.number}</div>
    <div class="elementSymbol"><span class="hidden">Symbol: </span> ${element.symbol}</div>
    <div class="elementName">${element.name}</div>
    <div class="atomicMass"><span class="hidden">Atomic Mass: </span> ${element.atomic_mass}</div>
    <div class="density"><span class="hidden">Density: ${element.density}</span></div>
    <div class="meltPoint"><span class="hidden">Melting Point: ${element.melt}</span></div>
    <div class="boilingPoint"><span class="hidden">Boiling Point: ${element.boil}</span></div>
    <div class="elementCategory"><span class="hidden">Element Category:<br> ${element.category}</span></div>
    <div class="summary"><span class="hidden">${element.summary}</span></div>
    </div>`;  // this is using template literals to build the structure of the element. The ".replace(/[^A-Z0-9]+/ig, "_")" is using regex to remove any spaces or characters that aren't numbers or letters and replace them with underscores.
    // I also used .toLowerCase() quite a bit to make sure there aren't any weird issues with different selectors coming in as different cases and not being correctly used.
    // console.log(elementStructure);
    let elementName = "."+element.name.toLowerCase();
    document.getElementById('chemTable').innerHTML += elementStructure;
    // tl2.from(".element", 0.5, {opacity:0}, Math.random() * 2);
  }

  let head = document.getElementsByTagName("head")[0].appendChild(style); // This looks in the document for the <head> tag, then in its children it adds the contents of the "style" variable, which is the variable that was used to store all of the CSS styles generated in the loop. This way the document ends up with a <style> tag in the <head> that has the specific styles needed to place each of the elements in their respective locations.
tl2.play();
TweenMax.staggerFrom(".element", 0.5, {opacity:0}, 0.05);
}

window.addEventListener('keypress', function(e) { // This adds a listener that looks for the user to press the "esc" key. If the user does, the function first checks to see if there's an element that has the same ID as the ID listed in the variable 'elementId'. If there is, it looks at the classes on it and removes the 'element_detail' class, which is the class used to show the element details view.
    if(e.key == "Escape"){
    	let id = document.getElementById(elementId);
      if (id) {
        id.classList.remove("element_detail");
      }
    }
});