const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';
const special = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';

function generatePassword(length, characters) {
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function getCharacterSet() {
    let chars = '';
    if (document.getElementById('lowercase').checked) chars += lowercase;
    if (document.getElementById('uppercase').checked) chars += uppercase;
    if (document.getElementById('digits').checked) chars += digits;
    if (document.getElementById('special').checked) chars += special;
    return chars;
}

async function generatePasswords() {
    const length = parseInt(document.getElementById('manualPasswordLength').value);
    const numPasswords = parseInt(document.getElementById('manualNumPasswords').value);
    const characters = getCharacterSet();

    if (!characters) {
        alert('Please select at least one character set.');
        return;
    }

    const passwordTableBody = document.querySelector('#passwordTable tbody');
    passwordTableBody.innerHTML = '';

    for (let i = 0; i < numPasswords; i++) {
        const password = generatePassword(length, characters);
        const row = passwordTableBody.insertRow();
        const numberCell = row.insertCell(0);
        const passwordCell = row.insertCell(1);
        const actionCell = row.insertCell(2);
        numberCell.textContent = i + 1;
        passwordCell.textContent = password;

        // Use data-password attribute to store the password
        actionCell.innerHTML = `<button class="copy-btn" data-password="${encodeURIComponent(password)}">Copy</button>`;
    }
}

async function copyToClipboard(button) {
    const text = decodeURIComponent(button.getAttribute('data-password'));
    try {
        await navigator.clipboard.writeText(text);
        alert('Password copied to clipboard');
    } catch (err) {
        alert('Failed to copy password');
    }
}

document.getElementById('generateBtn').addEventListener('click', generatePasswords);

function updateRangeValue(inputId, valueId, manualInputId) {
    const input = document.getElementById(inputId);
    const value = document.getElementById(valueId);
    input.addEventListener('input', () => {
        value.textContent = input.value;
        document.getElementById(manualInputId).value = input.value;
    });
}

document.getElementById('manualPasswordLength').addEventListener('input', (e) => {
    const value = e.target.value;
    if (value >= 4 && value <= 32) {
        document.getElementById('passwordLength').value = value;
        document.getElementById('passwordLengthValue').textContent = value;
    }
});

document.getElementById('manualNumPasswords').addEventListener('input', (e) => {
    const value = e.target.value;
    if (value >= 1 && value <= 10) {
        document.getElementById('numPasswords').value = value;
        document.getElementById('numPasswordsValue').textContent = value;
    }
});

function updateCharacterSet() {
    // Update character set when any checkbox changes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const characters = getCharacterSet();
            document.getElementById('generateBtn').disabled = !characters;
        });
    });
}

updateRangeValue('passwordLength', 'passwordLengthValue', 'manualPasswordLength');
updateRangeValue('numPasswords', 'numPasswordsValue', 'manualNumPasswords');
updateCharacterSet();

// Attach event listener to copy buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('copy-btn')) {
        copyToClipboard(event.target);
    }
});
