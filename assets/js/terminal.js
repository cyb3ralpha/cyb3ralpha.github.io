document.addEventListener("DOMContentLoaded", function () {
    const terminalOutput = document.getElementById("terminal-output");
    const terminalInput = document.getElementById("terminal-input");
    const prompt = document.getElementById("prompt");

    const commands = {
        help: "Available commands: about, skills, projects, contact, clear",
        about: "Hi! I'm CyberAlpha, a cybersecurity enthusiast and developer.",
        skills: "Skills: Python, C++, Linux, Web Security, Ethical Hacking",
        projects: "Projects: Guardian Shield, Jarvis AI, Terminal Portfolio",
        contact: "Email: cyberalpha@example.com | GitHub: github.com/cyberalpha",
        clear: ""
    };

    function printOutput(text) {
        const newLine = document.createElement("div");
        newLine.textContent = text;
        terminalOutput.appendChild(newLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    terminalInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const input = terminalInput.value.trim();
            printOutput("> " + input);

            if (commands[input]) {
                if (input === "clear") {
                    terminalOutput.innerHTML = "";
                } else {
                    printOutput(commands[input]);
                }
            } else {
                printOutput("Command not found. Type 'help' for a list of commands.");
            }

            terminalInput.value = "";
        }
    });
});
