<?php
require_once 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $password = $_POST['password'];

    $sql = "SELECT password FROM students WHERE student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashed_password);
        $stmt->fetch();
        if (password_verify($password, $hashed_password)){
            setcookie("student_id", $id, time() + (86400 * 7), "/");
            header("Location: index.php");
            exit();
        }
    }
    else{
        $message = "No user found with that id!";
        echo "<script type='text/javascript'>
            alert('$message');
            window.location.href = 'login_index.php';
        </script>";
    }
}
?>
