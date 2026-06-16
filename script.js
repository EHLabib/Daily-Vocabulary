let words =
JSON.parse(
localStorage.getItem("words")
) || [];

function saveData(){
localStorage.setItem(
"words",
JSON.stringify(words)
);
}

function updateCount(){
document.getElementById("count")
.textContent = words.length;
}

function addWord(){

```
const word =
document.getElementById("word")
.value.trim();

const meaning =
document.getElementById("meaning")
.value.trim();

if(!word || !meaning){
    alert("Please enter word and meaning.");
    return;
}

words.unshift({
    id:Date.now(),
    word,
    meaning
});

saveData();
renderWords();

document.getElementById("word").value="";
document.getElementById("meaning").value="";
```

}

function bulkImport(){

```
const text =
document.getElementById("bulkInput")
.value.trim();

if(!text){
    alert("Paste vocabulary first.");
    return;
}

const lines =
text.split("\n");

let imported = 0;

lines.forEach(line=>{

    const parts =
    line.split("|");

    if(parts.length >= 3){

        words.push({

            id:
            Date.now() +
            Math.random(),

            word:
            parts[1].trim(),

            meaning:
            parts.slice(2)
            .join("|")
            .trim()

        });

        imported++;
    }

});

saveData();
renderWords();

alert(
    imported +
    " words imported."
);

document.getElementById(
    "bulkInput"
).value="";
```

}

function renderWords(list = words){

```
const container =
document.getElementById(
    "wordList"
);

if(list.length===0){

    container.innerHTML =
    "<p>No words found.</p>";

    updateCount();
    return;
}

let html = `
<table class="vocab-table">
    <thead>
        <tr>
            <th>No</th>
            <th>Word</th>
            <th>Bangla Meaning</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
`;

list.forEach((item,index)=>{

    html += `
    <tr>
        <td>${index+1}</td>
        <td>${item.word}</td>
        <td>${item.meaning}</td>

        <td>

            <button
            class="edit-btn"
            onclick="editWord(${item.id})">
            Edit
            </button>

            <button
            class="delete-btn"
            onclick="deleteWord(${item.id})">
            Delete
            </button>

        </td>
    </tr>
    `;
});

html += `
    </tbody>
</table>
`;

container.innerHTML = html;

updateCount();
```

}

function editWord(id){

```
const item =
words.find(
w=>w.id===id
);

const newWord =
prompt(
"Edit Word",
item.word
);

if(newWord===null) return;

const newMeaning =
prompt(
"Edit Meaning",
item.meaning
);

if(newMeaning===null) return;

item.word =
newWord.trim();

item.meaning =
newMeaning.trim();

saveData();
renderWords();
```

}

function deleteWord(id){

```
if(
!confirm(
"Delete this word?"
))
return;

words =
words.filter(
w=>w.id!==id
);

saveData();
renderWords();
```

}

function clearAllWords(){

```
if(
!confirm(
"Delete ALL words?"
))
return;

words = [];

saveData();
renderWords();
```

}

function searchWords(){

```
const keyword =
document
.getElementById("search")
.value
.toLowerCase();

const filtered =
words.filter(item=>

item.word
.toLowerCase()
.includes(keyword)

||

item.meaning
.toLowerCase()
.includes(keyword)

);

renderWords(filtered);
```

}

function exportJSON(){

```
const data =
JSON.stringify(
words,
null,
2
);

const blob =
new Blob(
[data],
{
type:
"application/json"
});

const url =
URL.createObjectURL(
blob
);

const a =
document.createElement("a");

a.href = url;
a.download =
"vocabulary.json";

a.click();

URL.revokeObjectURL(url);
```

}

function importJSON(event){

```
const file =
event.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(e){

    try{

        words =
        JSON.parse(
        e.target.result
        );

        saveData();
        renderWords();

        alert(
        "Import successful."
        );

    }catch{

        alert(
        "Invalid JSON file."
        );

    }
};

reader.readAsText(file);
```

}

renderWords();
