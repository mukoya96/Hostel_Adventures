<?php
// db.php

// Database connection settings
$serverName = "localhost";
$DBusername = "root";
$DBpassword = "";
$DBname = "Meetingpoint";

// connect to database


$conn = mysqli_connect($serverName, $DBusername, $DBpassword, $DBname);


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the data from POST request
$data = json_decode(file_get_contents("php://input"));

// Extract data (ensure your structure matches this)
$name = $data->name;
$email = $data->email;

// Prepare and execute an SQL statement
$stmt = $conn->prepare("INSERT INTO node_test (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
