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
$table_info = (int)$data['table_info'];

$sql = "INSERT INTO students_cos (student_id, cos_id, category, college, dep, table_info) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iisssi", $student_id, $cos_id, $category, $college, $dep, $table_info);
if ($stmt->execute()) {
    $message = "課程已加入！";
    echo $message;
    exit();
} else {
    $message = "Error: " . $stmt->error;
    echo $message;
    exit();
}
?>
