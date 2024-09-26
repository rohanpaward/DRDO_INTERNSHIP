const stick = document.querySelector('.joystick-stick');
const joystickContainer = document.querySelector('.joystick-container');
const xOutput = document.getElementById('x-output');
const yOutput = document.getElementById('y-output');

let isDragging = false;

joystickContainer.addEventListener('mousedown', startDrag);
joystickContainer.addEventListener('touchstart', startDrag);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function startDrag(event) {
    isDragging = true;
}

function drag(event) {
    if (!isDragging) return;

    // For touch support
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const rect = joystickContainer.getBoundingClientRect();
    const stickCenter = stick.offsetWidth / 2; // Get half the width of the stick

    // Calculate the position relative to the joystick container
    let x = clientX - rect.left; // X relative to joystick container
    let y = clientY - rect.top;   // Y relative to joystick container

    const maxMovement = rect.width / 2; // Maximum distance the stick can move

    // Constrain movement within the joystick's container
    const distance = Math.sqrt(x * x + y * y);
    if (distance > maxMovement) {
        const angle = Math.atan2(y, x);
        x = Math.cos(angle) * maxMovement; // Limit x based on angle
        y = Math.sin(angle) * maxMovement; // Limit y based on angle
    }

    // Position the stick directly under the cursor
    stick.style.left = `${x + maxMovement}px`; // Centered at the maximum range
    stick.style.top = `${y + maxMovement}px`;  // Centered at the maximum range

    // Output X and Y values (normalized to a -100 to 100 range)
    xOutput.textContent = ((x / maxMovement) * 100).toFixed(0);
    yOutput.textContent = ((y / maxMovement) * 100).toFixed(0);
}

function stopDrag() {
    if (!isDragging) return;
    isDragging = false;

    // Reset the stick position
    stick.style.left = `calc(50% - 25px)`; // Adjust based on the size of the stick
    stick.style.top = `calc(50% - 25px)`; // Adjust based on the size of the stick

    xOutput.textContent = 0;
    yOutput.textContent = 0;
}
const connectionStatus = document.getElementById('connection-status');

// Replace with your actual ROS bridge server details
const ROSBRIDGE_SERVER_IP = '127.0.0.1';
const ROSBRIDGE_SERVER_PORT = '9090';
let ros = null;

function initConnection() {
    ros = new WebSocket(`ws://${ROSBRIDGE_SERVER_IP}:${ROSBRIDGE_SERVER_PORT}`);

    ros.onopen = () => {
        console.log("Connection established!");
        updateStatus(true);
    };

    ros.onclose = () => {
        console.log("Connection closed!");
        updateStatus(false);
        // Attempt to reconnect every 3 seconds
        setTimeout(initConnection, 3000);
    };

    ros.onerror = (error) => {
        console.error("Connection error:", error);
    };
}

function updateStatus(isConnected) {
    connectionStatus.style.display = 'block'; // Show the alert
    if (isConnected) {
        connectionStatus.textContent = "Robot Connected";
        connectionStatus.className = "alert success"; // Add success class
    } else {
        connectionStatus.textContent = "Robot Disconnected";
        connectionStatus.className = "alert danger"; // Add danger class
    }
}

// Start the connection process
initConnection();


