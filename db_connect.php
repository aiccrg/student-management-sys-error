<?php
$servername = "localhost";
$username = "root"; // Update with your MySQL username
$password = ""; // Update with your MySQL password
$dbname = "students_db"; // Update with your database name

// Create connection using mysqli object-oriented approach
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Log the error and stop execution
    error_log("Connection failed: " . $conn->connect_error);
    die("Database connection error. Please try again later.");
}
?>
