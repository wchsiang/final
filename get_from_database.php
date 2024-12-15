<?php
require_once 'db.php';
session_start();

$student_id = $_COOKIE['student_id'];

$sql = "SELECT * FROM students_cos WHERE student_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $results = [];
    while ($row = $result->fetch_assoc()) {
        $results[] = $row;
        var_dump($row);
        echo "<br>";
    }
    // var_dump($results);
    $final_results = [];
    echo "<br><br>";
    foreach($results as $param){   
        $cos_id =  $param['cos_id'];
        $category = $param['category'] ?? '';
        $college = $param['college'] ?? '';
        $string = $param['dep'] ?? '';
        $pattern = '/\((.*?)\)/';
        if (preg_match($pattern, $string, $matches)) {
            $dep = $matches[1];
        } else {
            $dep = $_POST['dep'] ?? '';
        }    
        $table = "course_info_" . $param["table_info"];
        // echo $table . "<br>";
        switch($param["table_info"]){
            case 1:
            case 2:                
                $sql = "SELECT * FROM $table WHERE category = ? AND college = ? AND dep like CONCAT('%', ?, '%') AND cos_id = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    die("SQL 語句準備失敗: " . $conn->error);
                }
                $stmt->bind_param("sssi", $category, $college, $dep, $cos_id);
                break;
            case 3:
                $sql = "SELECT * FROM $table WHERE category = ? AND dep like CONCAT('%', ?, '%') AND cos_id = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    die("SQL 語句準備失敗: " . $conn->error);
                }
                $stmt->bind_param("ssi", $category, $dep, $cos_id);
                break;
            case 4:
            case 5:
            case 6:
                $sql = "SELECT * FROM $table WHERE dep like CONCAT('%', ?, '%') AND cos_id = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    die("SQL 語句準備失敗: " . $conn->error);
                }
                $stmt->bind_param("si", $dep, $cos_id);
                break;
            case 7:
                $sql = "SELECT * FROM $table WHERE cos_id = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    die("SQL 語句準備失敗: " . $conn->error);
                }
                $stmt->bind_param("i", $cos_id);
                break;
            default;
        }
        $stmt->execute();
        $final_result = $stmt->get_result();
        if ($final_result->num_rows > 0) {
            while ($row = $final_result->fetch_assoc()) {
                $final_results[] = $row;
                var_dump($row);
                echo "<br>";
            }
        }
    }
    // var_dump($final_results);
    // exit();
} else {
    $message = "Error: " . $stmt->error;
    echo $message;
    // exit();
}
?>
