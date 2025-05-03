let parsedMCQs = '';

function parseMCQText(text) {
    const lines = text.trim().split('\n');
    let mcqHTML = '';
    let questionNumber = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        if (!line.match(/^[A-Da-d]\./)) {
            // Question line
            mcqHTML += `<div class="question-block"><p><strong>Q${questionNumber}:</strong> ${line}</p>`;
            questionNumber++;
        } else {
            // Option line
            const isCorrect = line.includes('*');
            const optionText = line.replace('*', '').trim();
            const optionLabel = optionText.charAt(0);
            const optionContent = optionText.slice(2); // Remove 'A. ' or 'B. ', etc.

            mcqHTML += `<label class="option">
                <input type="radio" name="q${questionNumber - 1}" data-correct="${isCorrect}">
                <span>${optionLabel}. ${optionContent}</span>
            </label>`;
        }

        // Close question block after 4 options or at next question
        if (i + 1 >= lines.length || (!lines[i + 1].startsWith('A.') && !lines[i + 1].startsWith('a.'))) {
            mcqHTML += `</div>`;
        }
    }

    parsedMCQs = mcqHTML;
}

document.getElementById('file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        localStorage.removeItem('userResults');
        parseMCQText(event.target.result);
        document.getElementById('preview').innerHTML = parsedMCQs;
    };
    reader.readAsText(file);
});

window.loadFromGitHub = async function () {
    const githubURL = prompt("Enter the RAW GitHub URL of the .txt file:");
    if (!githubURL) return;

    try {
        const response = await fetch(githubURL);
        if (!response.ok) throw new Error("Failed to fetch file from GitHub");

        const text = await response.text();

        localStorage.removeItem('userResults');
        parseMCQText(text);
        document.getElementById('preview').innerHTML = parsedMCQs;

    } catch (error) {
        alert("Error: " + error.message);
    }
};
