<?php
include 'db_connect.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $sql = "DELETE FROM students WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success"]);
    } else {
        // Log error internally
        error_log("Delete error: " . $conn->error);
        echo json_encode(["status" => "error"]);
    }

    $conn->close();
}
?>
