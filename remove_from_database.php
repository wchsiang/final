<?php
require_once 'db.php';
session_start();

$input = file_get_contents("php://input");

// var_dump($input);

$data = json_decode($input, true);

$student_id = $_COOKIE['student_id'];
$cos_id = (int)$data['cos_id'];
$category = $data['category'] ?? '';
$college = $data['college'] ?? '';
$dep = $data['dep'] ?? '';

$sql = "DELETE FROM students_cos WHERE student_id = ? AND cos_id = ? AND category = ? AND college = ? AND dep = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iisss", $student_id, $cos_id, $category, $college, $dep);
if ($stmt->execute()) {
    $message = "課程已移除！";
    echo $message;
    exit();
} else {
    $message = "Error: " . $stmt->error;
    echo $message;
    exit();
}
?>
