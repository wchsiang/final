<?php
require_once 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $sql = "SELECT * FROM students WHERE student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $message = "ID already taken!";
        echo "<script type='text/javascript'>
            alert('$message');
            window.location.href = 'login_index.php';
        </script>";
        exit();
    }
    else {
        $sql = "INSERT INTO students (student_id, student_name, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iss", $id, $username, $password);
        if ($stmt->execute()) {
            $message = "註冊成功！";
            echo "<script type='text/javascript'>
                alert('$message');
                window.location.href = 'login_index.php';
            </script>";
            exit();
        } else {
            $message = "Error: " . $stmt->error;
            echo "<script type='text/javascript'>
                alert('$message');
                window.location.href = 'login_index.php';
            </script>";
        }
    }
}
?>
