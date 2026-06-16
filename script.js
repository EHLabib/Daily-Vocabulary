// =========================
// Vocabulary Manager
// =========================

// Load saved words
let words = JSON.parse(localStorage.getItem("words")) || [];

// Save data
function saveData() {
    localStorage.setItem("words", JSON.stringify(words));
}

// Update counter
function updateCount() {
    document.getElementById("count").textContent = words.length;
}

// Render words
function renderWords(list = words) {

    const container = document.getElementById("wordList");

    if (list.length === 0) {
        container.innerHTML = `
            <div class="word-card">
                <div class="meaning">
                    No words found.
                </div>
            </div>
        `;
        updateCount();
        return;
    }

    container.innerHTML = "";

    list.forEach(item => {

        container.innerHTML += `
            <div class="word-card">

                <div class="word">
                    ${escapeHTML(item.word)}
                </div>

                <div class="meaning">
                    ${escapeHTML(item.meaning)}
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
        word,
        meaning
    });

    saveData();
    renderWords();

    document.getElementById("word").value = "";
    document.getElementById("meaning").value = "";
}

// Bulk Import
// Format:
// 1|Aberration|বিচ্যুতি, অস্বাভাবিকতা
// 2|Abstruse|দুর্বোধ্য

function bulkImport() {

    const text = document
        .getElementById("bulkInput")
        .value
        .trim();

    if (!text) {
        alert("Paste vocabulary data first.");
        return;
    }

    const lines = text.split("\n");

    let imported = 0;

    lines.forEach(line => {

        line = line.trim();

        if (!line) return;

        const parts = line.split("|");

        if (parts.length >= 3) {

            const word = parts[1].trim();

            const meaning =
                parts.slice(2)
                .join("|")
                .trim();

            words.push({
                id: Date.now() + Math.random(),
                word,
                meaning
            });

            imported++;
        }
    });

    saveData();
    renderWords();

    alert(imported + " words imported successfully!");

    document.getElementById("bulkInput").value = "";
}

// Edit word
function editWord(id) {

    const item =
        words.find(w => w.id === id);

    if (!item) return;

    const newWord =
        prompt(
            "Edit Word",
            item.word
        );

    if (newWord === null) return;

    const newMeaning =
        prompt(
            "Edit Meaning",
            item.meaning
        );

    if (newMeaning === null) return;

    item.word = newWord.trim();
    item.meaning = newMeaning.trim();

    saveData();
    renderWords();
}

// Delete word
function deleteWord(id) {

    if (!confirm("Delete this word?"))
        return;

    words =
        words.filter(
            item => item.id !== id
        );

    saveData();
    renderWords();
}

// Delete all words
function clearAllWords() {

    if (
        !confirm(
            "Delete ALL words permanently?"
        )
    ) {
        return;
    }

    words = [];

    saveData();
    renderWords();
}

// Search words
function searchWords() {

    const keyword =
        document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

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

    reader.onload = function(e) {

        try {

            const imported =
                JSON.parse(
                    e.target.result
                );

            if (
                !Array.isArray(imported)
            ) {
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

// Prevent HTML injection
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

// First render
renderWords();
