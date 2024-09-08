<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $age = intval($data['age']);
    $class = $conn->real_escape_string($data['class']);

    $sql = "INSERT INTO students (name, email, age, class) VALUES ('$name', '$email', $age, '$class')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success"]);
    } else {
        // Log error internally
        error_log("Insert error: " . $conn->error);
        echo json_encode(["status" => "error"]);
    }

    $conn->close();
}
?>
