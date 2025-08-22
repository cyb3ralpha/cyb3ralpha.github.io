document.addEventListener("DOMContentLoaded", function () {
    const terminalOutput = document.getElementById("terminal-output");
    const terminalInput = document.getElementById("terminal-input");

    const commands = {
        help: "Available commands: help, about, projects, blog, contact, clear",
        about: "Hi, I'm CyberAlpha — a cybersecurity enthusiast, ethical hacker, and developer passionate about AI and security.",
        projects: "Check out my projects on GitHub: <a href='https://github.com/YourGitHub' target='_blank'>GitHub/CyberAlpha</a>",
        blog: "Read my blogs here: <a href='https://yourbloglink.com' target='_blank'>CyberAlpha Blog</a>",
        contact: "Email: your.email@example.com | LinkedIn: <a href='https://linkedin.com/in/yourprofile' target='_blank'>Your LinkedIn</a>",
        clear: ""
    };

    function printOutput(text) {
        terminalOutput.innerHTML += `<div>${text}</div>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    terminalInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const input = terminalInput.value.trim().toLowerCase();
            printOutput(`> ${input}`);
            if (commands[input]) {
                if (input === "clear") {
                    terminalOutput.innerHTML = "";
                } else {
                    printOutput(commands[input]);
                }
            } else {
                printOutput("Command not found. Type 'help' to see available commands.");
            }
            terminalInput.value = "";
        }
    });

    printOutput("Welcome to CyberAlpha Terminal. Type 'help' to get started.");
});
