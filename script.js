document.addEventListener("DOMContentLoaded", function () {
    const commandInput = document.getElementById("commandInput");
    const outputDiv = document.querySelector(".output");
    
   
    const commandQueue = document.querySelector(".command-queue");
    const memoryBlocks = document.querySelectorAll(".memory-block");
    const processQueue = document.querySelector(".scheduler-queue");
    const cpuCore = document.querySelector(".cpu-core");
    const coreStatus = document.querySelector(".core-status");
    const ioQueue = document.querySelector(".io-queue");
    const metricFills = document.querySelectorAll(".metric-fill");
    const metricValue = document.querySelector(".metric-value");


    let commandHistory = [];
    let historyIndex = -1;
    
   
    const MAX_OUTPUT_LINES = 1000; 
    let isScrollLocked = false;


    appendOutput("Welcome to OS Command Execution Terminal");
    appendOutput("Type 'help' to see available commands\n");

  
    let systemMetrics = {
        cpuUsage: 0,
        memoryUsage: 0,
        activeProcesses: 0,
        uptime: 0
    };

  
    setInterval(() => {
        updateSystemMetrics();
    }, 1000);


    commandInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const command = commandInput.value.trim();
            if (command === "") return;

   
            commandHistory.push(command);
            historyIndex = commandHistory.length;


            processCommand(command);
            commandInput.value = "";
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                commandInput.value = "";
            }
        }
    });


    outputDiv.addEventListener("click", function(e) {

        if (e.target.closest('.input-area')) return;
        
        isScrollLocked = !isScrollLocked;
        if (!isScrollLocked) {
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }
    });


    commandInput.addEventListener("blur", function() {
        setTimeout(() => commandInput.focus(), 0);
    });

    function processCommand(command) {

        appendOutput(`> ${command}`);
        

        executeCommand(command);
        
        startOSAnimation(command);
    }

    function startOSAnimation(command) {
        resetComponents();

        setTimeout(() => {
            const queueItem = document.createElement("div");
            queueItem.className = "queue-item";
            commandQueue.appendChild(queueItem);
            
            setTimeout(() => {
                queueItem.classList.add("active");
            }, 100);

            setTimeout(() => {
                allocateMemory();
            }, 1000);

            setTimeout(() => {
                createProcess();
            }, 2000);

            setTimeout(() => {
                processCPU();
            }, 3000);

            setTimeout(() => {
                performIO();
            }, 4000);

            setTimeout(() => {
                completeProcess();
            }, 5000);
        }, 500);
    }

    function resetComponents() {
        commandQueue.innerHTML = "";
        
        memoryBlocks.forEach(block => {
            block.classList.remove("active");
            block.style.height = "40px";
            block.style.backgroundColor = "rgba(0, 255, 157, 0.1)";
        });
        
        processQueue.innerHTML = "";
        
        coreStatus.classList.remove("active");
        
        ioQueue.innerHTML = "";
    }

    function allocateMemory() {
        memoryBlocks.forEach(block => {
            block.classList.remove("active");
            block.style.height = "40px";
            block.style.backgroundColor = "rgba(0, 255, 157, 0.1)";
        });

        const command = commandHistory[commandHistory.length - 1];
        
        if (command.toLowerCase() === "matrix") {
            memoryBlocks.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add("active");
                    block.style.height = `${40 + Math.random() * 20}px`;
                    block.style.backgroundColor = `rgba(0, 255, 157, ${0.3 + Math.random() * 0.7})`;
                }, index * 150);
            });
        } 
        else if (command.toLowerCase() === "calc") {
            const blocks = Array.from(memoryBlocks).slice(0, 2);
            blocks.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add("active");
                    block.style.height = "50px";
                    block.style.backgroundColor = "rgba(0, 255, 157, 0.5)";
                }, index * 200);
            });
        }
        else if (command.toLowerCase() === "status") {
            const randomBlocks = Array.from(memoryBlocks)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
            
            randomBlocks.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add("active");
                    block.style.height = "45px";
                    block.style.backgroundColor = "rgba(0, 255, 157, 0.4)";
                }, index * 250);
            });
        }
        else if (command.toLowerCase() === "weather") {
            const blocks = Array.from(memoryBlocks).slice(0, 3);
            blocks.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add("active");
                    block.style.height = "40px";
                    block.style.backgroundColor = "rgba(0, 255, 157, 0.3)";
                }, index * 300);
            });
        }
        else {
            const blocks = Array.from(memoryBlocks).slice(0, 2);
            blocks.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add("active");
                    block.style.height = "40px";
                    block.style.backgroundColor = "rgba(0, 255, 157, 0.3)";
                }, index * 200);
            });
        }
    }

    function createProcess() {
        processQueue.innerHTML = "";
        
        const processStates = document.createElement("div");
        processStates.className = "process-states";
        processQueue.appendChild(processStates);

        const states = [
            { name: "Ready", color: "var(--primary-color)" },
            { name: "Running", color: "var(--secondary-color)" },
            { name: "Waiting", color: "#ffbd44" },
            { name: "Terminated", color: "#ff4444" }
        ];

        states.forEach(state => {
            const stateContainer = document.createElement("div");
            stateContainer.className = "state-container";
            stateContainer.innerHTML = `
                <div class="state-title">${state.name}</div>
                <div class="state-queue"></div>
            `;
            processStates.appendChild(stateContainer);
        });

        const command = commandHistory[commandHistory.length - 1];
        
        if (command.toLowerCase() === "matrix") {
            const readyQueue = processStates.querySelector(".state-queue");
            for (let i = 0; i < 3; i++) {
                const process = createProcessElement(`Matrix-${i + 1}`, "var(--primary-color)");
                readyQueue.appendChild(process);
                
                setTimeout(() => {
                    if (process.parentElement) {
                        moveProcess(process, "Running");
                        setTimeout(() => {
                            if (process.parentElement) {
                                moveProcess(process, "Ready");
                            }
                        }, 1000);
                    }
                }, i * 800);
            }
        }
        else if (command.toLowerCase() === "calc") {
            const readyQueue = processStates.querySelector(".state-queue");
            const process = createProcessElement("Calculator", "var(--primary-color)");
            readyQueue.appendChild(process);
            
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Running");
            }, 500);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Waiting");
            }, 1000);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Running");
            }, 1500);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Terminated");
            }, 2000);
        }
        else if (command.toLowerCase() === "status") {
            const readyQueue = processStates.querySelector(".state-queue");
            const processes = [
                createProcessElement("CPU Check", "var(--primary-color)"),
                createProcessElement("Memory Check", "var(--primary-color)"),
                createProcessElement("Process Check", "var(--primary-color)")
            ];
            
            processes.forEach((process, index) => {
                readyQueue.appendChild(process);
                setTimeout(() => {
                    if (process.parentElement) {
                        moveProcess(process, "Running");
                        setTimeout(() => {
                            if (process.parentElement) moveProcess(process, "Terminated");
                        }, 1000);
                    }
                }, index * 400);
            });
        }
        else if (command.toLowerCase() === "weather") {
            const readyQueue = processStates.querySelector(".state-queue");
            const process = createProcessElement("Weather", "var(--primary-color)");
            readyQueue.appendChild(process);
            
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Running");
            }, 500);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Waiting");
            }, 1000);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Running");
            }, 2000);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Waiting");
            }, 2500);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Running");
            }, 3000);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Terminated");
            }, 3500);
        }
        else {
            const readyQueue = processStates.querySelector(".state-queue");
            const process = createProcessElement("Command", "var(--primary-color)");
            readyQueue.appendChild(process);
            
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Running");
            }, 500);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Ready");
            }, 1000);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Running");
            }, 1500);
            setTimeout(() => {
                if (process.parentElement) moveProcess(process, "Terminated");
            }, 2000);
        }
    }

    function createProcessElement(name, color) {
        const process = document.createElement("div");
        process.className = "process-item";
        process.innerHTML = `
            <div class="process-name">${name}</div>
            <div class="process-status"></div>
        `;
        process.style.backgroundColor = color;
        return process;
    }

    function moveProcess(process, targetState) {
        if (!process.parentElement) return;

        const stateContainers = document.querySelectorAll(".state-container");
        const targetContainer = Array.from(stateContainers).find(container => 
            container.querySelector(".state-title").textContent === targetState
        );
        
        if (targetContainer) {
            const targetQueue = targetContainer.querySelector(".state-queue");
            targetQueue.appendChild(process);
            
            const status = process.querySelector(".process-status");
            status.textContent = targetState;
            
            process.classList.add("active");
            setTimeout(() => process.classList.remove("active"), 500);
        }
    }

    function processCPU() {
        coreStatus.classList.add("active");
        
        const flowEffect = document.createElement("div");
        flowEffect.className = "flow-effect";
        cpuCore.appendChild(flowEffect);
        
        setTimeout(() => {
            flowEffect.remove();
        }, 2000);
    }

    function performIO() {
        const ioItem = document.createElement("div");
        ioItem.className = "io-item";
        ioQueue.appendChild(ioItem);
        
        setTimeout(() => {
            ioItem.classList.add("active");
        }, 100);
    }

    function completeProcess() {
        updateMetrics();
    }

    function updateMetrics() {
        metricFills.forEach(fill => {
            fill.style.width = `${Math.floor(Math.random() * 100)}%`;
        });

        metricValue.textContent = "Active";
        metricValue.style.color = "var(--success-color)";
    }

    function updateSystemMetrics() {
        systemMetrics.uptime++;

        const activeProcesses = document.querySelectorAll(".process-item").length;
        const runningProcesses = document.querySelectorAll(".state-container:nth-child(2) .process-item").length;
        const waitingProcesses = document.querySelectorAll(".state-container:nth-child(3) .process-item").length;
        
        systemMetrics.cpuUsage = Math.min(100, 
            (runningProcesses * 30) +
            (waitingProcesses * 5) +
            (activeProcesses * 2)
        );

        const activeMemoryBlocks = document.querySelectorAll(".memory-block.active").length;
        const totalMemoryBlocks = memoryBlocks.length;
        systemMetrics.memoryUsage = Math.min(100, 
            (activeMemoryBlocks / totalMemoryBlocks) * 100
        );

        metricFills[0].style.width = `${systemMetrics.cpuUsage}%`;
        metricFills[1].style.width = `${systemMetrics.memoryUsage}%`;

        metricValue.textContent = `${Math.round(systemMetrics.cpuUsage)}% CPU`;
    }

    function executeCommand(command) {
        let response = "";

        if (command.toLowerCase() === "help") {
            response = `Available commands:
help     - Show this help message
clear    - Clear terminal
time     - Show current time
date     - Show current date
joke     - Tell a random joke
calc     - Calculate mathematical expression
status   - Show system status
matrix   - Show matrix effect
weather  - Show weather information
echo     - Echo back the input
`;
        } 
        else if (command.toLowerCase() === "clear") {
            outputDiv.innerHTML = "";
            appendOutput("Welcome to OS Command Execution Terminal");
            appendOutput("Type 'help' to see available commands\n");
            return;
        } 
        else if (command.toLowerCase() === "time") {
            response = `Current Time: ${new Date().toLocaleTimeString()}`;
        } 
        else if (command.toLowerCase() === "date") {
            response = `Today's Date: ${new Date().toLocaleDateString()}`;
        } 
        else if (command.toLowerCase() === "joke") {
            const jokes = [
                "Why don't programmers like nature? It has too many bugs!",
                "What do you call a programmer from Finland? Nerdic!",
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "What's a programmer's favorite place? The foo bar!",
                "Why do programmers wear glasses? Because they can't C#!"
            ];
            response = jokes[Math.floor(Math.random() * jokes.length)];
        } 
        else if (command.startsWith("calc ")) {
            try {
                let expression = command.slice(5).trim();
                if (expression === "") throw new Error("Empty expression");
                response = `Result: ${eval(expression)}`;
            } catch (error) {
                response = "Invalid calculation.";
            }
        }
        else if (command.toLowerCase() === "status") {
            response = `System Status:
CPU Usage: ${Math.round(systemMetrics.cpuUsage)}%
Memory Usage: ${Math.round(systemMetrics.memoryUsage)}%
Active Processes: ${document.querySelectorAll(".process-item").length}
Running Processes: ${document.querySelectorAll(".state-container:nth-child(2) .process-item").length}
Waiting Processes: ${document.querySelectorAll(".state-container:nth-child(3) .process-item").length}
Uptime: ${systemMetrics.uptime} seconds`;
        }
        else if (command.toLowerCase() === "matrix") {
            response = "Matrix effect activated!";
            startMatrixEffect();
        }
        else if (command.toLowerCase() === "weather") {
            response = `Current Weather:
Temperature: ${Math.floor(Math.random() * 30 + 10)}°C
Humidity: ${Math.floor(Math.random() * 100)}%
Conditions: ${["Sunny", "Cloudy", "Rainy", "Stormy"][Math.floor(Math.random() * 4)]}`;
        }
        else if (command.startsWith("echo ")) {
            response = command.slice(5);
        }
        else {
            response = `Command not found: ${command}`;
        }

        appendOutput(response);
    }

    function startMatrixEffect() {
        const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
        const matrixStreams = 20;
        const matrixSpeed = 50;
        let matrixInterval;
        let activeStreams = 0;

        const matrixContainer = document.createElement("div");
        matrixContainer.className = "matrix-container";
        outputDiv.appendChild(matrixContainer);

        matrixInterval = setInterval(() => {
            if (activeStreams >= 100) return;

            const stream = document.createElement("div");
            stream.style.position = "absolute";
            stream.style.left = `${Math.random() * 100}%`;
            stream.style.top = "-20px";
            stream.style.color = "var(--primary-color)";
            stream.style.fontSize = "20px";
            stream.style.opacity = "0.5";
            stream.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            matrixContainer.appendChild(stream);
            activeStreams++;

            let pos = -20;
            const moveStream = setInterval(() => {
                pos += 2;
                stream.style.top = `${pos}px`;
                if (pos > outputDiv.offsetHeight) {
                    stream.remove();
                    clearInterval(moveStream);
                    activeStreams--;
                }
            }, matrixSpeed);
        }, 100);

        setTimeout(() => {
            clearInterval(matrixInterval);
            matrixContainer.remove();
            appendOutput("Matrix effect deactivated.");
        }, 5000);
    }

    function appendOutput(text) {
        text.split("\n").forEach(line => {
            const newLine = document.createElement("div");
            newLine.textContent = line;
            newLine.style.marginBottom = "5px";
            outputDiv.appendChild(newLine);
        });

        while (outputDiv.children.length > MAX_OUTPUT_LINES) {
            outputDiv.removeChild(outputDiv.firstChild);
        }

        if (!isScrollLocked) {
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }

        commandInput.focus();
    }
});
