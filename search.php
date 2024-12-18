<?php
require_once 'db.php';

$all_params = $_POST['data'] ?? '';

$path_time = explode("@", $all_params);
$time_str = $path_time[1];
$parts = explode("/", $path_time[0]);
// $parts = explode("/", $all_params);

$is_select = [];
$day_l = "MTWRFSU";
$time_l = "yz1234n56789abcd";
for($i = 0; $i < strlen($day_l); $i++){
    for($j = 0; $j < strlen($time_l); $j++){
        $is_select[$i][$j] = 0;
    }
}
for($i = 0; $i < strlen($time_str); $i+=2){
    $is_select[strpos($day_l, $time_str[$i])][strpos($time_l, $time_str[$i+1])] = 1;
}

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

$stmt->execute();

$result = $stmt->get_result();
if($time_str == ''){
    if ($result->num_rows > 0) {    
        while ($row = $result->fetch_assoc()) {
            $row["table_info"] = $table_info;
            $results[] = $row;
    }
    }
}
else{
    $results = [];$pattern = '/([MTWRFSU][yz1234n56789abcd]+)[-]/';
    if ($result->num_rows > 0) {    
        while ($row = $result->fetch_assoc()) {
            $filter = 1;
            $cos_time = $row['cos_time'];        
            preg_match_all($pattern, $cos_time, $matches);
            foreach($matches[0] as $match){            
                for ($x = 1; $x < strlen($match); $x++) {
                    if ($match[$x] == '-'){
                        continue;
                    }
                    if($is_select[strpos($day_l, $match[0])][strpos($time_l, $match[$x])] == 0){
                        $filter = 0;
                        continue;
                    }
                }    
            }
            if($filter == 1){
                $row["table_info"] = $table_info;
                $results[] = $row;
            }
        }
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