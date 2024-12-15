<?php
require_once 'db.php';

$all_params = $_POST['data'] ?? '';

$parts = explode("/", $all_params);

if($parts[0] == "學士班課程" || $parts[0] == "研究所課程"){
    $category = $parts[1] ?? '';
    $college = $parts[2] ?? '';
    $string = $parts[3] ?? '';
    $pattern = '/\((.*?)\)/';
    if (preg_match($pattern, $string, $matches)) {
        $dep = $matches[1];
    } else {
        $dep = $parts[3] ?? '';
    }
    switch($parts[0]){
        case "學士班課程":
            $table = 'course_info_1';
            $table_info = 1;
            break;
        case "研究所課程":
            $table = 'course_info_2';
            $table_info = 2;
            break;
        default;
    }            
    $sql = "SELECT * FROM $table WHERE category = ? AND college = ? AND dep like CONCAT('%', ?, '%') ORDER BY cos_id";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("SQL 語句準備失敗: " . $conn->error);
    }
    $stmt->bind_param("sss", $category, $college, $dep);
}
elseif($parts[0] == "學士班共同課程"){
    $category = $parts[1] ?? '';
    $string = $parts[2] ?? '';
    $pattern = '/\((.*?)\)/';
    if (preg_match($pattern, $string, $matches)) {
        $dep = $matches[1];
    } else {
        $dep = $parts[2] ?? '';
    }
    $table = 'course_info_3';
    $table_info = 3;
    $sql = "SELECT * FROM $table WHERE category = ? AND dep like CONCAT('%', ?, '%') ORDER BY cos_id";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("SQL 語句準備失敗: " . $conn->error);
    }
    $stmt->bind_param("ss", $category, $dep);
}
elseif($parts[0] == "其他課程" || $parts[0] == "學分學程" || $parts[0] == "跨域學程"){
    $string = $parts[1] ?? '';
    $pattern = '/\((.*?)\)/';
    if (preg_match($pattern, $string, $matches)) {
        $dep = $matches[1];
    } else {
        $dep = $parts[1] ?? '';
    }
    switch($parts[0]){
        case "其他課程":
            $table = 'course_info_4';
            $table_info = 4;
            break;
        case "學分學程":
            $table = 'course_info_5';
            $table_info = 5;
            break;
        case "跨域學程":
            $table = 'course_info_6';
            $table_info = 6;
            break;
        default;
    }    
    $sql = "SELECT * FROM $table WHERE dep like CONCAT('%', ?, '%') ORDER BY cos_id";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("SQL 語句準備失敗: " . $conn->error);
    }
    $stmt->bind_param("s", $dep);
}
elseif($parts[0] == "教育學程"){    
    $table = 'course_info_7';
    $table_info = 7;
    $sql = "SELECT * FROM $table ORDER BY cos_id";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("SQL 語句準備失敗: " . $conn->error);
    }
}

// $cos_time = $_POST['cos_time'] ?? '';

// $sql = "SELECT * FROM $table WHERE cos_id = ? AND category = ? AND college = ? 
//         AND dep like CONCAT('%', ?, '%') AND SUBSTRING_INDEX(cos_time, '-', 1) = ?";

// $stmt->bind_param("isss", $cos_id, $category, $college, $dep);

$stmt->execute();

$result = $stmt->get_result();

$results = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $results[] = $row;
    }
}

$stmt->close();
$conn->close();
header('Content-Type: application/json');
// $results["table_info"] = $table_info;
$json_results = json_encode($results);
if ($json_results === false) {
    echo json_encode(array("error" => "Failed to encode JSON"));
} else {
    echo $json_results;
}

?>