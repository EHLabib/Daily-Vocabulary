// Load saved words
let words = JSON.parse(localStorage.getItem("words")) || [];

// Save to LocalStorage
function saveData() {
    localStorage.setItem("words", JSON.stringify(words));
}

// Update counter
function updateCount() {
    document.getElementById("count").textContent = words.length;
}

// Add single word
function addWord() {

    const word = document
        .getElementById("word")
        .value
        .trim();

    const meaning = document
        .getElementById("meaning")
        .value
        .trim();

    if (!word || !meaning) {
        alert("Please enter both word and meaning.");
        return;
    }

    words.unshift({
        id: Date.now(),
        word: word,
        meaning: meaning
    });

    saveData();
    renderWords();

    document.getElementById("word").value = "";
    document.getElementById("meaning").value = "";
}

// Bulk import
function bulkImport() {

    const text = document
        .getElementById("bulkInput")
        .value
        .trim();

    if (!text) {
        alert("Paste your word list first.");
        return;
    }

    const lines = text.split("\n");

    let imported = 0;

    lines.forEach(line => {

        line = line.trim();

        if (!line) return;

        // Remove numbering like:
        // 1 Aberration Meaning
        // 1<TAB>Aberration<TAB>Meaning

        line = line.replace(/^\d+\s+/, "");

        let word = "";
        let meaning = "";

        // TAB format
        if (line.includes("\t")) {

            const parts = line.split(/\t+/);

            word = parts[0]?.trim();
            meaning = parts.slice(1).join(" ").trim();

        } else {

            // Space format
            const parts = line.split(/\s+/);

            word = parts.shift();

            meaning = parts.join(" ");

        }

        if (word && meaning) {

            words.push({
                id: Date.now() + Math.random(),
                word: word,
                meaning: meaning
            });

            imported++;
        }

    });

    saveData();
    renderWords();

    alert(imported + " words imported successfully!");

    document.getElementById("bulkInput").value = "";
}

// Render all words
function renderWords(list = words) {

    const container =
        document.getElementById("wordList");

    if (list.length === 0) {

        container.innerHTML =
            "<p>No words found.</p>";

        updateCount();
        return;
    }

    container.innerHTML = "";

    list.forEach(item => {

        container.innerHTML += `
            <div class="word-card">

                <div class="word">
                    ${item.word}
                </div>

                <div class="meaning">
                    ${item.meaning}
                </div>

                <div class="actions">

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

                </div>

            </div>
        `;
    });

    updateCount();
}

// Edit word
function editWord(id) {

    const item =
        words.find(w => w.id === id);

    if (!item) return;

    const newWord =
        prompt("Edit Word", item.word);

    if (newWord === null) return;

    const newMeaning =
        prompt("Edit Meaning", item.meaning);

    if (newMeaning === null) return;

    item.word = newWord.trim();
    item.meaning = newMeaning.trim();

    saveData();
    renderWords();
}

// Delete word
function deleteWord(id) {

    const confirmDelete =
        confirm("Delete this word?");

    if (!confirmDelete) return;

    words =
        words.filter(
            item => item.id !== id
        );

    saveData();
    renderWords();
}

// Search
function searchWords() {

    const keyword =
        document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered =
        words.filter(item =>

            item.word
            .toLowerCase()
            .includes(keyword)

            ||

            item.meaning
            .toLowerCase()
            .includes(keyword)
        );

    renderWords(filtered);
}

// Export JSON
function exportJSON() {

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
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "vocabulary.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

// Import JSON
function importJSON(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = function (e) {

        try {

            const imported =
                JSON.parse(
                    e.target.result
                );

            if (!Array.isArray(imported)) {
                throw new Error();
            }

            words = imported;

            saveData();
            renderWords();

            alert(
                "JSON imported successfully!"
            );

        } catch {

            alert(
                "Invalid JSON file."
            );
        }
    };

    reader.readAsText(file);
}

// Clear all words
function clearAllWords() {

    const confirmed =
        confirm(
            "Delete ALL words?"
        );

    if (!confirmed) return;

    words = [];

    saveData();
    renderWords();
}

// First render
renderWords();
