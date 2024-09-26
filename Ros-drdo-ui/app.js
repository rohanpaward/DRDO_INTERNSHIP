const ROSBRIDGE_SERVER_IP = '127.0.0.1'; // Replace with your server IP
const ROSBRIDGE_SERVER_PORT = '9090';    // Replace with your server port
let ros = null;

function initConnection() {
    ros = new window.ROSLIB.Ros();

    ros.on('connection', () => {
        console.log("Connection established!");
        updateStatus(true);
    });

    ros.on('close', () => {
        console.log("Connection closed!");
        updateStatus(false);
        // Try to reconnect every 3 seconds
        setTimeout(initConnection, 3000);
    });

    connect();
}

function connect() {
    try {
        ros.connect(`ws://${ROSBRIDGE_SERVER_IP}:${ROSBRIDGE_SERVER_PORT}`);
    } catch (error) {
        console.log("Connection problem:", error);
    }
}

function updateStatus(isConnected) {
    const connectionStatus = document.getElementById('connection-status');
    connectionStatus.style.display = 'block'; // Show the alert
    if (isConnected) {
        connectionStatus.textContent = "Robot Connected";
        connectionStatus.className = "alert alert-success"; // Add success class
    } else {
        connectionStatus.textContent = "Robot Disconnected";
        connectionStatus.className = "alert alert-danger"; // Add danger class
    }
}

function getRobotState() {
    const poseSubscriber = new window.ROSLIB.Topic({
        ros: ros,
        name: '/turtle1/pose',
        messageType: 'turtlesim/msg/Pose'
    });

    poseSubscriber.subscribe((message) => {
        document.getElementById('position-x').textContent = `x: ${message.x.toFixed(2)}`;
        document.getElementById('position-y').textContent = `y: ${message.y.toFixed(2)}`;
        document.getElementById('orientation').textContent = `Orientation: ${message.theta.toFixed(2)}`;
        
        // Update velocities (dummy calculation, you might need to store previous positions for accurate calculation)
        const linearVelocity = Math.sqrt(message.x * message.x + message.y * message.y); // Simple calculation
        document.getElementById('linear-velocity').textContent = `Linear Velocity: ${linearVelocity.toFixed(2)}`;
        document.getElementById('angular-velocity').textContent = `Angular Velocity: ${message.theta.toFixed(2)}`; // Example
    });
}

// Initialize the connection and subscribe to robot state
initConnection();
getRobotState();
