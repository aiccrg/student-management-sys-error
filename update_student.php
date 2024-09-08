<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $id = intval($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $age = intval($data['age']);
    $class = $conn->real_escape_string($data['class']);

    $sql = "UPDATE students SET name='$name', email='$email', age=$age, class='$class' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success"]);
    } else {
        // Log error internally
        error_log("Update error: " . $conn->error);
        echo json_encode(["status" => "error"]);
    }

    $conn->close();
}
?>
